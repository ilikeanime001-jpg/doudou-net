@echo off
chcp 65001 >nul
title Pandora - 快速连接

echo 🎭 Pandora Windows 快速连接
echo =============================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装!
    echo 请先安装: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version

REM 检查并安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖中...
    call npm install
)

echo.
echo ════════════════════════════════════
echo  快速连接选项:
echo ════════════════════════════════════
echo.
echo  [1] 连接本机测试 (localhost)
echo  [2] 连接局域网其他电脑
echo  [3] 查看本机IP地址
echo  [4] 安装/更新依赖
echo  [0] 退出
echo.
echo ════════════════════════════════════
echo.

set /p CHOICE="请选择 (0-4): "

if "%CHOICE%"=="1" goto local
if "%CHOICE%"=="2" goto remote
if "%CHOICE%"=="3" goto ip
if "%CHOICE%"=="4" goto install
if "%CHOICE%"=="0" exit

echo 无效选择
pause
exit

:local
echo.
echo 🔗 连接 localhost:8765 ...
node src/client.js ws://localhost:8765
pause
exit

:remote
echo.
set /p IP="请输入服务器IP (如 192.168.1.100): "
if "%IP%"=="" (
    echo ❌ 请输入IP
    pause
    exit /b 1
)
echo.
echo 🔗 连接 %IP%:8765 ...
node src/client.js ws://%IP%:8765
pause
exit

:ip
echo.
echo 📍 本机IP地址:
echo.
ipconfig | findstr /i "IPv4"
echo.
pause
exit

:install
echo.
echo 📦 安装/更新依赖...
call npm install
echo ✅ 完成!
echo.
pause
exit
