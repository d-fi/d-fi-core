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

// Init api with arl
await api.initDeezerApi(arl_from_cookie);

// GET Track Object
const track = await api.getTrackInfo(SNG_ID);

// Parse download URL for 128kbps
const url = getTrackDownloadUrl(track, 1);

// Download encrypted track
const {data} = await axios.get(url, {responseType: 'arraybuffer'});

// Decrypt track
const decryptedTrack = decryptDownload(data, track.SNG_ID);

// Add id3 metadata
const trackWithMetadata = await api.addTrackTags(decryptedTrack, track, false, 500);

// Save file to disk
fs.writeFileSync(track.SNG_TITLE + '.mp3', trackWithMetadata);
```

### [Read FAQ](https://github.com/d-fi/d-fi-core/blob/master/docs/README.md)

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

### Donations

If you want to show your appreciation, you can donate me on [ko-fi](https://ko-fi.com/Z8Z5KDA6) or [buy me a coffee](https://www.buymeacoffee.com/sayem). Thanks!

> Made with :heart: & :coffee: by Sayem
