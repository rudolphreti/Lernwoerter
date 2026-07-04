import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(repositoryRoot, path), 'utf8');
}

describe('Language Rules', () => {
  it('keeps user-facing parse errors in the dedicated UI text module', () => {
    const domainSource = readProjectFile('src/domain/expressions.js');
    const uiTextSource = readProjectFile('src/i18n/uiText.js');

    assert.doesNotMatch(domainSource, /Das ist kein gültiges JSON\./);
    assert.doesNotMatch(domainSource, /Die JSON-Datei braucht eine Liste mit Texten\./);
    assert.match(uiTextSource, /invalidJson/);
    assert.match(uiTextSource, /invalidExpressions/);
  });

  it('keeps React UI strings imported from the UI text module', () => {
    const appSource = readProjectFile('src/App.jsx');

    assert.doesNotMatch(appSource, />[A-Za-zÄÖÜäöüß][^<{]*</);
    assert.doesNotMatch(appSource, /(?:aria-label|placeholder)="[^"]*[A-Za-zÄÖÜäöüß][^"]*"/);
  });
});
