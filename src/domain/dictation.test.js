import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createDictationState, evaluateAnswer, getCurrentExpression, moveToNextExpression } from './dictation.js';

describe('dictation domain', () => {
  it('evaluates typed answers with trimmed exact matching', () => {
    assert.equal(evaluateAnswer('  Grüß Gott  ', 'Grüß Gott'), true);
    assert.equal(evaluateAnswer('Gruss Gott', 'Grüß Gott'), false);
  });

  it('moves through expressions without changing the expression list', () => {
    const state = createDictationState(['Apfel', 'Birne']);

    assert.equal(getCurrentExpression(state), 'Apfel');
    assert.equal(getCurrentExpression(moveToNextExpression(state)), 'Birne');
    assert.equal(getCurrentExpression(moveToNextExpression(moveToNextExpression(state))), 'Apfel');
  });
});
