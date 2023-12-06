import flask, json, requests
from io import BytesIO
from aip import AipOcr
import pymongo

client = pymongo.MongoClient("mongodb://dds-bp1cc661f40cded41.mongodb.rds.aliyuncs.com:3717/")
db = client["database"]
collection = db["collection"]

APP_ID = '29684321'
API_KEY = 'q6iA32zlO8guNI2tTl137GU0'
SECRET_KEY = '5Lrqx99hDBh3kDZXaF3OnnLsNt6MGyRk'

api = flask.Flask(__name__)

def upload(file, tokens):
    headers = {'Authorization': tokens}
    files = {'smfile': file}
    url = 'https://smms.app/api/v2/upload'
    res = requests.post(url, files=files, headers=headers).json()
    print(json.dumps(res, indent=4))

@api.route('/')
def hello_world():
    return 'Hello World!'

@api.route('/index',methods=['get'])
def index():
    ren = {'msg':'成功访问接口','msg_code':200}
    return json.dumps(ren,ensure_ascii=False)

@api.route('/login', methods=['post'])
def login():
    file = flask.request.files['file']
    token = flask.request.form.get('token')
    file_data = file.read()
    file = BytesIO(file_data)
    file.name = 'image.png'
    upload(file, token)
    img_data = file_data

    img_id = collection.insert_one({'img': img_data}).inserted_id

    client = AipOcr(APP_ID, API_KEY, SECRET_KEY)

    result = client.basicGeneral(file_data)
    text = result["words_result"]

    text_str = ""
    for item in text:
        text_str += item["words"]

    print(text_str)
    return json.dumps(text_str, ensure_ascii=False)


if __name__ == '__main__':
    api.run(port=8888, debug=True, host='127.0.0.1')
