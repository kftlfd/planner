export type TaskDayTimestamp = string;

export const getDayTimestamp: (day: Date) => TaskDayTimestamp = (day) =>
  day.toLocaleString(undefined, {
    dateStyle: "short",
  });

export const getMonthTitle = (day: Date) =>
  day.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
