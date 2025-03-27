import psycopg2
import os
import csv

# Database Configuration
DB_CONFIG = {
    "dbname": "testingdb",
    "user": "michaelingram",
    "password": "",
    "host": "localhost",
    "port": "5433"
}

# Define your table name
TABLE_NAME = "lexp_cd_clone"
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()
print("✅ Connected to PostgreSQL") 

query = f'DELETE FROM {TABLE_NAME} ;'
cursor.execute(query)
print(f'Rows deleted: {cursor.rowcount}')
conn.commit()

csv_file_path = "/Users/michaelingram/Downloads/CalAccess/DATA/LEXP_CD.TSV"
#filename=os.path.basename(csv_file_path)[:-4]
error_log_path = "/Users/michaelingram/Documents/GitHub/CA_lobby/"+TABLE_NAME+"_error_log.txt"


try:
    with open(csv_file_path, "r", encoding="utf-8") as file, open(error_log_path, "w", encoding="utf-8") as error_log:
        reader = csv.reader(file, delimiter='\t')  # Specify tab delimiter
        headers = next(reader)  # Read header row

        # Wrap column names in double quotes
        column_names = ', '.join([f'"{col}"' for col in headers])  # Wrap each column in double quotes
        values_template = ', '.join(['%s'] * len(headers))  # Placeholder for values

        # Construct the INSERT query
        insert_query = f'INSERT INTO {TABLE_NAME} ({column_names}) VALUES ({values_template})'

        for row in reader:
            try:
                cursor.execute(insert_query, row)
            except Exception as row_error:
                error_log.write(f"Error inserting row {row}: {row_error}\n")
        
        conn.commit()  # Commit after all rows are inserted

    print("CSV uploaded successfully, one line at a time!")

except Exception as e:
    print(f"An error occurred: {e}")
    conn.rollback()  # Rollback in case of error

finally:
    # Close the connection
    cursor.close()
    conn.close()