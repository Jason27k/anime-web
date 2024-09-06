import AnimeCalendar from "@/components/Calendar/AnimeCalendar";
import { Anime, JikanResponse, JikanClient } from "@tutkli/jikan-ts";
import { jikanLimiter } from "@/utils/limiter";
import { convertToLocalTime } from "@/utils/date";
import { writeFileSync, readFileSync } from "fs";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const WeeklyCalendar = async () => {
  const jikanClient = new JikanClient();
  const dates = new Map<Number, [String, Number]>();
  var page = 1;
  if (process.env.NODE_ENV === "development") {
    var devAnimeData = JSON.parse(readFileSync("animeData.json").toString());
    devAnimeData.map((anime: Anime) => {
      dates.set(
        anime.mal_id,
        convertToLocalTime(
          anime.broadcast.day,
          anime.broadcast.time,
          anime.broadcast.timezone
        )
      );
    });
    devAnimeData = devAnimeData.filter((anime: Anime) => anime.members > 15000);
    console.log("development data");
    return (
      <div className="">
        <AnimeCalendar animeData={devAnimeData} dates={dates} />
      </div>
    );
  }
  async function fetchSchedulesWithRetry(
    retries = 5
  ): Promise<JikanResponse<Anime[]> | undefined> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        var response = await jikanLimiter.schedule(() => {
          return Promise.resolve(
            jikanClient.schedules.getSchedules({
              kids: false,
              sfw: true,
              unapproved: false,
              page: page,
            })
          );
        });
        return response;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.warn(`Attempt ${attempt} failed. Retrying...`);
        await wait(1000);
      }
    }
  }

  var response = await fetchSchedulesWithRetry();

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
    response = await fetchSchedulesWithRetry();
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
  writeFileSync("animeData.json", JSON.stringify(animeData));
  writeFileSync("dates.json", JSON.stringify([dates]));

  animeData = animeData.filter((anime) => anime.members > 15000);
  return (
    <div className="">
      <AnimeCalendar animeData={animeData} dates={dates} />
    </div>
  );
};

export default WeeklyCalendar;
