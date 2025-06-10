@echo off
python duipai.py
start http://localhost:8000
python -m http.server 8000

