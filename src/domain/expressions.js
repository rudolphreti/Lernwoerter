export const emptyTextListMessage = 'Die TXT-Liste braucht mindestens ein Wort.';

export function normalizeExpressions(expressions) {
  if (!Array.isArray(expressions) || expressions.some((expression) => typeof expression !== 'string')) {
    return null;
  }

  const normalized = expressions.map((expression) => expression.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : null;
}

export function parseExpressionsText(text) {
  const normalized = normalizeExpressions(text.split(/\r?\n/));
  if (!normalized) {
    return { ok: false, message: emptyTextListMessage };
  }

  return { ok: true, value: normalized };
}

export function createExportText(expressions) {
  return (normalizeExpressions(expressions) ?? []).join('\n');
}
