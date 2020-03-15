/**
 * Wikipedia precise method for ease.
 * https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
 */

const lerp = (initial: number, target: number, progress: number) => {
  return initial * (1 - progress) + target * progress;
};

export default lerp;
