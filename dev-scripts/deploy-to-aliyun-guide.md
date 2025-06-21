# 阿里云部署 Duipai Toolkit 项目指南

本指南适用于将本项目部署到阿里云 ECS（云服务器）环境，供公网用户访问。

---

## 1. 服务器环境准备
- 推荐操作系统：Ubuntu 20.04/22.04 或 CentOS 7/8
- 安装 Node.js 18+、npm、g++、git

```sh
# Ubuntu 示例
sudo apt update
sudo apt install -y nodejs npm g++ git
# 建议用 nvm 安装 Node.js LTS 版本
```

## 2. 开放安全组端口
- 登录阿里云控制台，找到 ECS 实例，安全组规则放行 3001 端口（或 80/443 端口用于 nginx 反代）。

## 3. 上传或拉取项目
- 推荐用 git clone 拉取仓库，或用 SFTP 工具上传完整项目目录。

```sh
git clone <你的仓库地址>
cd Duipai-Toolkit-2.0
```

## 4. 安装依赖并构建前端
```sh
npm install
cd server && npm install && cd ..
npm run build
```

## 5. 启动后端并托管前端
```sh
cd dev-scripts
export NODE_ENV=production
export STATIC_SERVE=1
node ../server/index.js
```
- 访问 http://ECS公网IP:3001 即可体验（如需 80/443 端口请用 nginx 反代）。

## 6. 推荐用 pm2 守护进程
```sh
npm install -g pm2
pm2 start ../server/index.js --name duipai-toolkit --env production
```

## 7. 用 nginx 反向代理（可选，推荐）
- 安装 nginx：`sudo apt install nginx`
- 配置 /etc/nginx/sites-available/default 或新建配置：

```nginx
server {
    listen 80;
    server_name your-domain.com; # 或 ECS 公网 IP
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
- 重载 nginx：`sudo systemctl reload nginx`

## 8. 常见问题
- 端口未放行：请检查安全组和防火墙
- g++ 未安装：`sudo apt install g++`
- 权限问题：确保 node、g++、dist、server/uploads 目录有写权限
- 访问慢：建议绑定域名并用 CDN 加速

---
如需更多云平台部署支持，请联系开发者或查阅 dev-scripts/deploy-to-server-guide.md。
