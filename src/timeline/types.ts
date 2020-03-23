import { TEasing } from "ts-easing";
import { Subscribe } from "./emitter";

export type Offset = number | string;

export type InterpolationValue<T> = Record<keyof T, number>;

export interface Progressor<T = Record<string, any>> {
  getDuration: () => number;
  setProgress: (t: number) => InterpolationValue<T>;
  subscribe: Subscribe<InterpolationValue<T>>;
}

export type TimelineEntry = {
  key: string;
  offset?: ((t: number) => number) | number;
  progressor: Progressor;
};

export type TweenConfig<T extends Record<string, number>> = {
  duration?: number;
  ease?: TEasing;
  from: T;
  to: T;
};

export type StaggerConfig = {
  length: number;
  delay: ((i: number) => number) | number;
  progressor: Progressor;
};

export type Stagger = (config: StaggerConfig) => Progressor;

export type Timeline = (config: TimelineEntry[]) => Progressor;
