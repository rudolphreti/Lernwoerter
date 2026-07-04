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

  it('deploys after a pull request is merged into main', () => {
    const workflow = readProjectFile('.github/workflows/deploy-pages.yml');

    assert.match(workflow, /pull_request:/);
    assert.match(workflow, /branches:\s*\[main\]/);
    assert.match(workflow, /types:\s*\[closed\]/);
    assert.match(workflow, /if:\s*github\.event_name == ['"]push['"] \|\| github\.event\.pull_request\.merged == true/);
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
    assert.match(workflow, /actions\/deploy-pages/);
  });
});
