export function createDictationState(expressions) {
  return {
    expressions: [...expressions],
    currentIndex: 0,
  };
}

export function getCurrentExpression(state) {
  if (state.expressions.length === 0) {
    return '';
  }

  return state.expressions[state.currentIndex] ?? state.expressions[0];
}

export function getNextExpressionIndex(currentIndex, expressions) {
  if (expressions.length === 0) {
    return 0;
  }

  return (currentIndex + 1) % expressions.length;
}

export function moveCurrentExpressionToBack(state) {
  if (state.expressions.length === 0) {
    return createDictationState([]);
  }

  const currentIndex = state.currentIndex < state.expressions.length ? state.currentIndex : 0;
  const nextExpressions = [...state.expressions];
  const [currentExpression] = nextExpressions.splice(currentIndex, 1);
  nextExpressions.push(currentExpression);

  return {
    expressions: nextExpressions,
    currentIndex: currentIndex >= nextExpressions.length - 1 ? 0 : currentIndex,
  };
}

export function moveToNextExpression(state) {
  if (state.expressions.length === 0) {
    return createDictationState([]);
  }

  return {
    expressions: [...state.expressions],
    currentIndex: getNextExpressionIndex(state.currentIndex, state.expressions),
  };
}

export function evaluateAnswer(answer, expected) {
  return answer.trim() === expected.trim();
}
