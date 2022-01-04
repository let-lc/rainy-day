<script lang="ts">
  import { PlayerLayout } from '$lib/components';
  import {
    currentSong,
    changeCurrentTime,
    currentTime,
    duration,
    playing,
    volume,
  } from '$lib/stores';

  // Reference to the audio element.
  let aduioElement: HTMLAudioElement;

  $: setPlayingHandler($playing);
  $: setVolumeHandler($volume);
  $: setCurrentTimeHandler($changeCurrentTime);

  /**
   * Update current time state on time update of the audio element.
   *
   * @param e AudioEvent
   */
  const timeUpdateHandler: svelte.JSX.EventHandler<Event, HTMLAudioElement> = (e) => {
    if (!e.currentTarget.paused) currentTime.set(e.currentTarget.currentTime);
  };

  /**
   * Update duration when audio metadata is loaded.
   *
   * @param e AudioEvent
   */
  const loadMetadataHandler: svelte.JSX.EventHandler<Event, HTMLAudioElement> = (e) => {
    duration.set(e.currentTarget.duration);
    playing.set(true);
  };

  /**
   * Play/Pause handler.
   */
  const setPlayingHandler = (play: boolean) => {
    if (aduioElement) play ? aduioElement.play() : aduioElement.pause();
  };

  const setVolumeHandler = (vol: number) => {
    if (aduioElement) aduioElement.volume = vol;
  };

  const setCurrentTimeHandler = (newCurrentTime: number) => {
    if (aduioElement) aduioElement.currentTime = newCurrentTime;
  };
</script>

<svelte:head>
  <title>Rainy Day</title>
</svelte:head>

<audio
  autoplay={true}
  bind:this={aduioElement}
  src={$currentSong.audioSrcUrl}
  on:timeupdate={timeUpdateHandler}
  on:loadedmetadata={loadMetadataHandler}
/>
<PlayerLayout />
