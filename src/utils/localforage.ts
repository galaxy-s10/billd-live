import localforage from 'localforage';

export const myLs = localforage.createInstance({
  driver: localforage.LOCALSTORAGE,
  name: 'billdlive',
});
