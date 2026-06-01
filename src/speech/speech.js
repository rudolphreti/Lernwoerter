export function listSpeechVoices() {
  const synth = globalThis.speechSynthesis;
  if (!synth?.getVoices) {
    return [];
  }

  return synth.getVoices();
}

export function speakExpression(expression, selectedVoiceURI = '') {
  const synth = globalThis.speechSynthesis;
  if (!synth || !expression) {
    return;
  }

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(expression);
  const selectedVoice = listSpeechVoices().find((voice) => voice.voiceURI === selectedVoiceURI);
  utterance.lang = selectedVoice?.lang || 'de-AT';
  utterance.voice = selectedVoice || null;
  synth.speak(utterance);
}
