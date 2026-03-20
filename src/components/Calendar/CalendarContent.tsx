import { fetchMyAnimeIds, fetchSchedule } from "@/app/actions";
import { CalendarQueryResponse } from "@/utils/anilistTypes";
import { getWeekRangeFromToday } from "@/utils/date";
import { currentUser } from "@clerk/nextjs/server";
import AnimeCalendar from "./AnimeCalendar";

const MIN_MEMBERS = 2000;

const CalendarContent = async () => {
  const { startOfWeek, endOfWeek } = getWeekRangeFromToday();

  const user = await currentUser();
  const loggedIn = !!(user?.id);

  const ids = (await fetchMyAnimeIds()) || [];

  let page = 1;
  let response: CalendarQueryResponse = await fetchSchedule(
    startOfWeek,
    endOfWeek,
    page
  );

  const isValid = (schedule: CalendarQueryResponse["data"]["Page"]["airingSchedules"][number]) =>
    schedule.media.popularity >= MIN_MEMBERS &&
    (schedule.media.format === "TV" || schedule.media.format === "ONA") &&
    schedule.media.type === "ANIME";

  let airingSchedules = response.data.Page.airingSchedules.filter(isValid);

  while (response.data.Page.pageInfo.hasNextPage) {
    page++;
    response = await fetchSchedule(startOfWeek, endOfWeek, page);
    airingSchedules = airingSchedules.concat(
      response.data.Page.airingSchedules.filter(isValid)
    );
  }

  return (
    <AnimeCalendar
      airingSchedules={airingSchedules}
      loggedIn={loggedIn}
      ids={ids}
    />
  );
};

export default CalendarContent;
