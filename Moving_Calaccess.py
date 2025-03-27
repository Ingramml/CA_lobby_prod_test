import os
import shutil
import zipfile
import glob


input_dir = '/Users/michaelingram/Downloads/CalAccess/DATA'
output_dir = "output"

downloaded_files=glob.glob(input_dir+'/*')
lower_downloaded_files=[os.path.basename(file).lower() for file in downloaded_files] #lowers files names




file_names = [
    "cvr_lobby_disclosure_cd",
    "cvr_registration_cd",
    "latt_cd",
    "lccm_cd",
    "lemp_cd",
    "lexp_cd",
    "loth_cd",
    "lpay_cd",
    "filername_cd"
]

set_file_names = set(file_names).intersection(lower_downloaded_files) #finds the intersection of the two sets
#print(set_file_names)

for files in downloaded_files:
    lower_downloaded_file=os.path.basename(files).lower()
    print(lower_downloaded_file)
    if lower_downloaded_file[:-4] in file_names:
        shutil.move(files, output_dir)
        
