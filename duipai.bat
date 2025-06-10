@echo off
setlocal enabledelayedexpansion

:: 创建测试目录
if not exist "testcases" mkdir testcases

:: 编译程序
g++ -std=c++17 -O2 -o bin/prog.exe src/prog.cpp
g++ -std=c++17 -O2 -o bin/brute.exe src/brute.cpp
g++ -std=c++17 -O2 -o bin/gen.exe src/gen.cpp

:: 设置测试次数
set test_count=50
set success_count=0
set wa_count=0

echo start...
echo.

for /l %%i in (1, 1, %test_count%) do (
    echo running [%%i/%test_count%]
    
    :: 生成测试数据
    bin\gen.exe > testcases\data.in
    
    :: 运行程序A
    bin\prog.exe < testcases\data.in > testcases\data.out1
    
    :: 运行程序B
    bin\brute.exe < testcases\data.in > testcases\data.out2
    
    :: 比较输出结果
    fc testcases\data.out1 testcases\data.out2 > nul
    if !errorlevel! equ 0 (
        echo AC
        set /a success_count+=1
    ) else (
        echo WA
        set /a wa_count+=1
        
        :: 创建错误用例目录
        set wa_dir=testcases\test_wa_!wa_count!
        if not exist "!wa_dir!" mkdir "!wa_dir!"
        
        :: 保存错误用例
        copy testcases\data.in "!wa_dir!" > nul
        copy testcases\data.out1 "!wa_dir!" > nul
        copy testcases\data.out2 "!wa_dir!" > nul
        
        echo ===== found wrong test =====
        echo wa_test_save_in: !wa_dir!
    )
    
    :: 清理临时文件
    del testcases\data.in
    del testcases\data.out1
    del testcases\data.out2
)

echo.
echo ===== End =====
echo all_test_times: %test_count%
echo AC_test_times: %success_count%
echo WA_test_times: %wa_count% (save in testcases\test_wa_*)
pause