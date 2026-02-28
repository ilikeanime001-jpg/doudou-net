#!/usr/bin/env node
/**
 * 搜索索引 - 快速搜索
 */

class SearchIndex {
  constructor() {
    this.index = new Map();
  }
  
  add(id, text) {
    const words = text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word).add(id);
    });
  }
  
  search(query, max = 10) {
    const words = query.toLowerCase().split(/\s+/);
    const results = new Map();
    
    words.forEach(word => {
      this.index.forEach((ids, indexWord) => {
        if (indexWord.includes(word)) {
          ids.forEach(id => {
            results.set(id, (results.get(id) || 0) + 1);
          });
        }
      });
    });
    
    return [...results.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([id]) => id);
  }
}

module.exports = SearchIndex;
