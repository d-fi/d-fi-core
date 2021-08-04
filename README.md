## d-fi-core [![Test](https://github.com/d-fi/d-fi-core/workflows/Test/badge.svg)](https://github.com/d-fi/d-fi-core/actions)

d-fi is a streaming music downloader. This core module is designed to be used on future version of d-fi.

## Installation

```bash
$ yarn add d-fi-core
```

## Usage

Here's a simple example to download tracks.

```ts
import axios from 'axios';
import fs from 'fs';
import * as api from 'd-fi-core';

// Init api with arl from cookie
await api.initDeezerApi(arl_cookie);

// Verify user
try {
  const user = await api.getUser();
  // Successfully logged in
  console.log('Logged in as ' + user.BLOG_NAME);
} catch (err) {
  // Invalid arl cookie set
  console.error(err.message);
}

// GET Track Object
const track = await api.getTrackInfo(song_id);

// Parse download URL for 128kbps
const trackData = await api.getTrackDownloadUrl(track, 1);

// Download track
const {data} = await axios.get(trackdata.trackUrl, {responseType: 'arraybuffer'});

// Decrypt track if needed
const outFile = trackData.isEncrypted ? api.decryptDownload(data, track.SNG_ID) : data;

// Add id3 metadata
const trackWithMetadata = await api.addTrackTags(outFile, track, 500);

// Save file to disk
fs.writeFileSync(track.SNG_TITLE + '.mp3', trackWithMetadata);
```

### [Read FAQ](https://github.com/d-fi/d-fi-core/blob/master/docs/faq.md)

## Methods

All method returns `Object` or throws `Error`. Make sure to catch error on your side.

### `.initDeezerApi(arl_cookie);`

> It is recommended that you first init the app with this method using your arl cookie.

| Parameters   | Required |     Type |
| ------------ | :------: | -------: |
| `arl_cookie` |   Yes    | `string` |

### `.getTrackInfo(track_id);`

| Parameters | Required |     Type |
| ---------- | :------: | -------: |
| `track_id` |   Yes    | `string` |

### `.getLyrics(track_id);`

| Parameters | Required |     Type |
| ---------- | :------: | -------: |
| `track_id` |   Yes    | `string` |

### `.getAlbumInfo(album_id);`

| Parameters | Required |     Type |
| ---------- | :------: | -------: |
| `album_id` |   Yes    | `string` |

### `.getAlbumTracks(album_id);`

| Parameters | Required |     Type |
| ---------- | :------: | -------: |
| `album_id` |   Yes    | `string` |

### `.getPlaylistInfo(playlist_id);`

| Parameters    | Required |     Type |
| ------------- | :------: | -------: |
| `playlist_id` |   Yes    | `string` |

### `.getPlaylistTracks(playlist_id);`

| Parameters    | Required |     Type |
| ------------- | :------: | -------: |
| `playlist_id` |   Yes    | `string` |

### `.getArtistInfo(artist_id);`

| Parameters  | Required |     Type |
| ----------- | :------: | -------: |
| `artist_id` |   Yes    | `string` |

### `.getDiscography(artist_id, limit);`

| Parameters  | Required |     Type | Default |             Description |
| ----------- | :------: | -------: | ------: | ----------------------: |
| `artist_id` |   Yes    | `string` |       - |               artist id |
| `limit`     |    No    | `number` |     500 | maximum tracks to fetch |

### `.getProfile(user_id);`

| Parameters | Required |     Type |
| ---------- | :------: | -------: |
| `user_id`  |   Yes    | `string` |

### `.searchAlternative(artist_name, song_name);`

| Parameters    | Required |     Type |
| ------------- | :------: | -------: |
| `artist_name` |   Yes    | `string` |
| `song_name`   |   Yes    | `string` |

### `.searchMusic(query, types, limit);`

| Parameters | Required |     Type |   Default |                     Description |
| ---------- | :------: | -------: | --------: | ------------------------------: |
| `query`    |   Yes    | `string` |         - |                    search query |
| `types`    |    No    |  `array` | ['TRACK'] |           array of search types |
| `limit`    |    No    | `number` |        15 | maximum item to fetch per types |

### `.getTrackDownloadUrl(track, quality);`

| Parameters | Required |        Type |                        Description |
| ---------- | :------: | ----------: | ---------------------------------: |
| `track`    |   Yes    |    `string` |                       track object |
| `quality`  |   Yes    | `1, 3 or 9` | 1 = 128kbps, 3 = 320kbps, 9 = flac |

### `.decryptDownload(data, song_id);`

| Parameters | Required |     Type |            Description |
| ---------- | :------: | -------: | ---------------------: |
| `data`     |   Yes    | `buffer` | downloaded song buffer |
| `song_id`  |   Yes    | `string` |               track id |

### `.addTrackTags(data, track,coverSize)`

| Parameters  | Required |      Type |            Description |
| ----------- | :------: | --------: | ---------------------: |
| `data`      |   Yes    |  `buffer` | downloaded song buffer |
| `track`     |   Yes    |  `string` |           track object |
| `coverSize` |    No    | `56-1800` |         cover art size |

### Donations

If you want to show your appreciation, you can donate me on [ko-fi](https://ko-fi.com/Z8Z5KDA6) or [buy me a coffee](https://www.buymeacoffee.com/sayem). Thanks!

> Made with :heart: & :coffee: by Sayem
