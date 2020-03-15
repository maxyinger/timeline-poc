import { TEasing } from "ts-easing";
import { Range } from "./calc";

export type Offset = number | string;

export interface TransitionInterface {
  getDuration: () => number;
  setProgress: (t: number) => void;
}

export type TimelineEntry = {
  key: string;
  transition: TransitionInterface;
  offset: ((t: number) => number) | number;
};

export type TweenConfig<T extends Record<string, number>> = {
  duration: number;
  ease: TEasing;
  from: T;
  to: T;
};

export type StaggerConfig<T extends Record<string, number>> = {
  length: number;
  delay: ((i: number) => number) | number;
} & TweenConfig<T>;

export type Tween<T extends Record<string, number>> = (
  config: TweenConfig<T>
) => TransitionInterface;

export type Stagger<T extends Record<string, number>> = (
  config: StaggerConfig<T>
) => TransitionInterface;

export type Timeline = (config: TimelineEntry[]) => TransitionInterface;
