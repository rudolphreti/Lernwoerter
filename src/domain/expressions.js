export const EXPRESSION_DOCUMENT_VERSION = 1;
export const invalidJsonMessage = 'Das ist kein gültiges JSON.';
export const invalidExpressionsMessage = 'Die JSON-Datei braucht eine Liste mit Texten.';

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
    return { ok: false, message: invalidJsonMessage };
  }

  if (!parsed || parsed.version !== EXPRESSION_DOCUMENT_VERSION) {
    return { ok: false, message: invalidExpressionsMessage };
  }

  const normalized = normalizeExpressions(parsed.expressions);
  if (!normalized) {
    return { ok: false, message: invalidExpressionsMessage };
  }

  return { ok: true, value: normalized };
}

export function createExportJson(expressions) {
  const normalized = normalizeExpressions(expressions) ?? [];
  return JSON.stringify({ version: EXPRESSION_DOCUMENT_VERSION, expressions: normalized }, null, 2);
}
