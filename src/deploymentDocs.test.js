import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(repositoryRoot, path), 'utf8');
}

describe('deployment documentation', () => {
  it('explains that GitHub Actions starts after pushing main to GitHub', () => {
    const readme = readProjectFile('README.md');

    assert.match(readme, /git push origin main/);
    assert.match(readme, /GitHub Actions/);
  });
});
