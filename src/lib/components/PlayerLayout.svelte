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
        console.error(err.response.data || err.message);
      });
  };

  const searchOnEnter: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      search();
      // quit keyboard on mobile
      e.currentTarget.blur();
    }
  };
</script>

<div class="flex flex-col w-screen h-screen">
  {#if $fullScreen}
    <PlayerFullscreen />
  {:else}
    <div class="flex flex-col items-center justify-center flex-grow py-4 mx-4 space-y-4">
      <div class="flex flex-col items-center w-full">
        <!-- Top Logo -->
        {#if !results.length && !loading}
          <Logo class="h-16 mb-4 text-white/80" />
        {/if}
        <div class="flex items-center justify-center w-full space-x-4 max-w-7xl">
          <!-- Small Logo -->
          {#if results.length || loading}
            <Logo class="h-7 text-white/80" />
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
        <!-- Links -->
        {#if !results.length && !loading}
          <div class="fixed text-xs text-center bottom-2">
            <!-- svelte-ignore missing-declaration -->
            {#if typeof window !== 'undefined' && typeof CSS !== 'undefined' && !CSS.supports('backdrop-filter', 'blur(10px)')}
              <p class="text-white/75">⚠️ This browser doesn't support backdrop blur effect.</p>
            {/if}
            <p class="text-white/75">
              This project is for study purpose only. <a
                href="https://github.com/let-lc/rainy-day"
                target="_blank"
                rel="noreferrer"
                class="font-mono text-white/50 hover:text-white hover:underline"
              >
                {'<GitHub />'}
              </a>
            </p>
          </div>
        {/if}
      </div>
      {#if loading}
        <div
          class="relative flex-grow w-full max-w-5xl overflow-hidden rounded backdrop-blur bg-white/10"
        >
          <div class="absolute overflow-y-auto inset-2">
            <div class="grid gap-2 px-1 grid-cols-2 sm:grid-cols-1">
              {#each Array(10) as _, _i}
                <ResultItemSkeleton />
              {/each}
            </div>
          </div>
        </div>
      {:else if results.length}
        <div
          class="relative flex-grow w-full h-full max-w-5xl overflow-hidden rounded backdrop-blur bg-white/10"
        >
          <div class="absolute overflow-y-auto inset-2">
            <div class="grid px-1 gap-2 grid-cols-2 sm:grid-cols-1">
              {#each results as result}
                <ResultItem {result} />
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
    <PlayerControl />
  {/if}
</div>
