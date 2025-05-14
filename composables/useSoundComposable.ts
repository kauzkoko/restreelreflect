export function useSoundComposable(soundSrc: string) {


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
