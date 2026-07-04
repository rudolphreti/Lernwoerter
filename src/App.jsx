import { useMemo, useState } from 'react';
import { evaluateAnswer } from './domain/dictation.js';
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

  function handleCheck(event) {
    event.preventDefault();
    const isCorrect = evaluateAnswer(answer, currentExpression);
    setFeedback(isCorrect ? uiText.correct : uiText.wrong);
    playResultSound(isCorrect);
  }

  function handleNext() {
    setCurrentIndex((index) => (expressions.length === 0 ? 0 : (index + 1) % expressions.length));
    setAnswer('');
    setFeedback('');
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
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{uiText.appTitle}</h1>
        <div className="relative">
          <button
            aria-expanded={isMenuOpen}
            aria-label={uiText.menu}
            className="rounded-md border border-neutral-700 px-3 py-2 font-medium"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            ☰
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 z-10 mt-2 flex w-48 flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
              <label className="cursor-pointer rounded-md bg-neutral-50 px-4 py-3 text-center font-medium text-neutral-950">
                {uiText.import}
                <input accept=".txt,text/plain" className="sr-only" onChange={handleImportFile} type="file" />
              </label>
              <button className="rounded-md border border-neutral-700 px-4 py-3 font-medium" onClick={handleExportFile} type="button">
                {uiText.export}
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <button
          className="rounded-md bg-neutral-50 px-4 py-3 font-medium text-neutral-950 disabled:opacity-50"
          disabled={!currentExpression}
          onClick={handleListen}
          type="button"
        >
          {uiText.listen}
        </button>

        <form className="flex flex-col gap-3" onSubmit={handleCheck}>
          <label className="flex flex-col gap-2 text-sm text-neutral-300">
            {uiText.answerLabel}
            <input
              aria-label={uiText.answerLabel}
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-3 text-base text-neutral-50 outline-none focus:border-neutral-300"
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={uiText.answerPlaceholder}
              value={answer}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-md bg-sky-500 px-4 py-3 font-medium text-neutral-950" type="submit">
              {uiText.check}
            </button>
            <button className="rounded-md border border-neutral-700 px-4 py-3 font-medium" onClick={handleNext} type="button">
              {uiText.next}
            </button>
          </div>
        </form>

        <p aria-live="polite" className="min-h-7 text-lg font-semibold">
          {feedback || (currentExpression ? '' : uiText.noExpression)}
        </p>
      </section>
    </main>
  );
}
