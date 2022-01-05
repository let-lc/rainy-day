<script lang="ts">
  import type { AxiosError } from 'axios';

  import { searchVideo } from '$lib/api';
  import { fullScreen } from '$lib/stores';

  import Logo from './Logo.svelte';
  import PlayerControl from './PlayerControl.svelte';
  import PlayerFullscreen from './PlayerFullscreen.svelte';
  import ResultItem from './ResultItem.svelte';
  import ResultItemSkeleton from './ResultItem.skeleton.svelte';

  let searchStr: string = '';
  let loading: boolean = false;
  let results: Array<SearchResult> = [];

  const search = () => {
    if (!searchStr) return;
    loading = true;
    searchVideo(searchStr)
      .then((res) => {
        loading = false;
        results = res.data?.results || [];
      })
      .catch((err: AxiosError) => {
        loading = false;
        console.log(err.response.data || err.message);
      });
  };

  const searchOnEnter: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') search();
  };
</script>

<div class="flex flex-col w-screen h-screen">
  {#if $fullScreen}
    <PlayerFullscreen />
  {:else}
    <div class="flex flex-col items-center justify-center flex-grow py-4 gap-y-4">
      <div class="flex flex-col items-center w-full gap-y-4">
        <!-- Top Logo -->
        {#if !results.length && !loading}
          <Logo class="h-16 text-white/80" />
        {/if}
        <div class="flex items-center justify-center w-full max-w-7xl gap-x-4">
          <!-- Small Logo -->
          {#if results.length || loading}
            <Logo class="h-6 text-white/80" />
          {/if}
          <!-- Search Input -->
          <div
            class="w-full max-w-lg p-1 border rounded shadow-xl bg-white/10 backdrop-blur shadow-white/10 border-white/10"
          >
            <input
              type="search"
              bind:value={searchStr}
              on:keypress={searchOnEnter}
              placeholder="Search videos..."
              class="w-full px-3 py-1 text-sm text-white rounded-sm bg-white/25 focus:outline-none selection:bg-black/40 placeholder:text-gray-100"
            />
          </div>
          <!-- Search Button -->
          <button
            on:click={search}
            class="text-white/80 py-1.5 px-3 rounded-sm bg-white/25 hover:bg-white/40 active:bg-white/50 transition-colors duration-150"
          >
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {#if loading}
        <div class="flex-grow w-full h-0 max-w-5xl overflow-y-auto backdrop-blur bg-white/10">
          <div class="grid px-1 gap-y-2">
            {#each Array(10) as _, _i}
              <ResultItemSkeleton />
            {/each}
          </div>
        </div>
      {:else if results.length}
        <div class="flex-grow w-full h-0 max-w-5xl overflow-y-auto backdrop-blur-sm bg-white/10">
          <div class="grid px-1 gap-y-2">
            {#each results as result}
              <ResultItem {result} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
    <PlayerControl />
  {/if}
</div>
