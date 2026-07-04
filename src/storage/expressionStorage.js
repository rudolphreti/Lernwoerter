import { createExportText, parseExpressionsText } from '../domain/expressions.js';

export const expressionStorageKey = 'lernwoerter.expressionsText';
export const defaultExpressions = ['Guten Morgen', 'Das ist ein Apfel'];

export function loadExpressions(storage = globalThis.localStorage) {
  const storedValue = storage?.getItem(expressionStorageKey);
  if (!storedValue) {
    return [...defaultExpressions];
  }

  const parsed = parseExpressionsText(storedValue);
  return parsed.ok ? parsed.value : [...defaultExpressions];
}

export function saveExpressions(expressions, storage = globalThis.localStorage) {
  storage?.setItem(expressionStorageKey, createExportText(expressions));
}
