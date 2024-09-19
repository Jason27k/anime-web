import AnimeCalendar from "@/components/Calendar/AnimeCalendar";
import { convertToLocalTime } from "@/utils/date";
import { fetchSchedule } from "../actions";

const WeeklyCalendar = async () => {
  const dates = new Map<Number, [String, Number]>();
  var page = 1;
  var response = await fetchSchedule(page);

  if (response === undefined) {
    return <div>Failed to fetch data, please refresh</div>;
  }

  var animeData = response.data;

  animeData.map((anime) => {
    dates.set(
      anime.mal_id,
      convertToLocalTime(
        anime.broadcast.day,
        anime.broadcast.time,
        anime.broadcast.timezone
      )
    );
  });

  while (response.pagination?.has_next_page) {
    page += 1;
    response = await fetchSchedule(page);
    if (response === undefined) {
      break;
    }
    animeData.push(...response.data);
    animeData.map((anime) => {
      dates.set(
        anime.mal_id,
        convertToLocalTime(
          anime.broadcast.day,
          anime.broadcast.time,
          anime.broadcast.timezone
        )
      );
    });
  }

  animeData = animeData.filter((anime) => anime.members > 15000);
  return (
    <div className="">
      <AnimeCalendar animeData={animeData} dates={dates} />
    </div>
  );
};

export default WeeklyCalendar;
