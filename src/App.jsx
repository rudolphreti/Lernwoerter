import { useMemo, useState } from 'react';
import { evaluateAnswer, getNextExpressionIndex } from './domain/dictation.js';
import { createExportText, parseExpressionsText } from './domain/expressions.js';
import { uiText } from './i18n/uiText.js';
import { playResultSound } from './sound/feedbackSound.js';
import { speakExpression } from './speech/speech.js';
import { loadExpressions, saveExpressions } from './storage/expressionStorage.js';

const exportFileName = 'lernwoerter.txt';

export default function App() {
  const [expressions, setExpressions] = useState(() => loadExpressions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentExpression = useMemo(() => expressions[currentIndex] ?? '', [currentIndex, expressions]);

  function updateExpressions(nextExpressions) {
    setExpressions(nextExpressions);
    setCurrentIndex(0);
    setAnswer('');
    saveExpressions(nextExpressions);
  }

  function handleListen() {
    speakExpression(currentExpression);
  }

  function playNextExpression() {
    const nextIndex = getNextExpressionIndex(currentIndex, expressions);
    setCurrentIndex(nextIndex);
    setAnswer('');
    speakExpression(expressions[nextIndex] ?? '');
  }

  function handleCheck(event) {
    event.preventDefault();
    const isCorrect = evaluateAnswer(answer, currentExpression);
    setFeedback(isCorrect ? uiText.correct : uiText.wrong);
    playResultSound(isCorrect);

    if (isCorrect) {
      playNextExpression();
    }
  }

  function handleNext() {
    const nextIndex = getNextExpressionIndex(currentIndex, expressions);
    setCurrentIndex(nextIndex);
    setAnswer('');
    setFeedback('');
  }

  function handleKeyboardShortcut(event) {
    if (event.key === 'Escape') {
      setIsMenuOpen(false);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
      return;
    }

    if (!event.ctrlKey) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'l') {
      event.preventDefault();
      handleListen();
    }

    if (key === 'm') {
      event.preventDefault();
      setIsMenuOpen((isOpen) => !isOpen);
    }
  }

  async function handleImportFile(event) {
    const [file] = event.target.files ?? [];
    if (!file) {
      return;
    }

    const parsed = parseExpressionsText(await file.text());
    event.target.value = '';

    if (!parsed.ok) {
      setFeedback(uiText.errors[parsed.error]);
      playResultSound(false);
      return;
    }

    updateExpressions(parsed.value);
    setFeedback(uiText.imported);
    setIsMenuOpen(false);
    playResultSound(true);
  }

  function handleExportFile() {
    const blob = new Blob([createExportText(expressions)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFileName;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback(uiText.exportReady);
    setIsMenuOpen(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 bg-amber-50 px-4 py-6 text-slate-950" onKeyDown={handleKeyboardShortcut}>
      <header className="flex items-center justify-between gap-3 rounded-2xl bg-sky-200 px-4 py-3">
        <h1 className="text-3xl font-bold tracking-tight text-sky-950">{uiText.appTitle}</h1>
        <div className="relative">
          <button
            aria-expanded={isMenuOpen}
            aria-label={uiText.menu}
            className="rounded-xl border-2 border-sky-700 bg-white px-4 py-3 text-xl font-bold text-sky-950"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            ☰
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 z-10 mt-2 flex w-72 flex-col gap-3 rounded-2xl border-2 border-sky-200 bg-white p-4 text-slate-950">
              <label className="cursor-pointer rounded-xl bg-emerald-200 px-4 py-3 text-center font-bold text-emerald-950">
                {uiText.import}
                <input accept=".txt,text/plain" className="sr-only" onChange={handleImportFile} type="file" />
              </label>
              <button className="rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-3 font-bold" onClick={handleExportFile} type="button">
                {uiText.export}
              </button>
              <section className="rounded-xl bg-amber-100 p-3">
                <h2 className="mb-2 font-bold">{uiText.keyboardHelpTitle}</h2>
                <ul className="flex flex-col gap-1 text-sm">
                  {uiText.keyboardShortcuts.map((shortcut) => (
                    <li key={shortcut}>{shortcut}</li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-5 rounded-3xl border-4 border-sky-200 bg-white p-5">
        <button
          className="w-full rounded-2xl bg-violet-300 px-5 py-4 text-xl font-bold text-violet-950 disabled:opacity-50"
          disabled={!currentExpression}
          onClick={handleListen}
          type="button"
        >
          {uiText.listen}
        </button>

        <form className="flex w-full flex-col items-center gap-5" onSubmit={handleCheck}>
          <label className="flex w-full flex-col items-center gap-3 text-center text-lg font-bold text-slate-700">
            {uiText.answerLabel}
            <input
              aria-label={uiText.answerLabel}
              className="w-full max-w-lg rounded-3xl border-4 border-amber-300 bg-amber-50 px-5 py-5 text-center text-3xl font-bold text-slate-950 outline-none focus:border-sky-500"
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={uiText.answerPlaceholder}
              value={answer}
            />
          </label>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="rounded-2xl bg-emerald-300 px-5 py-4 text-xl font-bold text-emerald-950" type="submit">
              {uiText.check}
            </button>
            <button className="rounded-2xl border-2 border-sky-300 bg-sky-50 px-5 py-4 text-xl font-bold" onClick={handleNext} type="button">
              {uiText.next}
            </button>
          </div>
        </form>

        <p aria-live="polite" className="min-h-8 text-center text-2xl font-bold text-sky-950">
          {feedback || (currentExpression ? '' : uiText.noExpression)}
        </p>
      </section>
    </main>
  );
}
