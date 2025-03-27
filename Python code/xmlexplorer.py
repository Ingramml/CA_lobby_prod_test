import pandas as pd
import os
from dotenv import load_dotenv

#df=pd.read_xml('/Users/michaelingram/Documents/GitHub/CA_leg/5-31-23 Formal Agenda - Final/BILL_VERSION_TBL_1.lob')
load_dotenv()
apikey=os.getenv('API_KEY')
print(apikey)