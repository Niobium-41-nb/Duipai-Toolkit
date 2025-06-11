@echo off
@REM chcp 65001 > nul

@REM REM Environment Check

@REM REM Check Python
@REM where python >nul 2>nul
@REM if %errorlevel% neq 0 (
@REM     echo [Env Check] Python not found. Please install Python and add it to PATH!
@REM     pause
@REM     exit /b
@REM )

@REM REM Check Python modules
@REM python -c "import difflib, shutil, subprocess, os, sys, json" 2>nul
@REM if %errorlevel% neq 0 (
@REM     echo [Env Check] Missing required Python modules. Please check Python installation.
@REM     pause
@REM     exit /b
@REM )

@REM REM Check C++ compiler
@REM where g++ >nul 2>nul
@REM if %errorlevel% neq 0 (
@REM     where cl >nul 2>nul
@REM     if %errorlevel% neq 0 (
@REM         echo [Env Check] C++ compiler (g++/cl) not found. Install MinGW or VS Build Tools.
@REM         pause
@REM         exit /b
@REM     )
@REM )

@REM echo All environment checks passed

python duipai.py
start http://localhost:8000
python -m http.server 8000