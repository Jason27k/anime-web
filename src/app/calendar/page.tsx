import AnimeCalendar from "@/components/Calendar/AnimeCalendar";
import { convertToLocalTime } from "@/utils/date";
import { fetchSchedule } from "../actions";

const WeeklyCalendar = async () => {
  const MIN_MEMBERS = 10000;

  const dates = new Map<Number, Number>();
  var page = 1;
  var response = await fetchSchedule(page);

  if (response === undefined) {
    return <div>Failed to fetch data, please refresh</div>;
  }

  var animeData = response.data.filter((anime) => anime.members >= MIN_MEMBERS);

  animeData.map((anime) => {
    dates.set(
      anime.mal_id,
      convertToLocalTime(
        anime.broadcast.day,
        anime.broadcast.time,
        anime.broadcast.timezone
      )[1]
    );
  });

  while (response.pagination?.has_next_page) {
    page += 1;
    response = await fetchSchedule(page);
    if (response === undefined) {
      break;
    }
    animeData.push(
      ...response.data.filter((anime) => anime.members > MIN_MEMBERS)
    );
    animeData.map((anime) => {
      dates.set(
        anime.mal_id,
        convertToLocalTime(
          anime.broadcast.day,
          anime.broadcast.time,
          anime.broadcast.timezone
        )[1]
      );
    });
  }

  return (
    <div className="">
      <AnimeCalendar animeData={animeData} dates={dates} />
    </div>
  );
};

export default WeeklyCalendar;
