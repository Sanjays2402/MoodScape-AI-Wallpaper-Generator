const SPOTIFY_HOSTS = new Set(["open.spotify.com", "play.spotify.com"]);
const SPOTIFY_TYPES = new Set([
  "track",
  "album",
  "playlist",
  "artist",
  "episode",
  "show",
]);

export type SpotifyLinkInfo = {
  url: string;
  type: string;
  id: string;
};

function humanizeType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function parseSpotifyUrl(input: string): SpotifyLinkInfo | null {
  try {
    const candidate = new URL(input.trim());

    if (!SPOTIFY_HOSTS.has(candidate.hostname)) {
      return null;
    }

    const parts = candidate.pathname.split("/").filter(Boolean);

    while (parts[0] && (["embed", "intl-en", "intl-fr", "intl-de", "intl-es"].includes(parts[0]) || parts[0].startsWith("intl-"))) {
      parts.shift();
    }

    const [type, id] = parts;

    if (!type || !id || !SPOTIFY_TYPES.has(type)) {
      return null;
    }

    return {
      url: `https://open.spotify.com/${type}/${id}`,
      type,
      id,
    };
  } catch {
    return null;
  }
}

export async function resolveSpotifyReference(input?: string) {
  const trimmed = input?.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = parseSpotifyUrl(trimmed);

  if (!parsed) {
    return trimmed;
  }

  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.url)}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (response.ok) {
      const data = (await response.json()) as {
        title?: string;
        author_name?: string;
      };

      const label = [data.title, data.author_name].filter(Boolean).join(" — ");

      if (label) {
        return `${label} (Spotify ${humanizeType(parsed.type)})`;
      }
    }
  } catch {
    // Ignore lookup failures and fall back to parsed URL context.
  }

  return `Spotify ${humanizeType(parsed.type)} ${parsed.id.slice(0, 8)}`;
}