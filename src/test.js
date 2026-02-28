#!/usr/bin/env node
/**
 * Pandora 跨平台测试
 * 测试 Phase 1: 局域网连接
 */

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const nodeCmd = isWindows ? 'node.exe' : 'node';

console.log('╔════════════════════════════════════════╗');
console.log('║     🎭 Pandora 跨平台测试            ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log(`🖥️  系统: ${process.platform}`);
console.log(`📂  目录: ${process.cwd()}`);
console.log(`🐢  Node: ${process.version}`);
console.log('');

// 检查 ws 模块
try {
  require.resolve('ws');
  console.log('✅ ws 模块已安装');
} catch (e) {
  console.log('📦 安装 ws 模块...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install ws', { stdio: 'inherit' });
    console.log('✅ ws 模块安装完成');
  } catch (err) {
    console.error('❌ ws 模块安装失败:', err.message);
    process.exit(1);
  }
}

console.log('');
console.log('════════════════════════════════════════');
console.log('');
console.log('📋 测试步骤:');
console.log('');
console.log('1. 启动服务器 (终端1):');
console.log('   npm start');
console.log('');
console.log('2. 连接客户端 (终端2):');
console.log('   npm run start:client -- ws://localhost:8765');
console.log('');
console.log('3. 或连接其他设备:');
console.log('   npm run start:client -- ws://192.168.x.x:8765');
console.log('');
console.log('════════════════════════════════════════');
console.log('');

// 自动测试
async function test() {
  console.log('🧪 开始自动测试...');
  console.log('');
  
  // 测试密钥生成
  console.log('1️⃣  测试密钥生成...');
  const keysProcess = spawn(nodeCmd, [path.join(__dirname, 'generate_keys.js')], {
    shell: true,
    stdio: 'inherit'
  });
  
  await new Promise(resolve => keysProcess.on('close', resolve));
  
  console.log('');
  console.log('✅ 测试完成!');
  console.log('');
  console.log('下一步:');
  console.log('  终端1: npm start');
  console.log('  终端2: npm run start:client -- ws://localhost:8765');
  console.log('');
}

// 运行测试
test().catch(console.error);
