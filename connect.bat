@echo off
chcp 65001 >nul
title Pandora - 连接测试

echo ╔════════════════════════════════════════╗
echo ║     Pandora Windows 连接脚本          ║
echo ╚════════════════════════════════════════╝
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装!
    echo.
    echo 请先安装 Node.js:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 已安装: 
node --version
echo.

REM 检查依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    call npm install
    echo.
)

REM 显示本机IP
echo 📍 你的IP地址:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do echo   %%a
echo.

echo ========================================
echo.
echo 使用方法:
echo.
echo 1. 先在另一台电脑启动服务器:
echo    npm start
echo.
echo 2. 然后运行本脚本，输入服务器IP
echo.
echo ========================================
echo.

set /p SERVER_IP="请输入服务器IP (如 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo ❌ 请输入IP地址
    pause
    exit /b 1
)

echo.
echo 🔗 连接到 %SERVER_IP%:8765 ...
echo.

node src/client.js ws://%SERVER_IP%:8765

pause
