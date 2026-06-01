export function speakExpression(expression) {
  const synth = globalThis.speechSynthesis;
  if (!synth || !expression) {
    return;
  }

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(expression);
  utterance.lang = 'de-AT';
  synth.speak(utterance);
}
