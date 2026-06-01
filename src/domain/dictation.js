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

export function moveToNextExpression(state) {
  if (state.expressions.length === 0) {
    return createDictationState([]);
  }

  return {
    expressions: [...state.expressions],
    currentIndex: (state.currentIndex + 1) % state.expressions.length,
  };
}

export function evaluateAnswer(answer, expected) {
  return answer.trim() === expected.trim();
}
