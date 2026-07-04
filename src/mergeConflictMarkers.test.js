import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

const repositoryRoot = process.cwd();
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules']);
const checkedExtensions = new Set(['.css', '.html', '.js', '.jsx', '.json', '.md', '.yml']);
const conflictMarkerPattern = /^(<<<<<<<|=======|>>>>>>>) /m;

function getExtension(path) {
  const match = path.match(/\.[^.]+$/);
  return match?.[0] ?? '';
}

function collectProjectFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return ignoredDirectories.has(entry) ? [] : collectProjectFiles(fullPath);
    }

    return checkedExtensions.has(getExtension(entry)) ? [fullPath] : [];
  });
}

describe('merge conflict markers', () => {
  it('are not committed in project files', () => {
    const filesWithMarkers = collectProjectFiles(repositoryRoot)
      .filter((path) => conflictMarkerPattern.test(readFileSync(path, 'utf8')))
      .map((path) => relative(repositoryRoot, path));

    assert.deepEqual(filesWithMarkers, []);
  });
});
