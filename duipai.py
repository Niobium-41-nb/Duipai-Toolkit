import os
import subprocess
import sys
import shutil
import glob
import json  

def compile_cpp(source, output):
    """编译C++源代码"""
    cmd = f"g++ -std=c++17 -O2 -o {output} {source}"
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"编译失败: {source}")
        sys.exit(1)

def run_test(test_count=50):
    """运行对拍测试"""
    # 编译所有程序
    compile_cpp("src/prog.cpp", "bin/prog.exe")
    compile_cpp("src/brute.cpp", "bin/brute.exe")
    compile_cpp("src/gen.cpp", "bin/gen.exe")
    
    # 新增清理逻辑
    if os.path.exists("testcases"):
        # 删除所有历史错误用例目录
        for dir in glob.glob("testcases/test_wa_*"):
            shutil.rmtree(dir)
        # 清理可能残留的临时文件
        for file in ["data.in", "data.out1", "data.out2"]:
            file_path = os.path.join("testcases", file)
            if os.path.exists(file_path):
                os.remove(file_path)
    else:
        os.makedirs("testcases", exist_ok=True)
    
    success_count = 0
    wa_count = 0  # 新增错误用例计数器
    
    print("开始对拍测试...\n")
    # 在测试循环结束后添加报告生成
    failed_cases = []
    for i in range(1, test_count + 1):
        print(f"运行中 [{i}/{test_count}]")
        
        # 生成测试数据
        with open("testcases/data.in", "w") as f:
            subprocess.run("bin/gen.exe", stdout=f)
        
        # 运行目标程序
        with open("testcases/data.in", "r") as fin, open("testcases/data.out1", "w") as fout:
            subprocess.run("bin/prog.exe", stdin=fin, stdout=fout)
        
        # 运行暴力程序
        with open("testcases/data.in", "r") as fin, open("testcases/data.out2", "w") as fout:
            subprocess.run("bin/brute.exe", stdin=fin, stdout=fout)
        
        # 比较输出
        try:  # 修复第58行错误：确保try块包含完整的比较逻辑
            with open("testcases/data.out1", "r") as f1, open("testcases/data.out2", "r") as f2:
                out1 = f1.read().splitlines()
                out2 = f2.read().splitlines()
                
                if out1 != out2:
                    wa_count += 1  # 错误用例计数
                    print(f"WA (已保存到 test_wa_{wa_count})")
                    
                    # 创建保存目录
                    save_dir = f"testcases/test_wa_{wa_count}"
                    os.makedirs(save_dir, exist_ok=True)
                    
                    # 复制测试文件（新增文件保存逻辑）
                    shutil.copyfile("testcases/data.in", f"{save_dir}/data.in")
                    shutil.copyfile("testcases/data.out1", f"{save_dir}/data.out1")
                    shutil.copyfile("testcases/data.out2", f"{save_dir}/data.out2")
                    
                    # 保留原有错误信息输出
                    print("===== 发现错误测试用例 =====")
                    print(f"首处差异在第 {next(i+1 for i, (a, b) in enumerate(zip(out1, out2)) if a != b)} 行")
                    print("输入数据:")
                    with open("testcases/data.in", "r") as f:
                        print(f.read())
                    print("------ 程序输出 ------")
                    with open("testcases/data.out1", "r") as f:
                        print(f.read())
                    print("------ 暴力解输出 ------")
                    with open("testcases/data.out2", "r") as f:
                        print(f.read())
                    # input("按Enter键退出...")
                    # break
                else:
                    print("AC")
                    success_count += 1
        except FileNotFoundError:  # 修复第93行错误：添加冒号并正确缩进
            print("错误：输出文件未生成")
            sys.exit(1)
        
        # 清理临时文件（保持不变）
        os.remove("testcases/data.in")
        os.remove("testcases/data.out1")
        os.remove("testcases/data.out2")
    
        # 最终报告生成（确保在函数作用域内）
        report = {
            "summary": {
                "total": test_count,
                "passed": test_count - wa_count,
                "failed": wa_count
            },
            "testcases": [
                {
                    "id": f"test_wa_{i}",
                    "status": "failed"
                } for i in range(1, wa_count + 1)
            ]
        }
        
        with open("testcases/report.json", "w") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)  # 正确缩进层级
        
        # 最终输出添加错误用例统计
    print("\n===== 测试结束 =====")
    print(f"总测试次数: {test_count}")
    print(f"通过次数: {test_count - wa_count}")
    print(f"发现错误用例: {wa_count} 个（已保存到 testcases/test_wa_* 目录）")

if __name__ == "__main__":  # 此语句应该在函数外，无缩进
    run_test()
