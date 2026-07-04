export const expressionParseErrors = {
  invalidExpressions: 'invalidExpressions',
};

export function normalizeExpressions(expressions) {
  if (!Array.isArray(expressions) || expressions.some((expression) => typeof expression !== 'string')) {
    return null;
  }

  const normalized = expressions.map((expression) => expression.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : null;
}

export function parseExpressionsText(text) {
  if (typeof text !== 'string') {
    return { ok: false, error: expressionParseErrors.invalidExpressions };
  }

  const normalized = normalizeExpressions(text.split(/\r?\n/));
  if (!normalized) {
    return { ok: false, error: expressionParseErrors.invalidExpressions };
  }

  return { ok: true, value: normalized };
}

export function createExportText(expressions) {
  const normalized = normalizeExpressions(expressions) ?? [];
  return normalized.length > 0 ? `${normalized.join('\n')}\n` : '';
}
