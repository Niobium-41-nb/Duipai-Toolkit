# Duipai Toolkit

本项目是一个为算法竞赛选手设计的对拍工具网站，包含 React 前端和 Node.js + Express 后端。

## 功能简介
- 支持上传暴力解（brute.cpp）、测试解（prog.cpp）、数据生成器（gen.cpp）
- 提供可扩展的预设数据生成器（支持自定义维护）
- 自动编译、运行并对拍多组数据，展示结果
- 支持自定义对拍轮数
- 支持只显示不一致结果筛选
- 预设代码悬停可动态预览
- “关于我们”页面支持作者介绍、广告与头像展示
- 对拍结果支持多格式导出（TXT、ZIP、Excel、JSON）
- 本地一键开发脚本，支持依赖检测、端口检测、自动打开页面
- 提供阿里云/服务器部署指南

## 目录结构
- `/src`：前端 React 代码
  - `App.jsx` 主页面与路由
  - `About.jsx` 关于我们页面
- `/server`：后端 Node.js + Express 代码
- `/presets`：可维护的 C++ 预设生成器代码
- `/dev-scripts`：开发与部署脚本、云部署指南
- `/logs`：运行日志

## 启动方式
1. 推荐一键本地开发：
   ```sh
   cd dev-scripts
   run.bat
   ```
   - 自动检测依赖、端口，前后端并发启动，自动打开页面。
2. 手动启动：
   ```sh
   npm install
   npm run dev
   cd server && npm install && node index.js
   ```

## 主要特性（v2.1.0）
- 支持对拍结果导出为 TXT、ZIP（data.in/data.out1/data.out2）、Excel、JSON
- 结果导出格式可选，适配自动化测试与数据分析
- 本地 run.bat 脚本优化，自动检测依赖、端口、智能打开页面
- dev-scripts 目录下提供云服务器/阿里云部署指南
- 生产环境支持一键 build-and-serve.bat 部署

## 生产部署
- 详见 `dev-scripts/deploy-to-server-guide.md` 和 `dev-scripts/deploy-to-aliyun-guide.md`
- 支持 Express 托管 dist 静态前端，或用 nginx 反代
- 推荐用 pm2 守护后端进程

## 计划
- [x] 前端项目初始化
- [x] 后端 Node.js + Express 初始化
- [x] 前后端联调
- [x] 支持 C++ 代码编译与沙箱运行
- [x] 结果展示与异常处理
- [x] 预设生成器可维护与动态预览
- [x] 结果筛选与自定义轮数
- [x] 关于我们页面
- [x] 对拍结果多格式导出
- [x] 本地脚本优化与云部署指南

---
如需更多帮助或定制开发，请联系作者。
