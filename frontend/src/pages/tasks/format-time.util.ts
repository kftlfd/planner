const dateTimeFormat: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour12: false,
  hour: "numeric",
  minute: "2-digit",
};

export const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleString(undefined, dateTimeFormat);
