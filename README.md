# Duipai Toolkit

本项目是一个为算法竞赛选手设计的对拍工具网站，包含 React 前端和 Node.js + Express 后端。

## 功能简介
- 支持上传暴力解（brute.cpp）、测试解（prog.cpp）、数据生成器（gen.cpp）
- 提供部分预设数据生成器
- 自动编译、运行并对拍多组数据，展示结果

## 目录结构
- `/src`：前端 React 代码
- `/server`：后端 Node.js + Express 代码
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

## 计划
- [x] 前端项目初始化
- [x] 后端 Node.js + Express 初始化
- [ ] 前后端联调
- [ ] 支持 C++ 代码编译与沙箱运行
- [ ] 结果展示与异常处理
