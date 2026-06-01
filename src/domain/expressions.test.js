import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createExportText, parseExpressionsText } from './expressions.js';

describe('expression TXT format', () => {
  it('parses one expression per line', () => {
    assert.deepEqual(parseExpressionsText('Haus\n  Baum  \n\nGuten Morgen'), {
      ok: true,
      value: ['Haus', 'Baum', 'Guten Morgen'],
    });
  });

  it('rejects empty TXT lists', () => {
    assert.deepEqual(parseExpressionsText('  \n\t\n'), {
      ok: false,
      message: 'Die TXT-Liste braucht mindestens ein Wort.',
    });
  });

  it('exports expressions as one expression per line', () => {
    assert.equal(createExportText(['Haus', '  Baum  ', '']), 'Haus\nBaum');
  });
});
