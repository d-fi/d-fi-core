## Tidal to Deezer

`d-fi-core` exports Tidal api to easily convert tracks, albums, artists and playlist to deezer via matching ISRC and UPC code.

## Usage

Here's a simple example. All method returns `Object` or throws `Error`. Make sure to catch error on your side.

```ts
import {tidal} from 'd-fi-core';

// Convert single track to deezer
const track = await tidal.track2deezer(song_id);
console.log(track);

// Convert album and tracks to deezer
const [album, tracks] = await tidal.album2deezer(album_id);
console.log(album);
console.log(tracks);

// Convert playlist and tracks to deezer
const [playlist, tracks] = await tidal.playlist2Deezer(playlist_id);
console.log(playlist);
console.log(tracks);

// Convert artist tracks to deezer (limited to 10 tracks)
const tracks = await tidal.artist2Deezer(artist_id);
console.log(tracks);
```

There are more methods available. Take a look at [`src/converter/tidal.ts`](https://github.com/d-fi/d-fi-core/blob/master/src/converter/tidal.ts) and [`__tests__/converter/tidal.ts`](https://github.com/d-fi/d-fi-core/blob/master/__tests__/converter/tidal.ts) to understand more.
