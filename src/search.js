#!/usr/bin/env node
/**
 * Windows 端知识搜索客户端 - 带持久化存储
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 数据保存路径
const DATA_DIR = path.join(process.env.APPDATA || process.env.HOME, 'Pandora');
const RECEIVED_FILE = path.join(DATA_DIR, 'knowledge_received.json');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 加载已接收的知识
let receivedKnowledge = [];
try {
  if (fs.existsSync(RECEIVED_FILE)) {
    receivedKnowledge = JSON.parse(fs.readFileSync(RECEIVED_FILE, 'utf-8'));
    console.log(`📂 已加载 ${receivedKnowledge.length} 条知识`);
  }
} catch(e) {
  console.log('新数据文件');
}

// 保存知识到文件
function saveKnowledge() {
  try {
    fs.writeFileSync(RECEIVED_FILE, JSON.stringify(receivedKnowledge, null, 2));
  } catch(e) {
    console.error('保存失败:', e.message);
  }
}

// 创建命令行界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let ws = null;

function showMenu() {
  console.log('\n');
  console.log('════════════════════════════════════════');
  console.log('🎭 Pandora 知识搜索 (已保存到本地)');
  console.log('════════════════════════════════════════');
  console.log(`📚 已接收知识: ${receivedKnowledge.length} 条`);
  console.log('───────────────────────────────────────');
  console.log('1. 搜索知识');
  console.log('2. 查看已接收知识');
  console.log('3. 按主题浏览');
  console.log('4. 连接服务器');
  console.log('5. 手动保存');
  console.log('0. 退出');
  console.log('════════════════════════════════════════\n');
  rl.question('选择: ', handleMenu);
}

function handleMenu(choice) {
  switch(choice) {
    case '1': searchKnowledge(); break;
    case '2': showReceived(); break;
    case '3': showByTopic(); break;
    case '4': connectServer(); break;
    case '5': 
      saveKnowledge();
      console.log('✅ 已保存到文件');
      showMenu();
      break;
    case '0': 
      saveKnowledge();
      console.log('再见! 已保存知识');
      process.exit(0);
    default: showMenu();
  }
}

function searchKnowledge() {
  rl.question('\n搜索关键词: ', (query) => {
    if (!query.trim()) { showMenu(); return; }
    
    console.log(`\n🔍 搜索: "${query}"`);
    console.log('─────────────────────────');
    
    const results = receivedKnowledge.filter(k => 
      k.title?.toLowerCase().includes(query.toLowerCase()) ||
      k.summary?.toLowerCase().includes(query.toLowerCase()) ||
      k.topic?.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
      console.log('没有找到');
    } else {
      console.log(`找到 ${results.length} 条:\n`);
      results.slice(0, 10).forEach((k, i) => {
        console.log(`${i+1}. ${k.title}`);
        console.log(`   主题: ${k.topic} | 来源: ${k.source_name || '未知'}`);
      });
    }
    showMenu();
  });
}

function showReceived() {
  console.log('\n📚 已接收知识:', receivedKnowledge.length);
  console.log('─────────────────────────');
  
  const topics = {};
  receivedKnowledge.forEach(k => {
    const t = k.topic || '未知';
    topics[t] = (topics[t] || 0) + 1;
  });
  
  console.log('\n按主题:');
  for (const [topic, count] of Object.entries(topics)) {
    console.log(`  ${topic}: ${count}`);
  }
  showMenu();
}

function showByTopic() {
  console.log('\n📂 按主题浏览');
  const topics = [...new Set(receivedKnowledge.map(k => k.topic).filter(Boolean))];
  
  topics.forEach((t, i) => {
    const count = receivedKnowledge.filter(k => k.topic === t).length;
    console.log(`${i+1}. ${t} (${count})`);
  });
  
  rl.question('\n选择主题: ', (choice) => {
    const idx = parseInt(choice) - 1;
    if (idx >= 0 && idx < topics.length) {
      const items = receivedKnowledge.filter(k => k.topic === topics[idx]);
      items.slice(0, 10).forEach((k, i) => console.log(`${i+1}. ${k.title}`));
    }
    showMenu();
  });
}

function connectServer() {
  rl.question('\n服务器地址: ', (addr) => {
    if (!addr.trim()) { showMenu(); return; }
    
    const url = addr.startsWith('ws://') ? addr : `ws://${addr}`;
    console.log(`\n🔗 连接: ${url}`);
    
    ws = new WebSocket(url);
    
    ws.on('open', () => {
      console.log('✅ 连接成功!');
      ws.send(JSON.stringify({
        type: 'handshake',
        payload: { node_id: 'windows-client', name: 'Windows Node', version: '1.0.0' }
      }));
    });
    
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        
        if (msg.type === 'knowledge_share') {
          const k = msg.payload;
          
          // 检查是否已存在
          const exists = receivedKnowledge.some(r => r.id === k.id);
          if (!exists) {
            receivedKnowledge.push({
              id: k.id,
              title: k.title,
              summary: k.summary,
              topic: k.topic,
              tags: k.tags,
              source_name: k.source?.node_name,
              confidence: k.metadata?.confidence,
              received_at: Date.now()
            });
            console.log(`\n📥 收到: ${k.title}`);
            
            // 自动保存
            saveKnowledge();
          }
        }
      } catch(e) {}
    });
    
    ws.on('close', () => console.log('\n❌ 连接断开'));
    ws.on('error', (e) => console.log(`\n❌ 错误: ${e.message}`));
    
    setTimeout(showMenu, 1000);
  });
}

// 启动
console.log('════════════════════════════════════════');
console.log('🎭 Pandora 知识搜索客户端');
console.log('════════════════════════════════════════');
console.log(`数据保存位置: ${RECEIVED_FILE}`);
console.log('');

showMenu();
