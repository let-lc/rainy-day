import type { RequestHandler } from '@sveltejs/kit';
import ytsr, { Video } from 'ytsr';

export const get: RequestHandler = async ({ url: { searchParams } }) => {
  const q = searchParams.get('q');

  if (!q) {
    return {
      status: 400,
      body: 'Search string is missing!',
    };
  }

  try {
    const results = await ytsr(q);

    return {
      body: {
        results: results.items
          .filter((item) => item.type === 'video' && !item?.isLive)
          .map((item: Video) => ({
            title: item.title,
            url: item.url,
            thumbnail: item.bestThumbnail.url,
            channel: item.author.name,
            channelUrl: item.author.url,
            duration: item.duration,
            views: item.views,
          })),
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: error.message,
    };
  }
};
