const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "...",
  lt: "<",
  mdash: "—",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  rsquo: "'",
};

function decodeNumericEntity(value: string) {
  const isHex = value.toLowerCase().startsWith("#x");
  const raw = value.slice(isHex ? 2 : 1);
  const codePoint = Number.parseInt(raw, isHex ? 16 : 10);

  if (Number.isNaN(codePoint)) {
    return `&${value};`;
  }

  return String.fromCodePoint(codePoint);
}

export function decodeHtmlEntities(input: string | null | undefined) {
  if (!input) {
    return "";
  }

  return input.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g,
    (entity, token: string) => {
      if (token.startsWith("#")) {
        return decodeNumericEntity(token);
      }

      return namedEntities[token] ?? entity;
    },
  );
}

export function stripHtml(input: string | null | undefined) {
  if (!input) {
    return "";
  }

  return decodeHtmlEntities(input)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p\b[^>]*>/gi, "")
    .replace(/<li\b[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/?(div|section|article|ul|ol|h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function createSnippet(input: string | null | undefined, maxLength = 280) {
  const text = stripHtml(input).replace(/\s+/g, " ").trim();

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function extractFirstExternalUrl(input: string | null | undefined) {
  if (!input) {
    return null;
  }

  const hrefMatch = input.match(/href=["'](https?:\/\/[^"']+)["']/i);

  if (hrefMatch?.[1]) {
    return decodeHtmlEntities(hrefMatch[1]);
  }

  const urlMatch = input.match(/\bhttps?:\/\/[^\s<>"']+/i);

  if (!urlMatch?.[0]) {
    return null;
  }

  return decodeHtmlEntities(urlMatch[0]).replace(/[),.]+$/, "");
}

export function normalizeText(input: string | null | undefined) {
  return (input ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
