import { normalizeExpressions } from '../domain/expressions.js';

export const expressionStorageKey = 'lernwoerter.expressions';
export const expressionStorageVersion = 1;
export const defaultExpressions = ['Guten Morgen', 'Das ist ein Apfel'];

function parseStoredExpressions(storedValue) {
  let parsed;

  try {
    parsed = JSON.parse(storedValue);
  } catch {
    return null;
  }

  if (!parsed || parsed.version !== expressionStorageVersion) {
    return null;
  }

  return normalizeExpressions(parsed.expressions);
}

function createStorageDocument(expressions) {
  return JSON.stringify({
    version: expressionStorageVersion,
    expressions: normalizeExpressions(expressions) ?? [],
  });
}

export function loadExpressions(storage = globalThis.localStorage) {
  const storedValue = storage?.getItem(expressionStorageKey);
  if (!storedValue) {
    return [...defaultExpressions];
  }

  return parseStoredExpressions(storedValue) ?? [...defaultExpressions];
}

export function saveExpressions(expressions, storage = globalThis.localStorage) {
  storage?.setItem(expressionStorageKey, createStorageDocument(expressions));
}
