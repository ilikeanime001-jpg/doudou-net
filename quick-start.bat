@echo off
chcp 65001 >nul
title Pandora - 快速启动

echo ╔════════════════════════════════════════╗
echo ║     Pandora 快速启动              ║
echo ╚════════════════════════════════════════╝
echo.

echo [1] 启动知识广播服务器
echo [2] 连接并接收知识
echo [3] 搜索知识
echo [4] 查看状态
echo [0] 退出
echo.

set /p CHOICE="选择: "

if "%CHOICE%"=="1" goto broadcast
if "%CHOICE%"=="2" goto receive
if "%CHOICE%"=="3" goto search
if "%CHOICE%"=="4" goto status

:broadcast
echo 启动广播服务器...
node src/broadcast_server.js
pause
exit

:receive
set /p IP="输入服务器IP: "
node src/quick_client.js ws://%IP%:8765
pause
exit

:search
node src/search.js
pause
exit

:status
node src/monitor.js
pause
exit
