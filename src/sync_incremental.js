#!/usr/bin/env node
/**
 * 增量知识同步
 */

const fs = require('fs');

const LOCAL_FILE = 'config/knowledge_packets.json';
const RECEIVED_FILE = 'config/knowledge_received.json';

function getLocal() {
  return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
}

function getReceived() {
  try {
    return JSON.parse(fs.readFileSync(RECEIVED_FILE, 'utf-8'));
  } catch(e) { return []; }
}

function sync() {
  console.log('🔄 增量同步...\n');
  
  const local = getLocal();
  const received = getReceived();
  
  const localIds = new Set(local.map(k => k.id));
  const receivedIds = new Set(received.map(k => k.id));
  
  const newToSend = local.filter(k => !receivedIds.has(k.id));
  console.log(`本地新增: ${newToSend.length}`);
  
  const newToReceive = received.filter(k => !localIds.has(k.id));
  console.log(`远程新增: ${newToReceive.length}`);
  
  const all = [...local, ...newToReceive];
  fs.writeFileSync('config/knowledge_merged.json', JSON.stringify(all, null, 2));
  
  console.log(`\n✅ 合并完成: ${all.length} 条`);
  return { newToSend, newToReceive };
}

sync();
