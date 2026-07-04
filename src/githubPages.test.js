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

  it('deploys only from main pushes to avoid duplicate runs after a pull request merge', () => {
    const workflow = readProjectFile('.github/workflows/deploy-pages.yml');

    assert.match(workflow, /push:\n\s+branches:\s*\[main\]/);
    assert.doesNotMatch(workflow, /pull_request:/);
    assert.doesNotMatch(workflow, /github\.event\.pull_request\.merged/);
  });

  it('commits an npm lockfile required by npm ci and setup-node caching', () => {
    const lockfile = JSON.parse(readProjectFile('package-lock.json'));

    assert.equal(lockfile.name, 'lernwoerter');
    assert.equal(lockfile.lockfileVersion, 3);
  });

  it('has a GitHub Pages workflow that builds the static app', () => {
    const workflow = readProjectFile('.github/workflows/deploy-pages.yml');

    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npm test/);
    assert.match(workflow, /npm run build/);
    assert.match(workflow, /actions\/configure-pages@v6/);
    assert.match(workflow, /actions\/checkout@v7/);
    assert.match(workflow, /actions\/setup-node@v6/);
    assert.match(workflow, /actions\/upload-pages-artifact@v5/);
    assert.match(workflow, /actions\/deploy-pages@v5/);
  });
});
