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
