from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__, static_folder='.')
CORS(app)

SRC_DIR = os.path.join(os.getcwd(), 'src')

@app.route('/api/src/<filename>', methods=['GET', 'POST'])
def src_file(filename):
    path = os.path.join(SRC_DIR, filename)
    if request.method == 'GET':
        if not os.path.exists(path):
            return '', 404
        with open(path, encoding='utf-8') as f:
            return f.read()
    else:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(request.data.decode('utf-8'))
        return '保存成功'

@app.route('/api/run', methods=['POST'])
def run_test():
    # 运行 duipai.py 并返回输出
    try:
        result = subprocess.run(['python', 'duipai.py'], capture_output=True, text=True, timeout=60)
        return result.stdout + result.stderr
    except Exception as e:
        return str(e), 500

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

@app.route('/')
def root():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)