@echo off
echo 1. 检查依赖是否安装
if exist node_modules\@monaco-editor\react (
  echo @monaco-editor/react 已安装
) else (
  echo 缺少 @monaco-editor/react
)
if exist node_modules\monaco-editor (
  echo monaco-editor 已安装
) else (
  echo 缺少 monaco-editor
)

echo.
echo 2. 检查 package.json 是否包含依赖
findstr /i "@monaco-editor/react" package.json
findstr /i "monaco-editor" package.json

echo.
echo 3. 检查开发服务器是否有报错
echo 请运行：npm run dev
echo 并观察终端输出是否有红色报错

echo.
echo 4. 检查浏览器 Console 是否有报错
echo 请在浏览器按 F12，切换到 Console，查看是否有红色报错或资源加载失败

echo.
echo 5. 清理依赖并重装（如有问题可执行以下命令）
echo rd /s /q node_modules
echo del package-lock.json
echo npm install
echo npm run dev

echo.
echo 6. 检查 MonacoEditor 组件 value/onChange 是否为 undefined
echo 建议传递 value={editor.xxx ^|^| ''}，避免 undefined

pause