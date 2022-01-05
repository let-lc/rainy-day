<script lang="ts">
  import { currentSong, nextSong } from '$lib/stores';
  import { getAudio } from '$lib/api';

  export let result: SearchResult;
  let loading: boolean = false;

  const loadAudio = () => {
    loading = true;
    getAudio(result?.url)
      .then(({ data }) => {
        currentSong.set({ ...data.current });
        nextSong.set({ ...data.next });
        loading = false;
      })
      .catch((err) => {
        loading = false;
      });
  };
</script>

<div
  class="flex p-1 text-white transition-colors duration-150 bg-white bg-opacity-0 rounded-sm gap-x-4 hover:bg-opacity-5"
>
  <button
    class="relative overflow-hidden border border-transparent rounded group hover:border-white/25"
    on:click={loadAudio}
  >
    <div
      class="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-150 bg-white bg-opacity-0 group-hover:bg-opacity-20"
    >
      {#if loading}
        <!-- EOS Icons: loading -->
        <svg class="w-12 h-12" viewBox="0 0 24 24">
          <path
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8z"
            opacity=".5"
            fill="currentColor"
          />
          <path d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8z" fill="currentColor">
            <animateTransform
              attributename="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatcount="indefinite"
            />
          </path>
        </svg>
      {:else}
        <!-- Phosphor Icons/fill: Play  -->
        <svg
          class="w-12 h-12 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
          viewBox="0 0 256 256"
        >
          <path
            d="M239.969 128a15.9 15.9 0 0 1-7.656 13.656l-143.97 87.985A15.998 15.998 0 0 1 64 215.992V40.008a15.998 15.998 0 0 1 24.344-13.649l143.969 87.985A15.9 15.9 0 0 1 239.969 128z"
            fill="currentColor"
          />
        </svg>
      {/if}
    </div>

    <img src={result.thumbnail} alt="Thumbnail" class="object-cover w-48 select-none h-28" />
  </button>
  <div class="flex flex-col justify-between">
    <div>
      <a href={result.url} rel="noreferrer" target="_blank" class="group">
        <h1 class="font-medium truncate whitespace-normal group-hover:underline">
          {result.title}
        </h1>
      </a>
      <a href={result.channelUrl} rel="noreferrer" target="_blank">
        <span class="text-sm hover:underline">{result.channel}</span>
      </a>
      <p class="text-xs pt-0.5">{result.views?.toLocaleString()} views</p>
    </div>
    {#if result.duration}
      <p class="px-1 py-px mb-1 text-xs rounded-sm bg-black/25 w-max">
        {result.duration}
      </p>
    {/if}
  </div>
</div>
