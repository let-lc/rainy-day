<script lang="ts">
  import { onMount } from 'svelte';

  import { getAudio } from '$lib/api';
  import { PlayerLayout } from '$lib/components';
  import { getPreviousVideoUrl, updatePlayHistory } from '$lib/utils';
  import {
    currentSong,
    changeCurrentTime,
    currentTime,
    duration,
    loopOne,
    playing,
    nextSong,
    volume,
  } from '$lib/stores';

  // Reference to the audio element.
  let aduioElement: HTMLAudioElement;

  $: setPlayingHandler($playing);
  $: setVolumeHandler($volume);
  $: setCurrentTimeHandler($changeCurrentTime);
  $: updateMediaSession($currentSong);

  onMount(() => {
    initVol();
    initMediaKeys();
  });

  /**
   * Set up media session handlers.
   */
  const initMediaKeys = () => {
    if (typeof navigator !== 'undefined' && navigator?.mediaSession) {
      navigator.mediaSession.setActionHandler('play', () => playing.set(true));
      navigator.mediaSession.setActionHandler('pause', () => playing.set(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => {
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
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
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
      });
    }
  };

  /**
   * Initialize volume state, sync from local stroage if exists, and subscribe
   * the volume state to local storage.
   */
  const initVol = () => {
    if (typeof localStorage !== 'undefined') {
      const vol = Number(localStorage.getItem('vol') ?? NaN);
      volume.set(!isNaN(vol) && vol <= 1 ? vol : 0.5);

      volume.subscribe((value) => {
        localStorage.vol = String(value);
      });
    }
  };

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
   * Play next suggest song when the song ends.
   */
  const audioEndHandler = () => {
    if (!$loopOne && $nextSong.videoUrl) {
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
   * Sync play/pause state to audio element.
   * @param play is playing state.
   */
  const setPlayingHandler = (play: boolean) => {
    if (aduioElement) play ? aduioElement.play() : aduioElement.pause();
  };

  /**
   * Sync volume state to audio elemment.
   * @param vol volume state.
   */
  const setVolumeHandler = (vol: number) => {
    if (aduioElement) aduioElement.volume = vol;
  };

  /**
   * Sync current time state to audio element.
   * @param newCurrentTime on changing current time state.
   */
  const setCurrentTimeHandler = (newCurrentTime: number) => {
    if (aduioElement) aduioElement.currentTime = newCurrentTime;
  };

  /**
   * Sync current song metadata to media session metadata.
   *
   * @param currentSong current song object.
   */
  const updateMediaSession = (currentSong: CurrentSong) => {
    if (typeof navigator !== 'undefined' && navigator?.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.channel,
        artwork: [{ src: currentSong.thumbnail }],
      });
    }
  };
</script>

<svelte:head>
  <title>Rainy Day</title>
</svelte:head>

<audio
  autoplay={true}
  loop={$loopOne}
  bind:this={aduioElement}
  src={$currentSong.audioSrcUrl}
  on:timeupdate={timeUpdateHandler}
  on:loadedmetadata={loadMetadataHandler}
  on:ended={audioEndHandler}
/>
<PlayerLayout />
