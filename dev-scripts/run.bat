@echo off
REM === Duipai Toolkit 本地一键开发脚本 ===
setlocal enabledelayedexpansion
set LOGDIR=%~dp0..\logs
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

REM 检查前端依赖
if not exist "%~dp0..\node_modules\@monaco-editor\react" (
  echo Installing frontend dependencies...
  cd /d %~dp0.. && npm install
)

REM 检查后端依赖
if not exist "%~dp0..\server\node_modules\express" (
  echo Installing backend dependencies...
  cd /d %~dp0..\server && npm install
)
cd /d %~dp0..

REM 检查端口占用
netstat -ano | findstr 5173 >nul
if !errorlevel! == 0 (
  echo [警告] 5173端口已被占用，前端可能无法正常启动。
)
netstat -ano | findstr 3001 >nul
if !errorlevel! == 0 (
  echo [警告] 3001端口已被占用，后端可能无法正常启动。
)

REM 启动前端开发服务器
start "Frontend Dev Server" cmd /c "npm run dev > "%LOGDIR%\frontend.log" 2>&1"

REM 启动后端服务器
start "Backend Server" cmd /c "cd server && npm start > "%LOGDIR%\backend.log" 2>&1"

REM 等待前端端口开放后自动打开页面
set /a _wait=0
:waitloop
  timeout /t 1 >nul
  set /a _wait+=1
  netstat -ano | findstr 5173 >nul
  if !errorlevel! == 0 goto openbrowser
  if !_wait! geq 15 goto openbrowser
  goto waitloop
:openbrowser
start http://localhost:5173

echo === Duipai Toolkit started! ===
echo You can access the frontend at http://localhost:5173
pause