import { Howler } from "howler";

export function useSoundComposable(soundSrc: string) {
  const sound = useSound(soundSrc, { interrupt: true });

  const play = () => {
    Howler.stop();
    sound.stop();
    sound.play();
  };

  const stop = () => {
    sound.stop();
  };

  return {
    play,
    stop,
    isPlaying: sound.isPlaying,
  };
}
