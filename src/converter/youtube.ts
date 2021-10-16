import axios from 'axios';
import {parse} from 'node-html-parser';
import {searchAlternative, searchMusic} from '../api';

const getTrack = async (id: string) => {
  const response = await axios.get<any>(`https://www.youtube.com/watch?v=${id}&hl=en`);
  const script = parse(response.data)
    .querySelectorAll('script')
    .find((script) => script.childNodes.find((node) => node.rawText.includes('responseText')));

  if (script) {
    const info = script.text.split('= ');
    info.shift();
    if (info) {
      let jsonData = info.join('= ').trim();
      if (jsonData.endsWith(';')) {
        jsonData = jsonData.slice(0, -1);
      }
      const json = JSON.parse(jsonData);

      try {
        const data =
          json.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer
            .metadataRowContainer.metadataRowContainerRenderer;
        if (data.rows && data.rows.length > 0) {
          const song = data.rows.find(
            (row: any) => row.metadataRowRenderer && row.metadataRowRenderer.title.simpleText === 'Song',
          );
          const artist = data.rows.find(
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
      } catch (err) {
        const title = (json.videoDetails.title as string)
          .toLowerCase()
          .replace(/\(Off.*\)/i, '')
          .replace(/ft.*/i, '')
          .replace(/[,-\.]/g, '')
          .replace(/  +/g, ' ')
          .trim();
        const {TRACK} = await searchMusic(title, ['TRACK'], 20);
        const data = TRACK.data.filter((track) => title.includes(track.ART_NAME.toLowerCase()));
        if (data[0]) {
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
