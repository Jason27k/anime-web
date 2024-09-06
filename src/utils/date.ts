import { DateTime } from "luxon";

export function convertToLocalTime(
  day: String,
  time: String,
  timeZone: string
): [localTime: String, day: Number] {
  var date = DateTime.local().startOf("week");

  const dayOffset =
    day === "Mondays"
      ? 0
      : day === "Tuesdays"
      ? 1
      : day === "Wednesdays"
      ? 2
      : day === "Thursdays"
      ? 3
      : day === "Fridays"
      ? 4
      : day === "Saturdays"
      ? 5
      : day === "Sundays"
      ? 6
      : 0;

  if (time === "" || time === null) {
    return ["No time specified", dayOffset];
  }
  const [hours, minutes] = time.split(":").map(Number);

  const tokyoTime = DateTime.fromObject(
    {
      year: date.year,
      month: date.month,
      day: date.day + dayOffset,
      hour: hours,
      minute: minutes,
    },
    { zone: timeZone }
  );

  const localTime = tokyoTime.setZone(DateTime.local().zoneName);

  return [localTime.toLocaleString(DateTime.TIME_SIMPLE), localTime.weekday];
}
