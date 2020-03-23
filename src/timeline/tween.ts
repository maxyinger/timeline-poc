import { clamp, lerp } from "./calc";
import emitter from "./emitter";
import { InterpolationValue, Progressor, TweenConfig } from "./types";
import { easing } from "ts-easing";

const tween = <T extends Record<string, number>>(
  config: TweenConfig<T>
): Progressor<T> => {
  if (!config.ease) {
    config.ease = easing.linear;
  }
  if (!config.duration) {
    config.duration = 300;
  }
  const subscriptions = emitter<InterpolationValue<T>>();

  const state = {
    progress: 0,
    duration: config.duration,
    timeScale: 1
  };

  const interpolator = (progress: number): InterpolationValue<T> => {
    const clampedProgress = clamp([0, 1])(progress);
    const animatedProperties = Object.keys(config.from) as (keyof T)[];
    const interpolatedValue = animatedProperties.reduce<InterpolationValue<T>>(
      (current, animatedProperty) => {
        current[animatedProperty] = lerp(
          config.from[animatedProperty],
          config.to[animatedProperty],
          config.ease!(clampedProgress)
        );
        return current;
      },
      {
        ...config.from
      }
    );

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

export default tween;
