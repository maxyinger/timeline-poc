import { TimelineEntry } from "./types";
import { Range, interpolateRange } from "./calc";

type TimelineRanges = {
  timelineRange: Range;
  entryRanges: Range[];
};

export const getTimelineRanges = (entries: TimelineEntry[]): TimelineRanges => {
  return entries.reduce<TimelineRanges>(
    (accum, entry) => {
      const [timelineStart, timelineEnd] = accum.timelineRange;

      /**
       * Calculate earliest start.
       */
      const current = timelineEnd;
      const entryStart =
        typeof entry.offset === "function"
          ? entry.offset(current)
          : entry.offset;
      const start = Math.min(timelineStart, entryStart);

      /**
       * Calculate latest end.
       */
      const entryEnd = entryStart + entry.transition.getDuration();
      const end = Math.max(timelineEnd, entryEnd);

      /**
       * Add reference range
       */
      const entryRange: Range = [entryStart, entryEnd];
      accum.entryRanges.push(entryRange);

      return {
        ...accum,
        timelineRange: [start, end]
      };
    },
    {
      timelineRange: [0, 0],
      entryRanges: []
    }
  );
};

export type NormalizedTimeline = {
  duration: number;
  normalizedEntryRanges: Range[];
};

export const normalizeTimelineRanges = (
  referenceTimeline: TimelineRanges
): NormalizedTimeline => {
  const [timelineStart, timelineEnd] = referenceTimeline.timelineRange;
  const duration = timelineEnd - timelineStart;

  const normalizedTimelineRange = interpolateRange(
    referenceTimeline.timelineRange,
    [0, 1]
  );

  return {
    duration,
    normalizedEntryRanges: referenceTimeline.entryRanges.map(entryrange => {
      return [
        normalizedTimelineRange(entryrange[0]),
        normalizedTimelineRange(entryrange[1])
      ];
    })
  };
};
