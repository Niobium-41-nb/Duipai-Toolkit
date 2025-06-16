@echo off
REM 启动算法竞赛对拍工具前后端服务

REM 启动后端（隐藏窗口）
start "后端" /min cmd /c "cd /d "%~dp0server" && npm install && npm start"

REM 启动前端（隐藏窗口）
start "前端" /min cmd /c "cd /d "%~dp0" && npm install && npm run dev"

echo go to http://localhost:5173/

timeout /t 5 /nobreak >nul

start http://localhost:5173/

pause

REM 关闭前后端窗口
for /f "tokens=2 delims==;" %%i in ('tasklist /v /fi "windowtitle eq 后端" /fo csv ^| findstr /i "cmd.exe"') do taskkill /f /pid %%i >nul 2>nul
for /f "tokens=2 delims==;" %%i in ('tasklist /v /fi "windowtitle eq 前端" /fo csv ^| findstr /i "cmd.exe"') do taskkill /f /pid %%i >nul 2>nul
