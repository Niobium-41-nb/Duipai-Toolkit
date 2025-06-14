@echo off
REM 启动算法竞赛对拍工具前后端服务

REM 启动后端
start "后端" cmd /k "cd /d "%~dp0server" && npm install && npm start"

REM 启动前端
start "前端" cmd /k "cd /d "%~dp0" && npm install && npm run dev"

echo 已自动启动前后端服务，请在浏览器访问 http://localhost:5173/

start http://localhost:5173/

pause
