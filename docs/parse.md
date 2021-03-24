## Parse

Parse Deezer, Spotify and Tidal URLs to downloadable data.

## Usage

`parseInfo` parses information as json data. Throws `Error`, make sure to catch error on your side.

```ts
import {parseInfo} from 'd-fi-core';

// Get link information
const info = await parseInfo(url);
console.log(info);
```

Please take a look at [`src/converter/parse.ts`](https://github.com/d-fi/d-fi-core/blob/master/src/converter/parse.ts) and [`__tests__/converter/parse.ts`](https://github.com/d-fi/d-fi-core/blob/master/__tests__/converter/parse.ts) to understand more.
