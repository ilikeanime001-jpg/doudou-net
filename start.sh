#!/bin/bash
# DoudouNet 快速开始脚本

echo "🎯 DoudouNet 快速启动"
echo "===================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 生成密钥
if [ ! -f "config/identity.json" ]; then
    echo "🔐 生成密钥..."
    npm run keys
fi

# 启动服务器
echo "🚀 启动服务器..."
npm start
