<script lang="ts">
  import { formatTime, getPreviousVideoUrl, updatePlayHistory } from '$lib/utils';
  import {
    currentSong,
    changeCurrentTime,
    currentTime,
    duration,
    loopOne,
    playing,
    prevVolume,
    volume,
    fullScreen,
    nextSong,
  } from '$lib/stores';
  import { getAudio } from '$lib/api';

  // Prevent unnecessary transition when dragging the progress bar.
  let dragging: boolean = false;

  /**
   * Mute or set volume back to the previous volume.
   */
  const volIconClickHandler = () => {
    volume.update((v) => (v > 0 ? 0 : $prevVolume));
  };

  /**
   * Reserve the volume value when drag/change stop.
   *
   * @param e Volume range slider change event.
   */
  const setPrevVolHandler: svelte.JSX.FormEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.valueAsNumber > 0) prevVolume.set(e.currentTarget.valueAsNumber);
  };

  /**
   * Switch play/pause.
   */
  const playPauseHandler: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (e) => {
    playing.update((p) => !p);
    e.currentTarget.blur();
  };

  /**
   * Stop playing when progress bar start dragging.
   */
  const playHander = () => {
    dragging = true;
    playing.set(false);
  };

  /**
   * Update the `changeCurrentTime` store when finished dragging the progress bar.
   * @param e Input change event.
   */
  const changeCurrentTimeHandler: svelte.JSX.FormEventHandler<HTMLInputElement> = (e) => {
    changeCurrentTime.set(e.currentTarget.valueAsNumber);
  };

  /**
   * Start playing when finished dragging the progress bar.
   */
  const pauseHandler = () => {
    dragging = false;
    playing.set(true);
  };

  /**
   * Play previous video.
   */
  const playPrevHandler = () => {
    const prevUrl = getPreviousVideoUrl();
    if (prevUrl) {
      getAudio(prevUrl)
        .then(({ data }) => {
          currentSong.set({ ...data.current });
          nextSong.set({ ...data.next });
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  };

  /**
   * Play next video.
   */
  const playNextHandler = () => {
    if ($nextSong.videoUrl) {
      getAudio($nextSong.videoUrl)
        .then(({ data }) => {
          updatePlayHistory($currentSong);
          currentSong.set({ ...data.current });
          nextSong.set({ ...data.next });
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  };

  /**
   * Switch looping one or not.
   */
  const loopHandler = () => {
    loopOne.update((p) => !p);
  };
</script>

<div class="flex items-center justify-center w-screen h-screen p-4">
  <div
    class="relative flex flex-col justify-between w-full h-full max-w-5xl px-8 pt-16 pb-8 overflow-hidden rounded-md shadow-xl sm:justify-start sm:p-8 sm:h-auto bg-white/10 backdrop-blur shadow-white/5"
  >
    <button
      class="absolute transition-all duration-150 bg-white bg-opacity-0 rounded-bl-lg outline-none top-2 sm:top-0 right-2 sm:right-0 text-white/50 hover:text-white hover:bg-opacity-50"
      on:click={() => fullScreen.set(false)}
    >
      <!-- heroicons/solid: chevron-down -->
      <svg class="w-10 h-10 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      class="flex flex-col flex-grow space-x-0 sm:space-x-4 sm:flex-row sm:rounded-none sm:flex-grow-0"
    >
      <div
        class="relative aspect-square sm:aspect-auto transition-all duration-700 flex-shrink-0 w-full {$playing !==
        dragging
          ? 'sm:w-[19rem]'
          : 'sm:w-48'}"
      >
        <button
          class="relative z-10 w-full overflow-hidden shadow outline-none sm:w-48 aspect-square group transition-all h-max duration-300 {$playing
            ? 'sm:rounded-md rounded-[50%]'
            : 'rounded-md'}"
          on:click={playPauseHandler}
        >
          <div
            class="absolute inset-0 z-20 flex items-center justify-center transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            {#if $playing}
              <!-- Phosphor Icons: play-fill -->
              <svg
                class="w-24 h-24 text-white transition-opacity duration-200 opacity-0 sm:w-12 sm:h-12 group-hover:opacity-100"
                viewBox="0 0 256 256"
              >
                <path
                  d="M216 48v160a16 16 0 0 1-16 16h-36a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h36a16 16 0 0 1 16 16zM92 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h36a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                  fill="currentColor"
                />
              </svg>
            {:else}
              <!-- Phosphor Icons: pause-fill -->
              <svg
                class="w-24 h-24 text-white transition-opacity duration-200 opacity-0 sm:w-12 sm:h-12 group-hover:opacity-100"
                viewBox="0 0 256 256"
              >
                <path
                  d="M240 128a16.1 16.1 0 0 1-7.7 13.7l-144 87.9a15.5 15.5 0 0 1-16.1.3A15.8 15.8 0 0 1 64 216V40a15.8 15.8 0 0 1 8.2-13.9a15.5 15.5 0 0 1 16.1.3l144 87.9A16.1 16.1 0 0 1 240 128z"
                  fill="currentColor"
                />
              </svg>
            {/if}
          </div>
          <div class="absolute inset-0 overflow-hidden {$playing ? 'hidden sm:inline' : 'block'}">
            <img
              src="/texture.jpg"
              alt="Thumbnail"
              class="absolute inset-0 z-10 object-cover mix-blend-screen"
            />
            <img src={$currentSong.thumbnail} alt="Thumbnail" class="object-cover w-full h-full" />
          </div>
          <div
            class="bg-black/50 w-full h-full flex items-center justify-center {$playing
              ? 'block sm:hidden'
              : 'hidden'}"
          >
            <div
              class="flex items-center justify-center w-11/12 aspect-square rounded-[50%] bg-black/50"
            >
              <img
                src={$currentSong.thumbnail}
                alt="Thumbnail"
                class="relative object-cover w-2/5 h-2/5 ring-[2rem] ring-black/50 rounded-[50%] animate-spin-slow"
              />
            </div>
          </div>
        </button>
        <!-- Spinning Vinyl -->
        <div
          class="absolute top-2 left-2 transition-all duration-700 opacity-0 hidden sm:block {$playing !==
            dragging && 'translate-x-28 opacity-100'}"
        >
          <div
            class="flex items-center justify-center rounded-full w-44 h-44 bg-black/50 animate-spin"
          >
            <img
              src={$currentSong.thumbnail}
              alt="Thumbnail"
              class="relative object-cover w-12 h-12 rounded-full ring-8 ring-black/50"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-between flex-grow pt-12 sm:pt-0">
        <!-- Video Information -->
        <div class="grid py-0.5 text-white">
          <a
            class="text-base font-medium whitespace-normal sm:text-xl line-clamp-2 hover:underline"
            href={$currentSong.videoUrl}
            target="_blank"
            rel="noreferrer"
          >
            {$currentSong.title}
          </a>
          <a
            class="text-sm font-light truncate hover:underline sm:text-base"
            href={$currentSong.channelUrl}
            target="_blank"
            rel="noreferrer"
          >
            {$currentSong.channel}
          </a>
        </div>
        <!-- Prev/Next -->
        <div class="flex justify-between">
          <div class="flex items-center space-x-1">
            <button class="group" on:click={playPrevHandler}>
              <!-- Google Material Icons: round-skip-previous -->
              <svg
                class="w-16 h-16 text-white transition-opacity duration-150 sm:w-6 sm:h-6 group-hover:opacity-60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 0 0 0 1.64z"
                />
              </svg>
            </button>
            <button class="group" on:click={playNextHandler}>
              <!-- Google Material Icons: round-skip-next -->
              <svg
                class="w-16 h-16 text-white transition-opacity duration-150 sm:w-6 sm:h-6 group-hover:opacity-60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
                />
              </svg>
            </button>
            <button
              on:click={loopHandler}
              title={$loopOne ? 'Loop One' : 'Loop disabled'}
              class="ml-1 p-px rounded-full group flex items-center justify-center {$loopOne
                ? 'bg-white/90 shadow shadow-white/40'
                : 'bg-transparent'}"
            >
              <svg
                class="w-6 h-6 sm:w-4 sm:h-4 {$loopOne ? 'text-gray-700' : 'text-white/40'}"
                viewBox="0 0 16 16"
              >
                <g fill="currentColor">
                  <path
                    d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182a.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                  />
                </g>
              </svg>
            </button>
          </div>
          <!-- Volume Control -->
          <div class="flex items-center justify-end space-x-2 group">
            <input
              type="range"
              class="transition-opacity duration-300 opacity-0 volume group-hover:opacity-100"
              min={0}
              max={1}
              step={0.01}
              bind:value={$volume}
              on:change={setPrevVolHandler}
              style="background-size: {$volume * 100}%;"
            />
            <button class="text-white peer" on:click={volIconClickHandler}>
              {#if $volume > 0}
                <!-- herocions/solid: volume-up -->
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clip-rule="evenodd"
                  />
                </svg>
              {:else}
                <!-- herocions/solid: volume-off -->
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Progress Bar -->
    <div class="flex flex-col justify-between flex-grow-0 sm:flex-grow pt-4 sm:pb-0 pb-16 text-white">
      <div class="relative flex items-center space-x-0 sm:space-x-2">
        <span
          class="absolute left-0 text-xs select-none sm:relative sm:left-auto sm:top-auto top-2"
        >
          {formatTime($currentTime)}
        </span>
        <input
          bind:value={$currentTime}
          type="range"
          min={0}
          max={$duration}
          class="progressbar peer"
          style="background-size: {($currentTime / $duration) * 100}%;"
          on:mousedown={playHander}
          on:change={changeCurrentTimeHandler}
          on:mouseup={pauseHandler}
        />
        <span
          class="absolute right-0 text-xs select-none sm:relative sm:right-auto sm:top-auto top-2"
        >
          {formatTime($duration)}
        </span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .progressbar {
    @apply flex-grow w-full rounded h-1.5 focus:outline-none bg-white/30 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 bg-no-repeat appearance-none cursor-pointer z-10;

    &::-webkit-slider-thumb {
      @apply w-1.5 h-1.5 bg-white rounded-md shadow opacity-0 appearance-none shadow-white;
    }

    &::-moz-range-thumb {
      @apply w-3 h-3 bg-white border-none rounded-md shadow-sm opacity-0 appearance-none;
    }

    &:hover {
      &::-moz-range-thumb {
        @apply opacity-100;
      }

      &::-webkit-slider-thumb {
        @apply opacity-100;
      }
    }
  }

  .volume {
    @apply w-28 h-1 rounded bg-white/30 bg-gradient-to-r from-white/80 to-white/80 hover:from-white hover:to-white bg-no-repeat appearance-none cursor-pointer focus:outline-none;

    &::-webkit-slider-thumb {
      @apply w-3 h-3 bg-white rounded-md shadow-sm opacity-0 appearance-none;
    }

    &::-moz-range-thumb {
      @apply w-3 h-3 bg-white border-none rounded-md shadow-sm opacity-0 appearance-none;
    }

    &:hover {
      &::-moz-range-thumb {
        @apply opacity-100;
      }

      &::-webkit-slider-thumb {
        @apply opacity-100;
      }
    }
  }
</style>
