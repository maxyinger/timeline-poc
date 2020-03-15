import { Range } from "./types";
import lerp from "./lerp";

export const clamp = (r: Range) => (v: number) => {
  const lowerBound = Math.min(r[0], r[1]);
  const upperBound = Math.max(r[0], r[1]);
  return Math.min(Math.max(lowerBound, v), upperBound);
};

export const progressInRange = (r: Range) => (v: number) => {
  return clamp(r)(v) / (r[1] - r[0]);
};

export const interpolateRange = (r1: Range, r2: Range) => (v: number) => {
  const progress = progressInRange(r1)(v);
  return lerp(r2[0], r2[1], progress);
};

export * from "./types";
export { default as lerp } from "./lerp";
