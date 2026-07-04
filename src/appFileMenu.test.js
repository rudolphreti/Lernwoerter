import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appSource = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');

describe('file menu UI', () => {
  it('keeps import and export controls in the hamburger menu', () => {
    assert.match(appSource, /uiText\.menu/);
    assert.match(appSource, /aria-expanded=\{isMenuOpen\}/);
    assert.match(appSource, /handleImportFile/);
    assert.match(appSource, /handleExportFile/);
  });

  it('does not expose an editable text area for the expression text file', () => {
    assert.doesNotMatch(appSource, /<textarea/);
    assert.doesNotMatch(appSource, /setText/);
    assert.match(appSource, /type="file"/);
    assert.match(appSource, /accept="\.txt,text\/plain"/);
  });
});
