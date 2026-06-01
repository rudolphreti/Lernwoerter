import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appSource = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');

describe('App TXT import/export UI', () => {
  it('does not render a TXT preview textarea', () => {
    assert.doesNotMatch(appSource, /<textarea\b/);
    assert.doesNotMatch(appSource, /textList/);
  });

  it('imports TXT through a file input and exports a TXT download', () => {
    assert.match(appSource, /type="file"/);
    assert.match(appSource, /accept="\.txt,text\/plain"/);
    assert.match(appSource, /download = 'lernwoerter.txt'/);
  });
});
