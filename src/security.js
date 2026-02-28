#!/usr/bin/env node
/**
 * Pandora 安全模块
 */

const crypto = require('crypto');

// 生成密钥对
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return { publicKey, privateKey };
}

// 签名
function sign(data, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(data));
  return sign.sign(privateKey, 'base64');
}

// 验证
function verify(data, signature, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(JSON.stringify(data));
  return verify.verify(publicKey, signature, 'base64');
}

// 加密消息
function encrypt(data, publicKey) {
  return crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(JSON.stringify(data))).toString('base64');
}

// 解密
function decrypt(encryptedData, privateKey) {
  return JSON.parse(crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(encryptedData, 'base64')).toString());
}

module.exports = { generateKeyPair, sign, verify, encrypt, decrypt };

// 测试
if (require.main === module) {
  console.log('🔐 安全模块测试...\n');
  
  const { publicKey, privateKey } = generateKeyPair();
  console.log('✅ 密钥对生成');
  
  const data = { test: 'hello', time: Date.now() };
  const signature = sign(data, privateKey);
  console.log('✅ 签名');
  
  const valid = verify(data, signature, publicKey);
  console.log(`✅ 验证: ${valid}`);
  
  const encrypted = encrypt(data, publicKey);
  console.log('✅ 加密');
  
  const decrypted = decrypt(encrypted, privateKey);
  console.log(`✅ 解密: ${JSON.stringify(decrypted)}`);
}
