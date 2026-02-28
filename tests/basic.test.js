const assert = require('assert');

describe('Pandora', () => {
  it('should have knowledge packets', () => {
    const fs = require('fs');
    const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
    assert(packets.length > 0);
  });
  
  it('should have valid structure', () => {
    const fs = require('fs');
    const packets = JSON.parse(fs.readFileSync('config/knowledge_packets.json', 'utf-8'));
    packets.forEach(p => {
      assert(p.id);
      assert(p.title);
    });
  });
});
