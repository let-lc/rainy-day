import axios, { AxiosResponse } from 'axios';

export const getAudio = (url: string): Promise<AxiosResponse<AudioResponse, unknown>> => {
  return axios.get<AudioResponse>('/api/audio', { params: { v: url } });
};

export const searchVideo = (
  keyword: string
): Promise<AxiosResponse<{ results: Array<SearchResult> }, unknown>> => {
  return axios.get<{ results: Array<SearchResult> }>('/api/search', { params: { q: keyword } });
};
