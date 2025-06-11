import os
import subprocess
import sys
import shutil
import glob
import json
import difflib  # 新增导入

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
                    # 在保存错误用例的代码块中，添加文件刷新逻辑
                    shutil.copyfile("testcases/data.in", f"{save_dir}/data.in")
                    shutil.copyfile("testcases/data.out1", f"{save_dir}/data.out1") 
                    shutil.copyfile("testcases/data.out2", f"{save_dir}/data.out2")
                    
                    # 添加文件同步刷新
                    for f in ['data.in', 'data.out1', 'data.out2']:
                        with open(f"{save_dir}/{f}", 'a') as file:
                            file.flush()
                            os.fsync(file.fileno())
                    
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
                    
                    # 生成差异对比HTML
                    differ = difflib.HtmlDiff()
                    diff_content = differ.make_file(out1, out2, "程序输出", "暴力解输出")

                    # 新增：读取输入内容并插入到diff.html顶部
                    with open(f"{save_dir}/data.in", "r", encoding="utf-8") as fin:
                        input_data = fin.read()

                    # 构造带输入内容的HTML
                    input_html = (
                        '<div style="background:#f8f9fa;padding:12px 18px;margin-bottom:18px;border-radius:6px;">'
                        '<h3 style="margin-top:0;">输入文件 data.in</h3>'
                        f'<pre style="background:#f4f4f4;padding:10px;border-radius:4px;overflow:auto;">{input_data}</pre>'
                        '</div>'
                    )

                    # 将输入内容插入到<body>后
                    diff_content = diff_content.replace(
                        "<body>",
                        "<body>" + input_html,
                        1
                    )

                    # 在</body>前插入作者信息
                    author_html = '<div style="text-align:left;color:#888;font-size:14px;margin-top:32px;">作者：vanadium-23 (codeforces)</div>'
                    diff_content = diff_content.replace(
                        "</body>",
                        author_html + "\n</body>",
                        1
                    )

                    author_html = '<div style="text-align:left;color:#888;font-size:14px;margin-top:32px;">作者：Niobium-41-nb (GitHub)</div>'
                    diff_content = diff_content.replace(
                        "</body>",
                        author_html + "\n</body>",
                        1
                    )

                    # author_html = (
                    #     '<div style="text-align:left;margin-top:8px;"><img src="https://c-ssl.duitang.com/uploads/blog/202306/12/bYS2NqJlTLvXBbn.gif" alt="author" style="height:40px;border-radius:8px;box-shadow:0 2px 8px #ccc;"></div>'
                    # )
                    # diff_content = diff_content.replace(
                    #     "</body>",
                    #     author_html + "\n</body>",
                    #     1
                    # )

                    with open(f"{save_dir}/diff.html", "w", encoding="utf-8") as f:
                        f.write(diff_content)
                else:
                    print("AC")
                    success_count += 1
        except FileNotFoundError:
            print("错误：输出文件未生成")
            sys.exit(1)

        # 清理临时文件（保持不变）
        # os.remove("testcases/data.in")
        # os.remove("testcases/data.out1")
        # os.remove("testcases/data.out2")

    # 循环外统一清理，防止文件占用
    for tmp_file in ["testcases/data.in", "testcases/data.out1", "testcases/data.out2"]:
        if os.path.exists(tmp_file):
            try:
                os.remove(tmp_file)
            except PermissionError:
                print(f"Warning: Could not remove {tmp_file}, file is in use.")

    # 最终报告生成（正确位置）
    report = {
        "summary": {
            "total": test_count,
            "passed": test_count - wa_count,
            "failed": wa_count
        },
        "testcases": [
            {
                "id": f"test_wa_{index}",
                "status": "failed"
            } for index in range(1, wa_count + 1)
        ]
    }

    with open("testcases/report.json", "w") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("\n===== 测试结束 =====")
    print(f"总测试次数: {test_count}")
    print(f"通过次数: {test_count - wa_count}")
    print(f"发现错误用例: {wa_count} 个（已保存到 testcases/test_wa_* 目录）")

if __name__ == "__main__":
    # 创建必要目录
    if not os.path.exists("testcases"):
        os.makedirs("testcases", exist_ok=True)
    if not os.path.exists("bin"):
        os.makedirs("bin", exist_ok=True)

    run_test()
