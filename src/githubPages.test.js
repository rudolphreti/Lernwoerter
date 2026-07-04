import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(repositoryRoot, path), 'utf8');
}

describe('GitHub Pages deployment', () => {
  it('uses the repository name as the Vite base path', () => {
    const viteConfig = readProjectFile('vite.config.js');

    assert.match(viteConfig, /base:\s*['"]\/Lernwoerter\/['"]/);
  });

  it('has a GitHub Pages workflow that builds the static app', () => {
    const workflow = readProjectFile('.github/workflows/deploy-pages.yml');

    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npm test/);
    assert.match(workflow, /npm run build/);
    assert.match(workflow, /actions\/deploy-pages/);
  });
});
