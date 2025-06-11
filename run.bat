echo off

if not exist "testcases" mkdir testcases
if not exist "bin" mkdir bin

python clear_testcases.py

g++ -std=c++17 -O2 -o bin/prog.exe src/prog.cpp
g++ -std=c++17 -O2 -o bin/brute.exe src/brute.cpp
g++ -std=c++17 -O2 -o bin/gen.exe src/gen.cpp

python duipai.py
start http://localhost:8000
python -m http.server 8000

