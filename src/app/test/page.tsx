// "use client";

// import { AnimeClient } from "@tutkli/jikan-ts";
// import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
// import { styled } from "@mui/system";

// const StyledCard = styled(Card)({
//   maxWidth: 600,
//   margin: "auto",
//   marginTop: 20,
//   padding: 20,
// });

// const StyledCardMedia = styled(CardMedia)({
//   height: 300,
// });

// const Test = async () => {
//   const animeClient = new AnimeClient();
//   const animeResponse = await animeClient.getAnimeById(57058);
//   const anime = animeResponse.data;

//   return (
//     <StyledCard>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <StyledCardMedia
//             image={anime.images.jpg.large_image_url}
//             title={anime.title}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <CardContent>
//             <Typography variant="h4" component="div">
//               {anime.title}
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary">
//               {anime.title_japanese}
//             </Typography>
//             <Typography variant="body1" color="text.primary">
//               {anime.synopsis}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Type: {anime.type}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Status: {anime.status}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Episodes: {anime.episodes}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Score: {anime.score}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Members: {anime.members}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Favorites: {anime.favorites}
//             </Typography>
//           </CardContent>
//         </Grid>
//       </Grid>
//     </StyledCard>
//   );
// };

// export default Test;

"use client";

import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: "auto",
  marginTop: 20,
  padding: 20,
});

const StyledCardMedia = styled(CardMedia)({
  height: 300,
});

const AnimeDetails: React.FC<{ anime: Anime }> = ({ anime }) => {
  return (
    <StyledCard>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <StyledCardMedia
            image={anime.images.jpg.large_image_url}
            title={anime.title}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4" component="div">
              {anime.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {anime.title_japanese}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {anime.synopsis}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {anime.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {anime.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Episodes: {anime.episodes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Score: {anime.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Members: {anime.members}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorites: {anime.favorites}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

import React from "react";
import { Anime } from "@tutkli/jikan-ts";

const sampleAnime: Anime = {
  mal_id: 1,
  url: "https://example.com",
  images: {
    jpg: {
      image_url: "https://example.com/image.jpg",
      large_image_url: "https://example.com/large_image.jpg",
    },
  },
  trailer: {
    youtube_id: "dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  approved: true,
  titles: [],
  title: "Sample Anime",
  title_english: "Sample Anime (English)",
  title_japanese: "サンプルアニメ",
  title_synonyms: [],
  type: "TV",
  source: "Original",
  episodes: 12,
  status: "Finished Airing",
  airing: false,
  aired: {
    from: new Date(),
    to: new Date(),
    prop: {
      from: { day: 1, month: 1, year: 2020 },
      to: { day: 1, month: 1, year: 2021 },
    },
  },
  duration: "24 min per ep",
  rating: "PG-13",
  score: 8.5,
  scored_by: 10000,
  rank: 1,
  popularity: 100,
  members: 100000,
  favorites: 10000,
  synopsis: "This is a sample anime synopsis.",
  background: "This is a sample background.",
  year: 2020,
  broadcast: {
    day: "Monday",
    time: "23:00",
    timezone: "JST",
    string: "Monday 23:00",
  },
  producers: [],
  licensors: [],
  studios: [],
  genres: [],
  explicit_genres: [],
  themes: [],
  demographics: [],
  relations: [],
  theme: {
    openings: [],
    endings: [],
  },
  external: [],
  streaming: [],
};

const App: React.FC = () => {
  return (
    <div>
      <AnimeDetails anime={sampleAnime} />
    </div>
  );
};

export default App;
