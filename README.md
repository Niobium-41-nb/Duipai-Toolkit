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

## 目录结构
- `/src`：前端 React 代码
  - `App.jsx` 主页面与路由
  - `About.jsx` 关于我们页面
- `/server`：后端 Node.js + Express 代码
- `/presets`：可维护的 C++ 预设生成器代码
- `.github/copilot-instructions.md`：Copilot 指令

## 启动方式
1. 前端：
   ```sh
   npm install
   npm run dev
   ```
2. 后端：
   ```sh
   cd server
   npm install
   node index.js
   ```

## 主要特性（v2.0.2）
- 支持自定义对拍轮数
- 支持只显示不一致结果筛选
- 预设生成器代码可维护、可动态预览
- “关于我们”页面支持作者介绍、广告与头像展示

## 计划
- [x] 前端项目初始化
- [x] 后端 Node.js + Express 初始化
- [x] 前后端联调
- [x] 支持 C++ 代码编译与沙箱运行
- [x] 结果展示与异常处理
- [x] 预设生成器可维护与动态预览
- [x] 结果筛选与自定义轮数
- [x] 关于我们页面
