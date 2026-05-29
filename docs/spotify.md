## Spotify to Deezer

`d-fi-core` exports Spotify helpers to convert tracks, albums, artists, and playlists to Deezer.

Spotify conversion uses anonymous embed tokens internally. Tracks are matched to Deezer by ISRC first, then by metadata when
ISRC lookup is unavailable or stale. Albums are matched by UPC. Playlists use Spotify's public API first and fall back to
Spotify's web partner API when the public API is unavailable or rate-limited.

## Usage

Here's a simple example. All methods return `Object` or throw `Error`. Make sure to catch errors on your side.

```ts
import {spotify} from 'd-fi-core';

// Convert single track to deezer
const track = await spotify.track2deezer(song_id);
console.log(track);

// Convert album and tracks to deezer
const [album, tracks] = await spotify.album2deezer(album_id);
console.log(album);
console.log(tracks);

// Convert playlist and tracks to deezer
const [playlist, tracks] = await spotify.playlist2Deezer(playlist_id);
console.log(playlist);
console.log(tracks);

// Convert artist tracks to deezer (limited to 10 tracks)
const tracks = await spotify.artist2Deezer(artist_id);
console.log(tracks);
```

`setSpotifyAnonymousToken(resourceType, id)` is also exported for callers that want to explicitly warm or inspect the
anonymous Spotify token, but the conversion methods call it as needed.

Take a look at [`src/converter/spotify.ts`](https://github.com/d-fi/d-fi-core/blob/master/src/converter/spotify.ts) and [`__tests__/converter/spotify.ts`](https://github.com/d-fi/d-fi-core/blob/master/__tests__/converter/spotify.ts) to understand more.
