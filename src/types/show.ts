interface generesType {
  GENRE_ID: number; // 232;
  GENRE_NAME: string; // 'Technology';
}

export interface showEpisodeType {
  EPISODE_ID: string; // '294961882';
  EPISODE_STATUS: string; // '1';
  AVAILABLE: boolean;
  SHOW_ID: string; // '1235862';
  SHOW_NAME: string; // 'Masters of Scale with Reid Hoffman';
  SHOW_ART_MD5: string; // '52d6e09bccf1369d5758e7a45ee98b7e';
  SHOW_DESCRIPTION: string; // 'The best startup advice from Silicon Valley & beyond. Iconic CEOs — from Nike to Netflix, Starbucks to Slack — share the stories & strategies that helped them grow from startups into global brands.On each episode, host Reid Hoffman — LinkedIn cofounder, Greylock partner and legendary Silicon Valley investor — proves an unconventional theory about how businesses scale, while his guests share the story of how I built this company. Reid and guests talk entrepreneurship, leadership, strategy, management, fundraising. But they also talk about the human journey — with all its failures and setbacks. With original, cinematic music and hilariously honest stories, Masters of Scale is a business podcast that doesn’t sound like a business podcast. Guests on Masters of Scale have included the founders and CEOs of Netflix, Google, Facebook, Starbucks, Nike, Fiat, Spotify, Instagram, Airbnb, Uber, Paypal, Huffington Post, Twitter, Medium, Bumble, Yahoo, Slack, Spanx, Shake Shack, Dropbox, TaskRabbit, 23&Me, Mailchimp, Evite, Flickr, CharityWater, Endeavor, IAC and many more.';
  SHOW_IS_EXPLICIT: string; // '2';
  EPISODE_TITLE: string; // '87. Frustration is your friend, w/Houzz founder Adi Tatarko';
  EPISODE_DESCRIPTION: string; // "Frustration is an important signal: it indicates an opportunity, a problem to be solved. And if your solution also builds a community, you've unlocked a path to scale. Adi Tatarko founded the online home-design site Houzz with her husband as a hacked-together tool to find and share home design ideas, after their own home renovation turned into a frustrating time-waster. But by flipping frustration on its head, Houzz has grown into a bustling platform and marketplace with more than 40 million users, an essential (and delightful!) resource for homeowners, designers, architects, craftspeople. Learn how to identify frustration – and flip it. Special guests: Puzzle master Karen Kavett, Eventbrite cofounder Julia Hartz.";
  MD5_ORIGIN: string; // '';
  FILESIZE_MP3_32: string; // '0';
  FILESIZE_MP3_64: string; // '0';
  EPISODE_DIRECT_STREAM_URL: string; // 'https://chrt.fm/track/E341G/dts.podtrac.com/redirect.mp3/rss.art19.com/episodes/64115aa6-bbc1-4049-ba95-25fc89423c2a.mp3';
  SHOW_IS_DIRECT_STREAM: string; // '1';
  DURATION: string; // '2022';
  EPISODE_PUBLISHED_TIMESTAMP: string; // '2021-04-20 09:00:00';
  EPISODE_UPDATE_TIMESTAMP: string; // '2021-04-20 10:23:21';
  SHOW_IS_ADVERTISING_ALLOWED: string; // '1';
  SHOW_IS_DOWNLOAD_ALLOWED: string; // '1';
  TRACK_TOKEN: string; // 'AAAAAWB_DVFggCaRuFmnQCdtCBDT4qsvXkmIXNGbdgtfOekQu4TZccv8ha9pAwV0moJnJArr8sTr2jocnFSBNE7WWaMU';
  TRACK_TOKEN_EXPIRE: string; // 1619011217;
  __TYPE__: 'episode';
}

export interface showType {
  DATA: {
    AVAILABLE: boolean;
    SHOW_IS_EXPLICIT: string; // '2';
    LABEL_ID: string; // '35611';
    LABEL_NAME: string; // 'Art19';
    LANGUAGE_CD: string; // 'en';
    SHOW_IS_DIRECT_STREAM: string; // '1';
    SHOW_IS_ADVERTISING_ALLOWED: string; // '1';
    SHOW_IS_DOWNLOAD_ALLOWED: string; // '1';
    SHOW_EPISODE_DISPLAY_COUNT: string; // '0';
    SHOW_ID: string; // '1235862';
    SHOW_ART_MD5: string; // '52d6e09bccf1369d5758e7a45ee98b7e';
    SHOW_NAME: string; // 'Masters of Scale with Reid Hoffman';
    SHOW_DESCRIPTION: string; // 'The best startup advice from Silicon Valley & beyond. Iconic CEOs — from Nike to Netflix, Starbucks to Slack — share the stories & strategies that helped them grow from startups into global brands.On each episode, host Reid Hoffman — LinkedIn cofounder, Greylock partner and legendary Silicon Valley investor — proves an unconventional theory about how businesses scale, while his guests share the story of how I built this company. Reid and guests talk entrepreneurship, leadership, strategy, management, fundraising. But they also talk about the human journey — with all its failures and setbacks. With original, cinematic music and hilariously honest stories, Masters of Scale is a business podcast that doesn’t sound like a business podcast. Guests on Masters of Scale have included the founders and CEOs of Netflix, Google, Facebook, Starbucks, Nike, Fiat, Spotify, Instagram, Airbnb, Uber, Paypal, Huffington Post, Twitter, Medium, Bumble, Yahoo, Slack, Spanx, Shake Shack, Dropbox, TaskRabbit, 23&Me, Mailchimp, Evite, Flickr, CharityWater, Endeavor, IAC and many more.';
    SHOW_STATUS: string; // '1';
    SHOW_TYPE: string; // '0';
    GENRES: generesType[];
    NB_FAN: number; // 658;
    NB_RATE: number; // 0;
    RATING: string; // '0';
    __TYPE__: 'show';
  };
  FAVORITE_STATUS: boolean; // false;
  EPISODES: {
    data: showEpisodeType[];
    count: number; // 1;
    total: number; // 174;
    filtered_count: number; // 0;
  };
}
