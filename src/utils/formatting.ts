export function capitalize(s: string | String) {
  "use client";
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
}

export function convertHtmlToPlainText(htmlString: string) {
  "use client";
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}
