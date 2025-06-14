import os
from flask import Flask, request, send_from_directory

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, 'src')

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/editor')
def editor():
    return send_from_directory(BASE_DIR, 'editor.html')

@app.route('/api/src/<filename>', methods=['GET', 'POST'])
def handle_src_file(filename):
    # 只允许修改特定文件
    allowed_files = ['brute.cpp', 'gen.cpp', 'prog.cpp']
    if filename not in allowed_files:
        return "Invalid file", 403
    
    filepath = os.path.join(SRC_DIR, filename)
    
    if request.method == 'GET':
        try:
            with open(filepath, 'r') as f:
                return f.read(), 200
        except FileNotFoundError:
            return "File not found", 404
            
    elif request.method == 'POST':
        content = request.data.decode('utf-8')
        try:
            with open(filepath, 'w') as f:
                f.write(content)
            return "File saved successfully", 200
        except Exception as e:
            return f"Error saving file: {str(e)}", 500

@app.route('/api/run', methods=['POST'])
def run_test():
    # 执行对拍程序
    os.system('python duipai.py')  # 或 duipai.bat
    with open('testcases/output.txt', 'r') as f:
        result = f.read()
    return result, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
