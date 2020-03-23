import { Progressor } from "./types";

const play = (normal: Progressor) => {
  const duration = normal.getDuration();
  const start = performance.now();

  const loop = () => {
    const delta = performance.now() - start;
    const progress = delta / duration;
    normal.setProgress(progress);

    if (progress < 1) {
      requestAnimationFrame(loop);
    }
  };

  loop();
};

export default play;
