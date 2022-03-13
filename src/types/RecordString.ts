// eslint-disable-next-line functional/prefer-readonly-type
export type RecordString<K extends string, V> = {
  [prop in K]: V;
};
