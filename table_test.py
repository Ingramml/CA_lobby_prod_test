import psycopg2

# Database Configuration
DB_CONFIG = {
    "dbname": "testingdb",
    "user": "michaelingram",
    "password": "",
    "host": "localhost",
    "port": "5433"
}

def get_all_tables():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to PostgreSQL")

        # Query to get all tables
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        """

        cursor.execute(query)
        tables = cursor.fetchall()

        # Print all table names
        print("Tables in the database:")
        for table in tables:
            print(table[0])

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Call the function to get all tables
get_all_tables()

def get_all_columns(table_name):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print(f"✅ Connected to PostgreSQL to get columns for table: {table_name}")

        # Query to get all columns from the specified table
        query = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        """

        cursor.execute(query)
        columns = cursor.fetchall()

        # Print all column names
        print(f"Columns in the table '{table_name}':")
        for column in columns:
            print(column[0])

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Call the function to get all tables
get_all_tables()

# Call the function to get all columns from a specific table
table_name = "loth_cd_clone"  # Replace with your table name
get_all_columns(table_name)