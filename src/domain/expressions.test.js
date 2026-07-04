import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createExportText, parseExpressionsText } from './expressions.js';

describe('expression text format', () => {
  it('parses one expression per line', () => {
    assert.deepEqual(parseExpressionsText('Haus\n  Baum  \n\nGuten Morgen'), {
      ok: true,
      value: ['Haus', 'Baum', 'Guten Morgen'],
    });
  });

  it('rejects text files without expressions', () => {
    assert.deepEqual(parseExpressionsText('\n  \n'), {
      ok: false,
      error: 'invalidExpressions',
    });
  });

  it('exports expressions as one expression per line', () => {
    assert.equal(createExportText(['Haus', '  Baum  ', '']), 'Haus\nBaum\n');
  });
});
