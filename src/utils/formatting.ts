export function capitalize(s: string | String) {
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
}
