import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { loadSelectedVoiceURI, saveSelectedVoiceURI } from './speechSettingsStorage.js';

const store = new Map();
globalThis.localStorage = {
  clear: () => store.clear(),
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
};

describe('speech settings storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty voice selection by default', () => {
    assert.equal(loadSelectedVoiceURI(), '');
  });

  it('saves and loads the selected voice URI', () => {
    saveSelectedVoiceURI('anna');

    assert.equal(loadSelectedVoiceURI(), 'anna');
  });

  it('ignores invalid stored voice settings', () => {
    localStorage.setItem('lernwoerter.speechSettings', '{"version":1,"selectedVoiceURI":7}');

    assert.equal(loadSelectedVoiceURI(), '');
  });
});
