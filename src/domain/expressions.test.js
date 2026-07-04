import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createExportJson, parseExpressionsJson } from './expressions.js';

describe('expression JSON format', () => {
  it('parses a versioned expression document', () => {
    assert.deepEqual(parseExpressionsJson('{"version":1,"expressions":["Haus", "  Baum  ", ""]}'), {
      ok: true,
      value: ['Haus', 'Baum'],
    });
  });

  it('rejects invalid JSON documents', () => {
    assert.deepEqual(parseExpressionsJson('{"version":1,"expressions":[1]}'), {
      ok: false,
      error: 'invalidExpressions',
    });
  });

  it('exports expressions as a versioned JSON document', () => {
    assert.equal(createExportJson(['Haus']), JSON.stringify({ version: 1, expressions: ['Haus'] }, null, 2));
  });
});
