import { TimelineEntry } from "./types";
import { Range, interpolateRange, deltaFromRange } from "./calc";

export type TimelineEntryWithRange = TimelineEntry & {
  range: Range;
};

export type TimelineWithRanges = {
  range: Range;
  entries: TimelineEntryWithRange[];
};

export const getTimelineWithRanges = (
  entries: TimelineEntry[]
): TimelineWithRanges => {
  return entries.reduce<TimelineWithRanges>(
    (accum, entry) => {
      if (!entry.offset) {
        entry.offset = (v: number) => v;
      }

      const [timelineStart, timelineEnd] = accum.range;

      /**
       * Calculate earliest start.
       */
      const current = timelineEnd;
      const entryStart =
        typeof entry.offset === "function"
          ? entry.offset(current)
          : entry.offset;
      const nextTimelineStart = Math.min(timelineStart, entryStart);

      /**
       * Calculate latest end.
       */
      const entryEnd = entryStart + entry.progressor.getDuration();
      const nextTimelineEnd = Math.max(timelineEnd, entryEnd);

      /**
       * Add reference range
       */
      const entryRange: Range = [entryStart, entryEnd];
      const entryWithRange = {
        ...entry,
        range: entryRange
      };

      return {
        range: [nextTimelineStart, nextTimelineEnd],
        entries: [...accum.entries, entryWithRange]
      };
    },
    {
      range: [0, 0],
      entries: []
    }
  );
};

export const normalizeRangeToTimeline = (
  timelineRange: Range,
  entryRange: Range
): Range => {
  const timelineNormalizedRange = interpolateRange(timelineRange, [0, 1]);

  const normalizeEntryRangeToTimeline = (r: Range): Range => [
    timelineNormalizedRange(r[0]),
    timelineNormalizedRange(r[1])
  ];

  return normalizeEntryRangeToTimeline(entryRange);
};

export const getNormalizedTimeline = (entries: TimelineEntry[]) => {
  const timelineWithRanges = getTimelineWithRanges(entries);
  const entriesWithNormalizedRange = timelineWithRanges.entries.map(
    entryWithRange => {
      const { range, ...entry } = entryWithRange;
      return {
        ...entry,
        normalizedRange: normalizeRangeToTimeline(
          timelineWithRanges.range,
          range
        )
      };
    }
  );

  return {
    duration: deltaFromRange(timelineWithRanges.range),
    entries: entriesWithNormalizedRange
  };
};
