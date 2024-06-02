import argparse
import json
import vrchatapi
from vrchatapi.api.worlds_api import WorldsApi
import requests
from PIL import Image
from io import BytesIO
import os,re

images_path="./vr/worlds/images"
user_agent="emymin.net/vr/worlds"

def download_world_image(id,url):
    headers={
        'User-Agent':user_agent
    }
    response = requests.get(url,headers=headers)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))
    image = image.convert("RGB")
    save_path = os.path.join(images_path,id+".jpg")
    image.save(save_path,format="JPEG")

parser = argparse.ArgumentParser(
    prog="Add Worlds",
    description="Adds worlds to the world list",
    epilog="that's all :3"
)
parser.add_argument("worlds",nargs="+")
parser.add_argument("-i","--images",default=True)
args = parser.parse_args()

worlds_to_add = []
with vrchatapi.ApiClient() as api_client:
    api_client.user_agent=user_agent
    world_api = WorldsApi(api_client)
    for world_id in args.worlds:
        world = world_api.get_world(world_id)
        data = {
            'id': world_id,
            'name': world.name,
            'author_name': world.author_name,
            'description': world.description,
            'publication_date': world.publication_date,
            'tags': []
        }
        worlds_to_add.append(data)
        data_json = json.dumps(data,indent=4)
        print(data_json)
        if args.images:
            download_world_image(world_id,world.image_url)

with open("./_data/worlds.json","r",encoding='utf8') as file:
    worlds_list = json.load(file)
worlds_list.extend(worlds_to_add)
with open('./_data/worlds.json', 'w',encoding='utf8') as file:
    s = json.dumps(worlds_list,indent=2,ensure_ascii=False)
    # I just want the tags to be all on the same line with the same formatting I always use so REGEX TIME
    pattern = re.compile(r'("tags": \[)([^\]]+?)(\])', re.DOTALL)
    s = re.sub(pattern, lambda m: m.group(1) + ','.join(re.sub(r'\s+', '', tag) for tag in m.group(2).split(',')) + m.group(3), s)
    file.write(s)