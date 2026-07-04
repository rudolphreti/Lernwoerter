import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createDictationState, evaluateAnswer, getCurrentExpression, getNextExpressionIndex, moveCurrentExpressionToBack, moveToNextExpression } from './dictation.js';

describe('dictation domain', () => {
  it('evaluates typed answers with trimmed exact matching', () => {
    assert.equal(evaluateAnswer('  Grüß Gott  ', 'Grüß Gott'), true);
    assert.equal(evaluateAnswer('Gruss Gott', 'Grüß Gott'), false);
  });

  it('calculates the next expression index with wraparound', () => {
    assert.equal(getNextExpressionIndex(0, ['Apfel', 'Birne']), 1);
    assert.equal(getNextExpressionIndex(1, ['Apfel', 'Birne']), 0);
    assert.equal(getNextExpressionIndex(3, []), 0);
  });

  it('moves the current expression to the back of the queue for Weiter', () => {
    const state = createDictationState(['Apfel', 'Birne', 'Zwetschke']);

    const nextState = moveCurrentExpressionToBack(state);

    assert.deepEqual(nextState.expressions, ['Birne', 'Zwetschke', 'Apfel']);
    assert.equal(nextState.currentIndex, 0);
    assert.equal(getCurrentExpression(nextState), 'Birne');
  });

  it('keeps a single expression available when moving it to the back', () => {
    const state = createDictationState(['Apfel']);

    const nextState = moveCurrentExpressionToBack(state);

    assert.deepEqual(nextState.expressions, ['Apfel']);
    assert.equal(nextState.currentIndex, 0);
  });

  it('moves through expressions without changing the expression list', () => {
    const state = createDictationState(['Apfel', 'Birne']);

    assert.equal(getCurrentExpression(state), 'Apfel');
    assert.equal(getCurrentExpression(moveToNextExpression(state)), 'Birne');
    assert.equal(getCurrentExpression(moveToNextExpression(moveToNextExpression(state))), 'Apfel');
  });
});
