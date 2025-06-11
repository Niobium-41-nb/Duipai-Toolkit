import os
import shutil  # 新增导入
import glob  # 新增导入

def clear_testcases():
    if os.path.exists("testcases"):
        # 删除所有历史错误用例目录
        for dir in glob.glob("testcases/test_wa_*"):
            shutil.rmtree(dir)
        # 清理可能残留的临时文件
        for file in ["data.in", "data.out1", "data.out2",'report.json']:
            file_path = os.path.join("testcases", file)
            if os.path.exists(file_path):
                os.remove(file_path)

def clear_bin():
    if os.path.exists("bin"):
        # 清理可能残留的临时文件
        for file in ["brute.exe", "gen.exe", "prog.exe"]:
            file_path = os.path.join("bin", file)
            if os.path.exists(file_path):
                os.remove(file_path)

if __name__ == "__main__":
    clear_bin()
    clear_testcases()
