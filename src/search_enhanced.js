#!/usr/bin/conf/node
/**
 * 增强版搜索客户端
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_DIR = '/Users/doudou/.openclaw/workspace/projects/pandora/config';
const RECEIVED_FILE = path.join(DATA_DIR, 'knowledge_received.json');

let received = [];
try {
  received = JSON.parse(fs.readFileSync(RECEIVED_FILE, 'utf-8'));
} catch(e) {}

const rl = readline.createInterface({ process.stdin, process.stdout });

function menu() {
  console.log('\n🎭 DoudouNet 增强搜索');
  console.log('==================');
  console.log(`📚 已接收: ${received.length} 条`);
  console.log('1. 搜索');
  console.log('2. 按主题');
  console.log('3. 按日期');
  console.log('4. 按来源');
  console.log('5. 连接服务器');
  console.log('0. 退出');
  rl.question('选择: ', (c) => {
    if (c === '1') search();
    else if (c === '2') byTopic();
    else if (c === '3') byDate();
    else if (c === '4') bySource();
    else if (c === '5') connect();
    else process.exit(0);
  });
}

function search() {
  rl.question('关键词: ', (q) => {
    const r = received.filter(k => 
      k.title?.includes(q) || k.summary?.includes(q)
    );
    console.log(`\n找到 ${r.length} 条`);
    r.slice(0, 10).forEach(k => console.log(`- ${k.title}`));
    menu();
  });
}

function byTopic() {
  const topics = [...new Set(received.map(k => k.topic))];
  topics.forEach((t, i) => console.log(`${i+1}. ${t}`));
  rl.question('选择: ', (c) => {
    const r = received.filter(k => k.topic === topics[c-1]);
    console.log(`${r.length} 条`);
    menu();
  });
}

function byDate() {
  const dates = [...new Set(received.map(k => 
    new Date(k.received_at).toLocaleDateString()
  ))];
  dates.forEach(d => console.log(d));
  menu();
}

function bySource() {
  const sources = [...new Set(received.map(k => k.source_name).filter(Boolean))];
  sources.forEach(s => console.log(s));
  menu();
}

function connect() {
  rl.question('服务器: ', (addr) => {
    console.log(`连接 ${addr}...`);
    menu();
  });
}

console.log('🎭 DoudouNet 增强搜索');
menu();
