/**
 * USAGE
 * -----
 *
 * const { setTimeScale, progress } = timeline([
 *  {
 *   key: 'phase1',
 *   transition: tween({
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
 *   transition: stagger({
 *     duration: 200,
 *     ease: easing.outSine
 *     length: 5,
 *     delay: 200 | i => i * 20,
 *     from: {
 *       opacity: 0
 *     },
 *     to: {
 *        opacity: 1
 *     },
 *    }),
 *    offset: 0.15 | 'v => v + 0.15'
 *  }
 * ]);
 */

import { Timeline } from "./types";
import { getDurationFromTimelineEntries } from "./utils";

const timeline: Timeline = entries => {
  const state = {
    duration: getDurationFromTimelineEntries(entries),
    progress: 0
  };

  const getDuration = () => {
    return state.duration;
  };

  const setProgress = (t: number) => {
    state.progress = t;
  };

  return {
    getDuration,
    setProgress
  };
};

export default timeline;
