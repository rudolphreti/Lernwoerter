import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appSource = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');

describe('App TXT import/export menu', () => {
  it('does not render a TXT preview textarea', () => {
    assert.doesNotMatch(appSource, /<textarea\b/);
    assert.doesNotMatch(appSource, /textList/);
  });

  it('imports TXT through a file input and exports a TXT download', () => {
    assert.match(appSource, /type="file"/);
    assert.match(appSource, /accept="\.txt,text\/plain"/);
    assert.match(appSource, /download = 'lernwoerter.txt'/);
  });

  it('opens import and export actions from a hamburger menu in the top right', () => {
    assert.match(appSource, /const \[isMenuOpen, setIsMenuOpen\] = useState\(false\)/);
    assert.match(appSource, /aria-label=\{uiText\.menu\}/);
    assert.match(appSource, /☰/);
    assert.match(appSource, /className="relative flex items-start justify-between gap-3"/);
    assert.match(appSource, /\{isMenuOpen && \(/);
    assert.match(appSource, /aria-label=\{uiText\.import\}/);
    assert.match(appSource, /aria-label=\{uiText\.export\}/);
  });

  it('does not render a separate import/export panel below the trainer', () => {
    assert.doesNotMatch(appSource, /<section className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">\s*<input[\s\S]*?\{uiText\.import\}/);
  });

  it('renders a speech synthesizer selector inside the hamburger menu', () => {
    assert.match(appSource, /listSpeechVoices/);
    assert.match(appSource, /selectedVoiceURI/);
    assert.match(appSource, /uiText\.voiceLabel/);
    assert.match(appSource, /<select[\s\S]*?value=\{selectedVoiceURI\}/);
  });

  it('speaks the next expression one second after a correct answer', () => {
    assert.match(appSource, /setTimeout\(\(\) => \{/);
    assert.match(appSource, /1000\)/);
    assert.match(appSource, /speakExpression\(nextExpression, selectedVoiceURI\)/);
  });

});
