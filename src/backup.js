#!/usr/bin/env node
/**
 * 数据备份
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = 'backups';
const DATE = new Date().toISOString().split('T')[0];

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// 备份配置
['identity.json', 'node_info.json'].forEach(f => {
  const src = path.join('config', f);
  if (fs.existsSync(src)) {
    const dest = path.join(BACKUP_DIR, `${DATE}_${f}`);
    fs.copyFileSync(src, dest);
    console.log(`✅ 备份: ${f}`);
  }
});

console.log(`\n✅ 备份完成: ${BACKUP_DIR}/`);
