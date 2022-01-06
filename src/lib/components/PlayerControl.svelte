<script lang="ts">
  import { slide } from 'svelte/transition';
  import { linear } from 'svelte/easing';

  import { getAudio } from '$lib/api';
  import { formatTime, getPreviousVideoUrl, updatePlayHistory } from '$lib/utils';
  import {
    currentSong,
    changeCurrentTime,
    currentTime,
    duration,
    loopOne,
    nextSong,
    playing,
    prevVolume,
    volume,
    fullScreen,
  } from '$lib/stores';

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
  const playPauseHandler = () => {
    playing.update((p) => !p);
  };

  /**
   * Stop playing when progress bar start dragging.
   */
  const playHander = () => {
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

  /**
   * Switch to fullscreen.
   */
  const fullscreenHandler = () => {
    fullScreen.set(true);
  };
</script>

{#if $currentSong.audioSrcUrl}
  <div
    class="grid -space-y-1.5 transition-all duration-1000"
    in:slide={{ duration: 300, easing: linear }}
  >
    <div class="relative z-10">
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
      {#if $duration >= 0}
        <div
          class="absolute w-full text-xs text-center text-white transition-opacity duration-150 opacity-0 -top-1 peer-hover:opacity-100"
        >
          <span class="px-1 py-px rounded select-none bg-black/75">
            {formatTime($currentTime)} / {formatTime($duration)}
          </span>
        </div>
      {/if}
    </div>
    <div class="grid w-full h-16 grid-cols-3 px-24 shadow bg-white/10 backdrop-blur shadow-white">
      <!-- Video Information -->
      <div class="relative flex items-center gap-x-4">
        <button
          class="relative flex-shrink-0 transition-shadow duration-150 shadow-xl group hover:shadow-white/100"
          on:click={fullscreenHandler}
        >
          <div
            class="absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-150 opacity-0 bg-white/10 group-hover:opacity-100"
          >
            <!-- heroicons/solid: chevron-right -->
            <svg class="w-8 h-8 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <img
            src={$currentSong.thumbnail}
            alt="Thumbnails"
            class="object-cover w-12 h-12 rounded select-none"
          />
        </button>
        <div class="grid h-11 py-0.5 text-white">
          <a
            class="font-medium truncate whitespace-nowrap hover:underline"
            href={$currentSong.videoUrl}
            target="_blank"
            rel="noreferrer"
          >
            {$currentSong.title}
          </a>
          <a
            class="text-xs hover:underline w-max"
            href={$currentSong.channelUrl}
            target="_blank"
            rel="noreferrer"
          >
            {$currentSong.channel}
          </a>
        </div>
      </div>
      <!-- Play/Pause, Prev/Next -->
      <div class="flex justify-center">
        <div class="flex items-center gap-x-2">
          <button class="group" on:click={playPrevHandler}>
            <!-- Google Material Icons: round-skip-previous -->
            <svg
              class="w-10 h-10 text-white transition-opacity duration-150 group-hover:opacity-60"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 0 0 0 1.64z"
              />
            </svg>
          </button>
          <button class="group" on:click={playPauseHandler}>
            {#if $playing}
              <!-- herocions/solid: pause -->
              <svg
                class="w-12 h-12 text-white transition-opacity duration-150 group-hover:opacity-60"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            {:else}
              <!-- herocions/solid: play -->
              <svg
                class="w-12 h-12 text-white transition-opacity duration-150 group-hover:opacity-60"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clip-rule="evenodd"
                />
              </svg>
            {/if}
          </button>
          <button class="group" on:click={playNextHandler}>
            <!-- Google Material Icons: round-skip-next -->
            <svg
              class="w-10 h-10 text-white transition-opacity duration-150 group-hover:opacity-60"
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
            class="p-px rounded-full group {$loopOne
              ? 'bg-white/90 shadow shadow-white/40'
              : 'bg-transparent'}"
          >
            <svg class="w-4 h-4 {$loopOne ? 'text-gray-700' : 'text-white/40'}" viewBox="0 0 16 16">
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
      </div>
      <!-- Volume Control -->
      <div class="flex items-center justify-end gap-x-2">
        <input
          type="range"
          class="volume"
          min={0}
          max={1}
          step={0.01}
          bind:value={$volume}
          on:change={setPrevVolHandler}
          style="background-size: {$volume * 100}%;"
        />
        <button class="text-white" on:click={volIconClickHandler}>
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
{/if}

<style lang="scss">
  .progressbar {
    @apply flex-grow w-full h-px focus:outline-none bg-white/30 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 bg-no-repeat appearance-none cursor-pointer z-10;

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
