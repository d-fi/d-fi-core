import axios from 'axios';

interface getUrlType {
  data: [
    {
      media: [
        {
          cipher: {
            type: 'BF_CBC_STRIPE';
          };
          exp: number;
          format: string;
          media_type: 'FULL';
          nbf: number;
          sources: [
            {
              provider: 'ec';
              url: string;
            },
            {
              provider: 'ak';
              url: string;
            },
          ];
        },
      ];
    },
  ];
}

let license_token: string | null = null;

const getLicenseToken = async (): Promise<string> => {
  const {data} = await axios.get('https://www.deezer.com/ajax/gw-light.php', {
    params: {
      method: 'deezer.getUserData',
      api_version: '1.0',
      api_token: '',
      cid: Math.floor(1e9 * Math.random()),
    },
  });
  license_token = data.results.USER.OPTIONS.license_token;
  return data.results.USER.OPTIONS.license_token;
};

export const getTrackUrlFromServer = async (track_token: string, format: string): Promise<getUrlType> => {
  const token = license_token ? license_token : await getLicenseToken();
  const {data} = await axios.post('https://media.deezer.com/v1/get_url', {
    license_token: token,
    media: [
      {
        type: 'FULL',
        formats: [{format, cipher: 'BF_CBC_STRIPE'}],
      },
    ],
    track_tokens: [track_token],
  });

  return data;
};
