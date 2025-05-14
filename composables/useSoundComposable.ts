export function useSoundComposable(soundSrc: string) {
  const audio = new Audio(soundSrc);

  const play = () => {
    audio.play();
  };

  const stop = () => {
    audio.pause();
  };

  return {
    play,
    stop,
  };
}
