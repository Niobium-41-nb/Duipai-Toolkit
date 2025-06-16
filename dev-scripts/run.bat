@echo off
set LOGDIR=%~dp0..\logs
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

REM Auto check dependencies
if not exist "%~dp0..\node_modules\@monaco-editor\react" (
  echo [Dependency Check] Missing @monaco-editor/react
) else (
  echo [Dependency Check] @monaco-editor/react installed
)
if not exist "%~dp0..\node_modules\monaco-editor" (
  echo [Dependency Check] Missing monaco-editor
) else (
  echo [Dependency Check] monaco-editor installed
)

REM Check port usage
netstat -ano | findstr 5173 >nul
if %errorlevel%==0 (
  echo [Port Check] Frontend port 5173 is occupied
) else (
  echo [Port Check] Frontend port 5173 is available
)
netstat -ano | findstr 3001 >nul
if %errorlevel%==0 (
  echo [Port Check] Backend port 3001 is occupied
) else (
  echo [Port Check] Backend port 3001 is available
)

REM Start frontend service and output log
start "Frontend Service" cmd /c "cd /d %~dp0.. && npm run dev > "%LOGDIR%\frontend.log" 2>&1"

REM Start backend service and output log
start "Backend Service" cmd /c "cd /d %~dp0..\server && npm install && npm start > "%LOGDIR%\backend.log" 2>&1"

echo All services started. Logs are saved in the logs directory.

echo Frontend service is running on http://localhost:5173

start http://localhost:5173

pause
