import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

describe('Vite HTML entrypoint', () => {
  it('points to an existing source module', () => {
    const html = readFileSync(join(repositoryRoot, 'index.html'), 'utf8');
    const scriptMatch = html.match(/<script\s+type="module"\s+src="(?<source>[^"]+)"/);

    assert.ok(scriptMatch?.groups?.source, 'index.html must define a module script source');

    const sourcePath = scriptMatch.groups.source.replace(/^\//, '');
    assert.equal(existsSync(join(repositoryRoot, sourcePath)), true, `${sourcePath} must exist`);
  });
});
