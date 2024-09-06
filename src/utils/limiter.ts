import Bottleneck from "bottleneck";

export const jikanLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 450,
});
