# 算法对拍工具 (Duipai Toolkit)

专为算法竞赛选手设计的对拍工具，可快速验证程序正确性并可视化测试结果。

## 功能特性

- 🚀 一键式自动化测试流程
- 📊 实时可视化测试统计（通过率/失败率）
- 🧪 智能数据生成器支持
- 🐛 自动捕获并展示错误测试用例

## 快速开始

```bash
# 运行对拍测试 (默认50次)
duipai.bat
```

## 使用指南

1. 修改 `prog.cpp`实现你的算法
2. 在 `brute.cpp`中实现保证正确的暴力解法
3. 调整 `gen.cpp`生成符合题目要求的数据
4. 运行 `duipai.py`开始自动化测试
5. 运行 `clear_testcases.py`清空上次对拍的WA数据

## 错误调试

当测试失败时：

1. 错误输入数据会保存在 `testcases/test_wa_x/data.in`
2. 程序输出保存为 `testcases/test_wa_x/data.out1`
3. 预期输出保存为 `testcases/test_wa_x/data.out2`

## 贡献指南

欢迎提交PR！请确保：

- 遵循现有代码风格
- 更新对应文档
- 通过基础测试
