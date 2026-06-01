import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(repositoryRoot, path), 'utf8');
}

describe('Vite and Tailwind tooling', () => {
  it('uses the Vite Tailwind plugin so utility classes are generated in dev', () => {
    const packageJson = JSON.parse(readProjectFile('package.json'));
    const viteConfig = readProjectFile('vite.config.js');
    const styles = readProjectFile('src/styles.css');

    assert.ok(packageJson.devDependencies['@tailwindcss/vite'], '@tailwindcss/vite must be installed');
    assert.match(viteConfig, /@tailwindcss\/vite/);
    assert.match(viteConfig, /tailwindcss\(\)/);
    assert.match(styles, /@import\s+['"]tailwindcss['"]/);
  });
});
