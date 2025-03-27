import psycopg2 as db

conn_string="dbname='testingdb' host='localhost' user='postgres' password=''"
conn=db.connect(conn_string)

cur=conn.cursor()

query = "INSERT INTO practice (id, name, street, city, zip) VALUES (%s, %s, %s, %s, %s)"
values = (1, 'Big Bird', 'Sesame Street', 'Fakeville', '12345')


cur.mogrify(query,values)
cur.execute(query,values)

conn.commit()