export const EXPRESSION_DOCUMENT_VERSION = 1;
export const expressionParseErrors = {
  invalidJson: 'invalidJson',
  invalidExpressions: 'invalidExpressions',
};

export function normalizeExpressions(expressions) {
  if (!Array.isArray(expressions) || expressions.some((expression) => typeof expression !== 'string')) {
    return null;
  }

  const normalized = expressions.map((expression) => expression.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : null;
}

export function parseExpressionsJson(jsonText) {
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, error: expressionParseErrors.invalidJson };
  }

  if (!parsed || parsed.version !== EXPRESSION_DOCUMENT_VERSION) {
    return { ok: false, error: expressionParseErrors.invalidExpressions };
  }

  const normalized = normalizeExpressions(parsed.expressions);
  if (!normalized) {
    return { ok: false, error: expressionParseErrors.invalidExpressions };
  }

  return { ok: true, value: normalized };
}

export function createExportJson(expressions) {
  const normalized = normalizeExpressions(expressions) ?? [];
  return JSON.stringify({ version: EXPRESSION_DOCUMENT_VERSION, expressions: normalized }, null, 2);
}
