#!/usr/bin/env node
/**
 * 1.1 节点密钥生成
 * 生成节点身份密钥对
 * 
 * 使用: node scripts/generate_keys.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 生成 Pandora 节点密钥...\n');

// 生成密钥对 (ECDH + Ed25519 风格)
const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519', {
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// 生成节点ID (公钥指纹)
const nodeId = crypto.createHash('sha256')
  .update(publicKey)
  .digest('hex')
  .substring(0, 16);

// 生成签名密钥对 (用于消息签名)
const { publicKey: signPublicKey, privateKey: signPrivateKey } = crypto.generateKeyPairSync('ed25519');

const identity = {
  node_id: nodeId,
  created_at: new Date().toISOString(),
  keys: {
    encryption: {
      public_key: publicKey,
      private_key: privateKey
    },
    signing: {
      public_key: signPublicKey,
      private_key: signPrivateKey
    }
  }
};

// 保存到文件
const configDir = path.join(__dirname, '..', 'config');
fs.mkdirSync(configDir, { recursive: true });

fs.writeFileSync(
  path.join(configDir, 'identity.json'),
  JSON.stringify(identity, null, 2)
);

console.log('✅ 密钥生成完成!\n');
console.log('📋 节点信息:');
console.log('─'.repeat(40));
console.log(`🔑 节点ID: ${nodeId}`);
console.log(`📅 创建时间: ${identity.created_at}`);
console.log('─'.repeat(40));
console.log(`\n💾 已保存到: config/identity.json`);

// 导出公钥 (可以分享)
const exportInfo = {
  node_id: nodeId,
  public_key: publicKey,
  sign_public_key: signPublicKey,
  created_at: identity.created_at
};

fs.writeFileSync(
  path.join(configDir, 'node_info.json'),
  JSON.stringify(exportInfo, null, 2)
);

console.log(`📢 公钥已保存到: config/node_info.json (可分享)`);
console.log('\n🎉 可以开始连接其他节点了!\n');
