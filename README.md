# 算法对拍工具 (Duipai Toolkit)

专为算法竞赛选手设计的对拍工具，可快速验证程序正确性并可视化测试结果。

## 功能特性
- 🚀 一键式自动化测试流程
- 📊 实时可视化测试统计（通过率/失败率）
- 🐛 自动捕获并展示错误测试用例
- 📱 响应式网页控制面板

## 环境要求
- C++17 兼容编译器 (g++ 9.4+ / MSVC 19.30+)
- Python 3.8+ 运行环境
- 现代浏览器（Chrome 90+/Firefox 85+）

## 快速开始
```bash
# 运行对拍测试 (默认50次)
duipai.bat
```

<<<<<<< HEAD
## 文件结构
```
Duipai Toolkit:.
│  clear_testcases.py  # 清空上次对拍结果
│  duipai.py   # 对拍主程序
|  duipai.bat  # 快速开始
│  index.html
│  run.bat     # 快速开始-自动打开网页控制面板
│  README.md
│  
├─bin
│      brute.exe
│      gen.exe
│      prog.exe
│      
├─src
│      brute.cpp
│      gen.cpp
│      prog.cpp
│
└─testcases              # WA 的 输入与输出 内容
    ├─test_wa_1
    │      data.in
    │      data.out1
    │      data.out2
    │
    ├─test_wa_2
    │      data.in
    │      data.out1
    │      data.out2
    │
    └─test_wa_3
            data.in
            data.out1
            data.out2
```

=======
>>>>>>> 8a06c743337c624e4d910ca9e0ba4ec69658829f
## 使用指南
### 编译说明
```bash
# 编译所有C++程序
g++ src/prog.cpp -o bin/prog.exe -O2 -std=c++17
g++ src/brute.cpp -o bin/brute.exe -O2 -std=c++17
g++ src/gen.cpp -o bin/gen.exe -O2 -std=c++17
```

### 操作流程
1. 修改`prog.cpp`实现你的算法
2. 在`brute.cpp`中实现保证正确的暴力解法
3. 调整`gen.cpp`生成符合题目要求的数据
4. 运行`duipai.py`开始自动化测试
5. 启动本地服务器查看实时报告：
```bash
python -m http.server 8000
```
6. 访问 http://localhost:8000 查看可视化测试报告
7. 运行`clear_testcases.py`清空WA数据

## 错误调试
当测试失败时：
1. 错误输入数据会保存在`testcases/test_wa_x/data.in`
2. 程序输出保存为`testcases/test_wa_x/data.out1`
3. 预期输出保存为`testcases/test_wa_x/data.out2`

## 测试数据管理
- 失败用例自动保存在`testcases/test_wa_<序号>`目录
- 每个失败用例包含：
  - data.in 测试输入
  - data.out1 期望输出
  - data.out2 实际输出
  - diff.html 差异对比（支持语法高亮）

## 贡献指南
欢迎提交PR！请确保：
- 遵循现有代码风格
- 更新对应文档
- 通过基础测试