export const setupSpeechVoice = () => {
  speechSynthesis.onvoiceschanged = () => {
    window.voices = window.speechSynthesis.getVoices();
  };
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
};

export const speech = (text: string, once = true) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.voices.find((voice) => voice.default) ?? null;
  utterance.voice = voice;
  if (once) utterance.onend = cancelSpeech;
  window.speechSynthesis.speak(utterance);
};
