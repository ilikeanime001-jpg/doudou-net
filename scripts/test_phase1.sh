#!/bin/bash
# Pandora 快速测试脚本
# 测试 Phase 1 基础连接

echo "🎭 Pandora Phase 1 测试"
echo "========================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

echo "✅ Node.js 已安装: $(node --version)"

# 检查 ws 模块
if [ ! -d "node_modules/ws" ]; then
    echo "📦 安装 ws 模块..."
    npm install ws
fi

echo ""
echo "📋 测试步骤:"
echo "------------"

# 1. 生成密钥
echo ""
echo "1️⃣ 生成节点密钥..."
node scripts/generate_keys.js

# 2. 启动服务器 (后台)
echo ""
echo "2️⃣ 启动服务器 (端口 8765)..."
node scripts/server.js --port 8765 &
SERVER_PID=$!
sleep 2

# 3. 连接客户端
echo ""
echo "3️⃣ 连接客户端..."
timeout 5 node scripts/client.js ws://localhost:8765 || true

# 4. 清理
echo ""
echo "🧹 清理..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "========================"
echo "🎉 测试完成!"
echo ""
echo "下一步:"
echo "  启动服务器: node scripts/server.js"
echo "  连接节点:   node scripts/client.js ws://<地址>"
