/// <reference types="@sveltejs/kit" />

interface SearchResult {
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
  channelUrl: string;
  duration: string;
  views: number;
}

interface CurrentSong {
  title: string;
  videoUrl: string;
  thumbnail: string;
  channel: string;
  channelUrl: string;
  audioSrcUrl: string;
}

interface NextSong {
  title: string;
  videoUrl: string;
  thumbnail: string;
  channel: string;
}

interface AudioResponse {
  current: CurrentSong;
  next: NextSong;
}
