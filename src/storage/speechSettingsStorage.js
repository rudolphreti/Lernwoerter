export const speechSettingsStorageKey = 'lernwoerter.speechSettings';
export const speechSettingsStorageVersion = 1;

function parseStoredSpeechSettings(storedValue) {
  let parsed;

  try {
    parsed = JSON.parse(storedValue);
  } catch {
    return null;
  }

  if (!parsed || parsed.version !== speechSettingsStorageVersion || typeof parsed.selectedVoiceURI !== 'string') {
    return null;
  }

  return parsed.selectedVoiceURI;
}

function createSpeechSettingsDocument(selectedVoiceURI) {
  return JSON.stringify({
    version: speechSettingsStorageVersion,
    selectedVoiceURI,
  });
}

export function loadSelectedVoiceURI(storage = globalThis.localStorage) {
  const storedValue = storage?.getItem(speechSettingsStorageKey);
  if (!storedValue) {
    return '';
  }

  return parseStoredSpeechSettings(storedValue) ?? '';
}

export function saveSelectedVoiceURI(selectedVoiceURI, storage = globalThis.localStorage) {
  storage?.setItem(speechSettingsStorageKey, createSpeechSettingsDocument(selectedVoiceURI));
}
