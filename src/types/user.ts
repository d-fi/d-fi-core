export interface userType {
  USER_ID: string;
  EMAIL: string;
  FIRSTNAME: string;
  LASTNAME: string;
  BIRTHDAY: string;
  BLOG_NAME: string;
  SEX: string;
  ADDRESS?: string;
  CITY?: string;
  ZIP?: string;
  COUNTRY: string;
  LANG: string;
  PHONE?: string;
  __TYPE__: 'user';
}
