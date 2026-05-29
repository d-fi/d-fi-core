## Parse

Parse Deezer, Spotify, Tidal, and YouTube URLs to downloadable Deezer data.

Supported links include:

- Deezer track, album, artist, playlist, audiobook, and shared `link.deezer.com` URLs
- Spotify track, album, artist, playlist URLs, and `spotify:` URIs
- Tidal track, album, artist, and playlist URLs
- YouTube watch and short URLs

## Usage

`parseInfo` parses information as JSON data. It throws `Error`; make sure to catch errors on your side.

```ts
import {parseInfo} from 'd-fi-core';

// Get link information
const info = await parseInfo(url);
console.log(info);
```

Please take a look at [`src/converter/parse.ts`](https://github.com/d-fi/d-fi-core/blob/master/src/converter/parse.ts) and [`__tests__/converter/parse.ts`](https://github.com/d-fi/d-fi-core/blob/master/__tests__/converter/parse.ts) to understand more.
