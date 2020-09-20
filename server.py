from classify import Classify
from flask import request, Flask

app = Flask(__name__)
imgdir = './images/'

@app.route('/api/', methods=["POST"])
def classify_img():
    url = request.headers.get('url')
    return str(c.classify(url))

if __name__ == "__main__":
    c = Classify()
    app.run(debug=True)
    
