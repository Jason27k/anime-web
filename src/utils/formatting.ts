export function capitalize(s: string | String) {
  "use client";
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
}