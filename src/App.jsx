import { useMemo, useRef, useState } from 'react';
import { evaluateAnswer } from './domain/dictation.js';
import { createExportText, parseExpressionsText } from './domain/expressions.js';
import { uiText } from './i18n/uiText.js';
import { playResultSound } from './sound/feedbackSound.js';
import { speakExpression } from './speech/speech.js';
import { loadExpressions, saveExpressions } from './storage/expressionStorage.js';

export default function App() {
  const [expressions, setExpressions] = useState(() => loadExpressions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const fileInputRef = useRef(null);

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

  function handleImport() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    let fileText;
    try {
      fileText = await file.text();
    } catch {
      setFeedback(uiText.importReadError);
      playResultSound(false);
      event.target.value = '';
      return;
    }

    const parsed = parseExpressionsText(fileText);
    if (!parsed.ok) {
      setFeedback(parsed.message);
      playResultSound(false);
      event.target.value = '';
      return;
    }

    updateExpressions(parsed.value);
    setFeedback(uiText.imported);
    playResultSound(true);
    event.target.value = '';
  }

  function handleExport() {
    const exportFile = new Blob([createExportText(expressions)], { type: 'text/plain;charset=utf-8' });
    const exportUrl = URL.createObjectURL(exportFile);
    const link = document.createElement('a');

    link.href = exportUrl;
    link.download = 'lernwoerter.txt';
    link.click();
    URL.revokeObjectURL(exportUrl);
    setFeedback(uiText.exportReady);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{uiText.appTitle}</h1>

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

      <section className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <input
          accept=".txt,text/plain"
          aria-label={uiText.importFileLabel}
          className="sr-only"
          onChange={handleImportFile}
          ref={fileInputRef}
          type="file"
        />
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-md bg-neutral-50 px-4 py-3 font-medium text-neutral-950" onClick={handleImport} type="button">
            {uiText.import}
          </button>
          <button className="rounded-md border border-neutral-700 px-4 py-3 font-medium" onClick={handleExport} type="button">
            {uiText.export}
          </button>
        </div>
      </section>
    </main>
  );
}
