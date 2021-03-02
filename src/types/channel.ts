interface picturesType {
  md5: string; // '8e211af480caea6fc4fa5378c1757e16'
  type: string; // 'misc'
}

interface dataType {
  type: string; // 'channel';
  id: string; // 'ff7f8b9a-2cff-48e4-9228-7d4136ce4aa8';
  name: string; // 'Asian music';
  title: string; // 'Asian music';
  logo: null | string;
  description: null | string;
  slug: string; // 'asian';
  background_color: string; // '#3ABEA7';
  pictures: picturesType[];
  __TYPE__: 'channel';
}

interface channelDataType {
  item_id: string; // 'item_type=channel,item_id=bab5f0dc-1eec-4ff8-a297-b23a10bd8d87,item_position=0'
  id: string; // 'bab5f0dc-1eec-4ff8-a297-b23a10bd8d87'
  type: string; // 'channel'
  data: dataType[];
  target: string; //'/channels/booklovers'
  title: string; // 'For book lovers';
  pictures: picturesType[];
  weight: number; // 1
  background_color: string; // '#FFAE2E'
}

export interface channelSearchType {
  data: channelDataType[];
  count: number;
  total: number;
}
