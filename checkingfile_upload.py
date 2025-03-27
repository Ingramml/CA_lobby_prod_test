import psycopg2
import os
import csv
from datetime import datetime

# Fake Database Configuration (Replace with real credentials)
DB_CONFIG = {
    "dbname": "testingdb",
    "user": "postgres",
    "password": "",
    "host": "localhost",
    "port": "5433"
}

# Define your table name (Replace with actual table name)
TABLE_NAME = "test_table"

# Define expected number of columns
EXPECTED_COLUMNS = 52  # Change this based on your actual table structure

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

    # Open files for reading and error logging (Use ASCII encoding)
    with open(input_file, "r", encoding="ascii", errors="replace") as f_in, \
         open(error_file, "w", newline="", encoding="ascii", errors="replace") as f_err:

        csv_reader = csv.reader(f_in, delimiter="\t")
        csv_writer = csv.writer(f_err, delimiter="\t")

        # Process each line
        for i, row in enumerate(csv_reader, start=1):
            try:
                # Ensure the row has the correct number of columns
                if len(row) != EXPECTED_COLUMNS:
                    raise ValueError(f"Incorrect column count: expected {EXPECTED_COLUMNS}, got {len(row)}")

                # Construct an INSERT query (modify based on your table columns)
                query = f"INSERT INTO {TABLE_NAME} (col1, col2, col3) VALUES (%s, %s, %s);"
                cursor.execute(query, row)

            except Exception as e:
                print(f"⚠️ Error on line {i}: {e}")
                csv_writer.writerow(row)  # Save problematic row

        # Commit changes
        conn.commit()
        print("✅ Upload complete")

    # Close database connection
    cursor.close()
    conn.close()
    print(f"📂 Error file saved to: {error_file}")

# Example usage
if __name__ == "__main__":
    input_file = "your_large_file.tsv"  # Replace with your file
    upload_tsv_to_postgres(input_file)
