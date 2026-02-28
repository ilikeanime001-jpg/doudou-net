#!/bin/bash
# Pandora Mac一键部署

echo "🎭 Pandora Mac 部署脚本"
echo "========================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成密钥
echo "🔐 生成密钥..."
npm run keys || true

# 扫描知识
echo "📚 扫描知识库..."
npm run knowledge

# 启动服务
echo ""
echo "========================"
echo "🎉 启动完成!"
echo ""
echo "命令:"
echo "  npm start          - P2P服务器"
echo "  npm run broadcast - 知识广播"
echo "  npm run web       - Web界面"
echo ""
echo "========================"
