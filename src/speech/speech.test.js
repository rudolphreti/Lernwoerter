import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { listSpeechVoices, speakExpression } from './speech.js';

const originalSpeechSynthesis = globalThis.speechSynthesis;
const OriginalUtterance = globalThis.SpeechSynthesisUtterance;

afterEach(() => {
  globalThis.speechSynthesis = originalSpeechSynthesis;
  globalThis.SpeechSynthesisUtterance = OriginalUtterance;
});

describe('speech synthesis adapter', () => {
  it('lists available synthesis voices for selection', () => {
    const voices = [
      { name: 'Anna', lang: 'de-AT', voiceURI: 'anna' },
      { name: 'Markus', lang: 'de-DE', voiceURI: 'markus' },
    ];
    globalThis.speechSynthesis = { getVoices: () => voices };

    assert.deepEqual(listSpeechVoices(), voices);
  });

  it('uses the selected voice when speaking an expression', () => {
    const selectedVoice = { name: 'Anna', lang: 'de-AT', voiceURI: 'anna' };
    let spokenUtterance;
    globalThis.speechSynthesis = {
      cancel() {},
      getVoices: () => [selectedVoice],
      speak(utterance) {
        spokenUtterance = utterance;
      },
    };
    globalThis.SpeechSynthesisUtterance = class TestUtterance {
      constructor(text) {
        this.text = text;
      }
    };

    speakExpression('Apfel', 'anna');

    assert.equal(spokenUtterance.text, 'Apfel');
    assert.equal(spokenUtterance.lang, 'de-AT');
    assert.equal(spokenUtterance.voice, selectedVoice);
  });
});
