#!/usr/bin/env node
/**
 * 分页工具
 */

function paginate(array, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: array.slice(start, end),
    pagination: {
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit),
      hasNext: end < array.length,
      hasPrev: page > 1
    }
  };
}

module.exports = { paginate };
