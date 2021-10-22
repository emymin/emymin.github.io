#NationStates API is restricitve in terms of requests, and flags can't be loaded in browser due to CORS policy
#so sadly, gotta do this statically from a script, and update it every now and then
import requests
import xmltodict
import json
import mimetypes
import os
import shutil
from cairosvg import svg2png


flagDataPath = "./webgl/assets/data/flags/"

shutil.rmtree(flagDataPath, ignore_errors=True)
os.mkdir(flagDataPath)
os.mkdir(flagDataPath+"flags")

regionEndPoint = "https://www.nationstates.net/cgi-bin/api.cgi?region="
nationEndPoint = "https://www.nationstates.net/cgi-bin/api.cgi?nation="

regionName = "the_lands_of_the_great_oh"

headers={
    'User-Agent': 'emymin.github.io',
}

regionRequest = requests.get(regionEndPoint+regionName,headers=headers)
regionData = xmltodict.parse(regionRequest.content)
nations=regionData["REGION"]["NATIONS"].split(":")

data={}

for nationName in nations:
    print("Fetching nation "+nationName)
    nationRequest = requests.get(nationEndPoint+nationName,headers=headers)
    nationData = (xmltodict.parse(nationRequest.content))["NATION"]
    
    flagURL = nationData["FLAG"]
    flagRequest = requests.get(flagURL)
    type = flagRequest.headers["content-type"]
    extension = mimetypes.guess_extension(type)
    
    if(extension==".svg"):
        print("Flag is SVG, converting to PNG")
        svg2png(bytestring=flagRequest.content,write_to=flagDataPath+"flags/"+nationName+".png")
        extension=".png"
    else:
        with open(flagDataPath+"flags/"+nationName+extension,"wb") as file:
            file.write(flagRequest.content)
    

    data[nationName] = {"motto":nationData["MOTTO"],"flag":nationName+extension}

with open(flagDataPath+"flags.json","w") as file:
    json.dump(data,file,indent=4)