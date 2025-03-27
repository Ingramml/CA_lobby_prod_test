import bln
import ssl
import certifi
import datetime
from bln import Client
from dotenv import load_dotenv
import os
import pandas as pd

#ssl_context = ssl.create_default_context(cafile=certifi.where())
today = datetime.date.today()
# Load the .env file
load_dotenv('/Users/michaelingram/Documents/GitHub/CA_leg/.env')
apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczODc3NjE4OSwianRpIjoiNzk4YzUwMzMtNjZmZS00NTUzLThhZjktNjQ3ZTUwOWYyMDBhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjgzYzExNWYzLWQ5ZTMtNDAyMy1hYzYyLTMyNzllNzljOGJiNCIsIm5iZiI6MTczODc3NjE4OX0.d_JOc5ATxy0HSSP0Xkf8l6PdJDHwYWca8YCfRhLeodU'
client = Client(apiKey) #loads the client with the API key
project_name='California campaign finance data'
project_id ='UHJvamVjdDo2MDVjNzdiYS0wODI4LTRlOTEtOGM3OC03ZjA4NGI2ZDEwZWE='

bln.pandas.register(pd) #registers the pandas extension


project_files=client.get_project_by_id(project_id)


project_df=pd.DataFrame.from_dict(project_files['files'])
project_df.to_csv('project_files_'+str(today)+'_.csv')



"""
#File downloads
#TODO: Add a loop to download all files basde on project_df file update times
#connect to SQL database and check if the Filing_Id has been downloaded before
#If not, download the file and update the SQL database


dflpay = pd.read_bln(project_id, 'lpay_cd.csv', apiKey)
dflpay.to_csv('lpay_cd_downloaded'+str(today)+'.csv',index=False)

dflobydisclosure= pd.read_bln(project_id, 'cvr_lobby_disclosure_cd.csv', apiKey)
dflobydisclosure.to_csv('cvr_lobby_disclosure_cd_downloaded'+str(today)+'.csv',index=False)

dflatt= pd.read_bln(project_id, 'latt_cd.csv', apiKey)
dflatt.to_csv('latt_cd_downloaded_'+str(today)+'.csv',index=False)

*/



#project = client.search_projects(lambda project: project["id"] == project_id)

#client.download_file(project_id, "filers_cd.csv")
"""
