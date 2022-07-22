import ytdl from 'ytdl-core';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url: { searchParams } }) => {
  const v = searchParams.get('v');

  if (!v) return { status: 400, body: 'Bad Request' };

  try {
    const info = await ytdl.getInfo(v);
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highest',
      filter: 'audioonly',
    });

    return {
      status: 200,
      body: {
        current: {
          title: info.videoDetails.title,
          videoUrl: info.videoDetails.video_url,
          thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
          channel: info.videoDetails.author.name,
          channelUrl: info.videoDetails.author.channel_url,
          audioSrcUrl: audioFormat.url,
        },
        next: {
          thumbnail:
            info.related_videos[0].thumbnails[info.related_videos[0].thumbnails.length - 1].url,
          videoUrl: 'https://www.youtube.com/watch?v=' + info.related_videos[0].id,
          title: info.related_videos[0].title,
          channel:
            typeof info.related_videos[0].author === 'string'
              ? info.related_videos[0].author
              : info.related_videos[0].author.name,
        },
      },
    };
  } catch (error) {
    return { status: 500, body: error.message };
  }
};
