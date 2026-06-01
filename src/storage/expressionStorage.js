import { createExportJson, parseExpressionsJson } from '../domain/expressions.js';

export const expressionStorageKey = 'lernwoerter.expressions';
export const defaultExpressions = ['Guten Morgen', 'Das ist ein Apfel'];

export function loadExpressions(storage = globalThis.localStorage) {
  const storedValue = storage?.getItem(expressionStorageKey);
  if (!storedValue) {
    return [...defaultExpressions];
  }

  const parsed = parseExpressionsJson(storedValue);
  return parsed.ok ? parsed.value : [...defaultExpressions];
}

export function saveExpressions(expressions, storage = globalThis.localStorage) {
  storage?.setItem(expressionStorageKey, createExportJson(expressions));
}
