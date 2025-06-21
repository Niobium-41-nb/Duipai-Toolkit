# 项目部署到服务器指南

本指南适用于将 Duipai Toolkit 项目部署到 Linux 或 Windows 服务器，供他人在线访问。

---

## 1. 环境准备
- Node.js 18+（建议 LTS 版本）
- g++（用于 C++ 代码编译）
- Git（推荐，用于拉取/同步项目）

## 2. 上传项目文件
- 推荐上传整个项目文件夹（可用 SFTP、Xftp、WinSCP、scp、rsync 等工具）。
- 也可在服务器用 git clone 拉取仓库。

## 3. 安装依赖
```sh
cd 项目目录
npm install
cd server
npm install
cd ..
```

## 4. 构建前端静态资源
```sh
npm run build
```

## 5. 启动后端并托管前端（生产模式）
```sh
cd dev-scripts
# Windows:
build-and-serve.bat
# Linux/macOS:
export NODE_ENV=production
export STATIC_SERVE=1
node ../server/index.js
```
- 访问服务器 http://服务器IP:3001 即可使用（如需 80/443 端口请用 nginx 反代）。

## 6. 可选：用 pm2/forever 守护后端进程
```sh
npm install -g pm2
pm2 start server/index.js --name duipai-toolkit --env production
```

## 7. 可选：用 nginx 反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 8. 常见问题
- 端口被占用：修改 server/index.js 的 PORT 或 nginx 配置
- g++ 未安装：`sudo apt install g++` 或 `yum install gcc-c++`
- 权限问题：确保 node、g++、dist、server/uploads 目录有写权限

---
如有更多部署需求或遇到问题，请联系开发者或查阅 README。
