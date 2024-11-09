import AnimeCalendar from "@/components/Calendar/AnimeCalendar";
import { fetchSchedule } from "../actions";
import { getWeekRangeFromToday } from "@/utils/date";
import { CalendarQueryResponse } from "@/utils/anilistTypes";

const WeeklyCalendar = async () => {
  const MIN_MEMBERS = 2000;
  let page = 1;
  const { startOfWeek, endOfWeek } = getWeekRangeFromToday();

  let response: CalendarQueryResponse = await fetchSchedule(
    startOfWeek,
    endOfWeek,
    page
  );

  let airingSchedules = response.data.Page.airingSchedules.filter(
    (schedule) =>
      schedule.media.popularity >= MIN_MEMBERS &&
      (schedule.media.format === "TV" || schedule.media.format === "ONA") &&
      schedule.media.type === "ANIME" &&
      schedule.media.popularity >= MIN_MEMBERS
  );

  while (response.data.Page.pageInfo.hasNextPage) {
    page++;
    response = await fetchSchedule(startOfWeek, endOfWeek, page);
    airingSchedules = airingSchedules.concat(
      response.data.Page.airingSchedules.filter(
        (schedule) =>
          schedule.media.popularity >= MIN_MEMBERS &&
          (schedule.media.format === "TV" || schedule.media.format === "ONA") &&
          schedule.media.type === "ANIME" &&
          schedule.media.popularity >= MIN_MEMBERS
      )
    );
  }

  return (
    <div className="">
      <AnimeCalendar airingSchedules={airingSchedules} />
    </div>
  );
};

export default WeeklyCalendar;
