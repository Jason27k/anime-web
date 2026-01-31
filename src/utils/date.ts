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
