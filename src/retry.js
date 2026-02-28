#!/usr/bin/env node
/**
 * 自动重试装饰器
 */

async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch(e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

module.exports = { retry };
