export function convertUTCToLocal(timestamp: number): Date {
  const date = new Date(timestamp * 1000);
  return date;
}

export function getWeekRangeFromToday(): {
  startOfWeek: number;
  endOfWeek: number;
} {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek: Math.floor(startOfWeek.getTime() / 1000),
    endOfWeek: Math.floor(endOfWeek.getTime() / 1000),
  };
}

export function getTodayRange(): {
  startOfDay: number;
  endOfDay: number;
} {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay: Math.floor(startOfDay.getTime() / 1000),
    endOfDay: Math.floor(endOfDay.getTime() / 1000),
  };
}

export function getDayRanges(): Array<{
  start: number;
  end: number;
  name: string;
  dateLabel: string;
}> {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return {
      start: Math.floor(start.getTime() / 1000),
      end: Math.floor(end.getTime() / 1000),
      name: dayNames[date.getDay()],
      dateLabel: date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
    };
  });
}

export function formatTimeUntilAiring(airingAt: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = airingAt - now;

  if (diff <= 0) {
    return "Now Airing";
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
