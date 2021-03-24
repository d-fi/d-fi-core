## Spotify to Deezer

`d-fi-core` exports Spotify api to easily convert tracks, albums, artists and playlist to deezer via matching ISRC and UPC code.

## Usage

Here's a simple example. All method returns `Object` or throws `Error`. Make sure to catch error on your side.

```ts
import {spotify} from 'd-fi-core';

// Set token first to bypass some limits
await spotify.setSpotifyAnonymousToken();

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

Take a look at [`src/converter/spotify.ts`](https://github.com/d-fi/d-fi-core/blob/master/src/converter/spotify.ts) and [`__tests__/converter/spotify.ts`](https://github.com/d-fi/d-fi-core/blob/master/__tests__/converter/spotify.ts) to understand more.
