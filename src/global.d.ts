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
