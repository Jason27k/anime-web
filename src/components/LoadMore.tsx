// "use client";
// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import { fetchAnimeSearch } from "@/app/actions";
// import { Anime } from "@tutkli/jikan-ts";
// import React from "react";
// import AnimeDisplay from "./AnimeDisplay";

// interface LoadMoreProps {
//   display: number;
//   showDay: boolean;
// }

// const LoadMore = ({ display, showDay }: LoadMoreProps) => {

//   useEffect(() => {
//     async function fetchMore() {
//       const response = await fetchAnimeSearch();
//       if (response?.data) {
//         setAnimeData([...animeData, ...response.data]);
//       }
//     }
//     if (inView) {
//       console.log("fetching more data");
//       fetchMore();
//     }
//   }, [animeData, inView]);

//   return (
//     <div>
//       <AnimeDisplay animeData={animeData} display={display} showDay={showDay} />
//       <span ref={ref}></span>
//     </div>
//   );
// };

// export default LoadMore;
