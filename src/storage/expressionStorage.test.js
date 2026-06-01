import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { loadExpressions, saveExpressions } from './expressionStorage.js';

const store = new Map();
globalThis.localStorage = {
  clear: () => store.clear(),
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
};

describe('expression storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaults when storage is empty', () => {
    assert.deepEqual(loadExpressions(), ['Guten Morgen', 'Das ist ein Apfel']);
  });

  it('saves and loads valid expressions', () => {
    saveExpressions(['Wien', 'Österreich']);

    assert.deepEqual(loadExpressions(), ['Wien', 'Österreich']);
  });

  it('falls back to defaults for invalid stored data', () => {
    localStorage.setItem('lernwoerter.expressions', '{"version":1,"expressions":[7]}');

    assert.deepEqual(loadExpressions(), ['Guten Morgen', 'Das ist ein Apfel']);
  });
});
