import psycopg2
import os
import csv

# Fake Database Configuration (Replace with real credentials)
DB_CONFIG = {
    "dbname": "testingdb",
    "user": "postgres",
    "password": "",
    "host": "localhost",
    "port": "5433"
}

# Define your table name (Replace with actual table name)
TABLE_NAME = "loth_cd"

# Define expected number of columns
EXPECTED_COLUMNS = 52  # Ensure TSV rows match this number

def upload_tsv_to_postgres(input_file):
    """
    Reads a TSV file line by line and uploads it to PostgreSQL.
    If a line causes an error, it is saved to an error file.
    """

    # Generate error file name based on input file
    base_name = os.path.splitext(input_file)[0]
    error_file = f"{base_name}_errors.tsv"

    # Establish database connection
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to PostgreSQL")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return

    # Open files for reading and error logging (Force UTF-8 encoding)
    with open(input_file, "r", encoding="utf-8", errors="replace") as f_in, \
         open(error_file, "w", newline="", encoding="utf-8", errors="replace") as f_err:

        csv_reader = csv.reader(f_in, delimiter="\t")
        csv_writer = csv.writer(f_err, delimiter="\t")

        # Process each line
        for i, row in enumerate(csv_reader, start=1):
            try:
                # Ensure the row has the correct number of columns
                if len(row) != EXPECTED_COLUMNS:
                    raise ValueError(f"Incorrect column count: expected {EXPECTED_COLUMNS}, got {len(row)}")

                # Convert row to tuple (Fix: Prevents TypeError)
                row_tuple = tuple(row)

                # Construct an INSERT query dynamically for 52 columns
                placeholders = ', '.join(['%s'] * EXPECTED_COLUMNS)
                query = f"INSERT INTO {TABLE_NAME} VALUES ({placeholders});"
                cursor.execute(query, row_tuple)

            except Exception as e:
                print(f"⚠️ Error on line {i}: {e}")
                csv_writer.writerow([remove_non_ascii(value) for value in row])  # Save problematic row

        # Commit changes
        conn.commit()
        print("✅ Upload complete")

    # Close database connection
    cursor.close()
    conn.close()
    print(f"📂 Error file saved to: {error_file}")

def remove_non_ascii(text):
    """Removes or replaces non-ASCII characters in a string."""
    return text.encode("ascii", "ignore").decode("ascii")  # Ignore non-ASCII characters

# Example usage
if __name__ == "__main__":
    input_file = "/Users/michaelingram/Downloads/CalAccess/DATA/CVR_LOBBY_DISCLOSURE_CD.TSV"  # Replace with your file
    upload_tsv_to_postgres(input_file)
