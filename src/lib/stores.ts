import { writable } from 'svelte/store';

export const currentSong = writable({
  title: '',
  videoUrl: '',
  thumbnail: '',
  channel: '',
  channelUrl: '',
  audioSrcUrl: '',
});

export const nextSong = writable({
  title: '',
  videoUrl: '',
  thumbnail: '',
  channel: '',
});

export const playing = writable(false);
export const changeCurrentTime = writable(0);
export const currentTime = writable(0);
export const duration = writable(-1);
export const prevVolume = writable(0.5);
export const volume = writable(0.5);
export const loopOne = writable(false);
export const fullScreen = writable(false);
