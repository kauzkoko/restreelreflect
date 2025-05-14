import { Howler } from "howler";

export function useSoundComposable(soundSrc: string) {
  const sound = useSound(soundSrc);
  // const sound = useSound(soundSrc, { interrupt: true });

  const play = () => {
    Howler.stop();
    sound.play();
  };

  const stop = () => {
    sound.stop();
  };

  return {
    play,
    stop,
  };
}
