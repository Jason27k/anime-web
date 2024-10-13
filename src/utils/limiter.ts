import { JikanResponse } from "@tutkli/jikan-ts";
import Bottleneck from "bottleneck";
import { AxiosError } from "axios";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const jikanLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 450,
});

export async function fetchDataWithRetry<T>(
  func: () => Promise<JikanResponse<T>>,
  retries = 5
): Promise<JikanResponse<T> | undefined> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      var response = await jikanLimiter.schedule(() => {
        console.log(`Attempt ${attempt}`);
        console.log(func);
        return Promise.resolve(func());
      });
      return response;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed. Retrying...`);
      await wait(1000 * attempt);
      if (
        attempt === retries &&
        (error as AxiosError).response?.status === 404
      ) {
        return undefined;
      }
    }
  }
}
