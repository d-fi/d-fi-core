import axios from 'axios';
import {parse} from 'node-html-parser';
import {searchAlternative} from '../api';

const getTrack = async (id: string) => {
  const response = await axios.get(`https://www.youtube.com/watch?v=${id}&hl=en`);
  const script = parse(response.data)
    .querySelectorAll('script')
    .find((script) => script.childNodes.find((node) => node.rawText.includes('responseText')));

  if (script) {
    const info = script.text.split('= ');
    info.shift();
    if (info) {
      let json = info.join('= ').trim();
      if (json.endsWith(';')) {
        json = json.slice(0, -1);
      }

      const data = JSON.parse(json).contents.twoColumnWatchNextResults.results.results.contents[1]
        .videoSecondaryInfoRenderer.metadataRowContainer.metadataRowContainerRenderer;
      const song = data.rows?.find(
        (row: any) => row.metadataRowRenderer && row.metadataRowRenderer.title.simpleText === 'Song',
      );
      const artist = data.rows?.find(
        (row: any) => row.metadataRowRenderer && row.metadataRowRenderer.title.simpleText === 'Artist',
      );

      if (song && artist) {
        const {TRACK} = await searchAlternative(
          artist.metadataRowRenderer.contents[0].runs[0].text,
          song.metadataRowRenderer.contents[0].simpleText,
          1,
        );
        if (TRACK.data[0]) {
          return TRACK.data[0];
        }
      }
    }
  }
};

/**
 * Convert a youtube video to track by video id
 * @param {String} id - video id
 */
export const track2deezer = async (id: string) => {
  const track = await getTrack(id);
  if (track) {
    return track;
  }

  throw new Error('No track found for youtube video ' + id);
};
