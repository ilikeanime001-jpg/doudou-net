#!/bin/bash
# Pandora 一键启动

echo "🎭 Pandora 启动中..."

# 1. 扫描知识
echo "📚 扫描知识库..."
node src/knowledge/index.js

# 2. 启动广播服务器
echo "🚀 启动广播服务器..."
node src/broadcast_server.js &
PID=$!

echo "✅ 启动完成!"
echo "   端口: 8765"
echo "   知识: 296个"
echo ""
echo "Windows 连接: 192.168.1.156:8765"
echo ""
echo "停止: kill $PID"

wait
