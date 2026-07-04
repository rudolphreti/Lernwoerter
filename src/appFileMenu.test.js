import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appSource = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');
const uiTextSource = readFileSync(join(process.cwd(), 'src/i18n/uiText.js'), 'utf8');

describe('file menu UI', () => {
  it('keeps import, export, and keyboard help controls in the hamburger menu', () => {
    assert.match(appSource, /uiText\.menu/);
    assert.match(appSource, /aria-expanded=\{isMenuOpen\}/);
    assert.match(appSource, /handleImportFile/);
    assert.match(appSource, /handleExportFile/);
    assert.match(appSource, /uiText\.keyboardHelpTitle/);
    assert.match(appSource, /uiText\.keyboardShortcuts/);
  });

  it('does not expose an editable text area for the expression text file', () => {
    assert.doesNotMatch(appSource, /<textarea/);
    assert.doesNotMatch(appSource, /setText/);
    assert.match(appSource, /type="file"/);
    assert.match(appSource, /accept="\.txt,text\/plain"/);
  });
});


describe('keyboard-friendly child UI', () => {
  it('documents keyboard shortcuts and wires them to the app', () => {
    assert.match(appSource, /onKeyDown=\{handleKeyboardShortcut\}/);
    assert.match(appSource, /ctrlKey/);
    assert.match(appSource, /Escape/);
  });

  it('does not use Strg + W as a shortcut because browsers reserve it', () => {
    assert.doesNotMatch(appSource, /key === 'w'/);
    assert.doesNotMatch(uiTextSource, /Strg \+ W: Weiter/);
  });

  it('centers the answer input and uses a large font', () => {
    assert.match(appSource, /items-center/);
    assert.match(appSource, /text-3xl/);
    assert.match(appSource, /text-center/);
  });

  it('moves the current expression to the queue back and speaks the new expression on Weiter', () => {
    assert.match(appSource, /moveCurrentExpressionToBack/);
    assert.match(appSource, /setExpressions\(nextState\.expressions\)/);
    assert.match(appSource, /speakExpression\(getCurrentExpression\(nextState\)\)/);
  });

  it('runs Weiter from the Strg + ArrowRight keyboard shortcut with default browser handling prevented', () => {
    assert.match(appSource, /key === 'ArrowRight'/);
    assert.match(appSource, /event\.preventDefault\(\);\n\s+handleNext\(\)/);
    assert.match(uiTextSource, /Strg \+ Pfeil rechts: Weiter/);
  });

  it('moves to and speaks the next expression after a correct answer', () => {
    assert.match(appSource, /const nextIndex = getNextExpressionIndex\(currentIndex, expressions\)/);
    assert.match(appSource, /speakExpression\(expressions\[nextIndex\]/);
  });


  it('delays speech until after the feedback sound on correct and wrong answers', () => {
    assert.match(appSource, /feedbackSpeechDelayMs/);
    assert.match(appSource, /setTimeout\(callback, feedbackSpeechDelayMs\)/);
    assert.match(appSource, /scheduleSpeechAfterFeedback\(playNextExpression\)/);
    assert.match(appSource, /scheduleSpeechAfterFeedback\(\(\) => speakExpression\(currentExpression\)\)/);
  });
});
