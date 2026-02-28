@echo off
chcp 65001 >nul
title Pandora - 知识搜索

echo ╔════════════════════════════════════════╗
echo ║     Pandora 知识搜索客户端       ║
echo ╚════════════════════════════════════════╝
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装!
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version

REM 检查并安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    call npm install
)

echo.
echo 运行搜索客户端...
node src/search.js

pause
