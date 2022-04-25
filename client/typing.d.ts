declare module '*.scss';

interface Window {
  onClickBody: (e: MouseEvent) => void;
  voices: SpeechSynthesisVoice[];
  draw: () => void;
}
