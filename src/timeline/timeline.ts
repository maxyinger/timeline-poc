/**
 * USAGE
 * -----
 *
 * const { setTimeScale, progress } = timeline([
 *  {
 *   key: 'phase1',
 *   interpolator: tween({
 *    duration: 400,
 *    ease: easing.outSine
 *    from: {
 *      x: -200,
 *      y: -100
 *    },
 *    to: {
 *      x: 0,
 *      y: 0
 *    },
 *  })
 *  offset: 0.15 | '+=0.15'
 * },
 * {
 *   key: 'phase2',
 *   offset: 0.15 | 'v => v + 0.15'
 *   interpolator: stagger({
 *    length: 5,
 *    delay: 200 | i => i * 20,
 *    interpolator: tween({
 *     duration: 200,
 *     ease: easing.outSine
 *     from: {
 *       opacity: 0
 *     },
 *     to: {
 *        opacity: 1
 *     },
 *    })
 *   }),
 *  }
 * ]);
 */

import { clamp, interpolateRange } from "./calc";
import emitter from "./emitter";
import { Timeline } from "./types";
import { getNormalizedTimeline } from "./utils";

const timeline: Timeline = entries => {
  const normalizedTimeline = getNormalizedTimeline(entries);
  const subscriptions = emitter<any>();

  const state = {
    duration: normalizedTimeline.duration,
    progress: 0,
    timeScale: 1
  };

  const interpolator = (progress: number) => {
    const clampedProgress = clamp([0, 1])(progress);

    const interpolatedValue = normalizedTimeline.entries.reduce<
      Record<string, any>
    >((interpolatedValue, entry) => {
      const getEntryProgress = interpolateRange(entry.normalizedRange, [0, 1]);
      const entryProgress = getEntryProgress(clampedProgress);

      const entryInterpolatedValue = {
        ...interpolatedValue[entry.key],
        ...entry.progressor.setProgress(entryProgress)
      };

      console.log(
        entry.key,
        clampedProgress,
        entry.normalizedRange,
        entryProgress
      );

      return {
        ...interpolatedValue,
        [entry.key]: entryInterpolatedValue
      };
    }, {});

    return interpolatedValue;
  };

  const getDuration = () => {
    return state.duration * state.timeScale;
  };

  const setProgress = (progress: number) => {
    state.progress = clamp([0, 1])(progress);
    const interpolatedValue = interpolator(state.progress);

    subscriptions.emit(interpolatedValue);
    return interpolatedValue;
  };

  return {
    getDuration,
    setProgress,
    subscribe: subscriptions.subscribe
  };
};

export default timeline;
