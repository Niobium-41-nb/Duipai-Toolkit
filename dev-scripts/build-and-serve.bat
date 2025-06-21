@echo off
REM === 一键生产部署脚本 ===
REM 1. 构建前端静态资源
cd /d %~dp0.. && npm install
npm run build

REM 2. 安装后端依赖
cd server && npm install
cd ..

REM 3. 启动后端并托管 dist 静态前端（生产模式）
set NODE_ENV=production
set STATIC_SERVE=1
node server/index.js
