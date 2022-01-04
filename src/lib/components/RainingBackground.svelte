<script context="module" lang="ts">
  const BACKGROUNDS = {
    // https://unsplash.com/photos/DpI-_wydgJM
    dawn: 'https://images.unsplash.com/photo-1490642914619-7955a3fd483c?force=true&w=640',
    // https://unsplash.com/photos/QmODrrfVxck
    early_morning: 'https://images.unsplash.com/photo-1587194175279-0a5b59df3bd9?force=true&w=640',
    // https://unsplash.com/photos/nuhDM28wCZk
    late_morning: 'https://images.unsplash.com/photo-1591899849654-ea61b4a49e12?force=true&w=640',
    // https://unsplash.com/photos/Oyuhv8rZa3U
    noon: 'https://images.unsplash.com/photo-1505401749795-de6c3476d4b0?force=true&w=640',
    // https://unsplash.com/photos/g8Sq1d9Lm98
    early_afternoon:
      'https://images.unsplash.com/photo-1515693516428-3c89b92d3220?force=true&w=640',
    // https://unsplash.com/photos/Pa3ntxg4Svw
    late_afternoon: 'https://images.unsplash.com/photo-1615879957134-582b24aa3059?force=true&w=640',
    // https://unsplash.com/photos/WsxKHqrdibY
    early_evening: 'https://images.unsplash.com/photo-1544111795-fe8b9def73f6?force=true&w=640',
    // https://unsplash.com/photos/JBkwaYMuhdc
    mid_evening: 'https://images.unsplash.com/photo-1544411047-c491e34a24e0?force=true&w=640',
    // https://unsplash.com/photos/Of2rc0KOfVU
    late_enening: 'https://images.unsplash.com/photo-1613487957484-32c977a8bd62?force=true&w=640',
    // https://unsplash.com/photos/oBUUbfmHKwM
    night: 'https://images.unsplash.com/photo-1506747111041-18b1844bf60f?force=true&w=640',
    // https://unsplash.com/photos/cXU6tNxhub0
    mid_night: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?force=true&w=640',
    // https://unsplash.com/photos/4u2U8EO9OzY
    after_mid_night:
      'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?force=true&w=640',
  };

  const getBg = (): string => { 
    const hour = new Date().getHours();
    if (hour === 5 || hour === 6) return BACKGROUNDS.dawn;
    else if (hour === 7 || hour === 8) return BACKGROUNDS.early_morning;
    else if (hour > 8 && hour < 12) return BACKGROUNDS.late_morning;
    else if (hour === 12) return BACKGROUNDS.noon;
    else if (hour > 12 && hour < 16) return BACKGROUNDS.early_afternoon;
    else if (hour === 16 || hour === 17) return BACKGROUNDS.late_afternoon;
    else if (hour === 18) return BACKGROUNDS.early_evening;
    else if (hour === 19) return BACKGROUNDS.mid_evening;
    else if (hour === 20) return BACKGROUNDS.late_enening;
    else if (hour > 20 && hour < 24) return BACKGROUNDS.night;
    else if (hour === 0) return BACKGROUNDS.mid_night;
    else return BACKGROUNDS.after_mid_night;
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let background: string = getBg();

  onMount(() => {
    // Set canvas size to fit the real size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // @ts-ignore: RaindropFx class from raindrop-fx script
    const raindropFx = new RaindropFX({ canvas, background });
    raindropFx.start();

    // Resize the effect renderer
    window.onresize = () => {
      const rect = canvas.getBoundingClientRect();
      raindropFx.resize(rect.width, rect.height);
    };

    const interval = setInterval(async () => {
      if (background !== getBg()) await raindropFx.setBackground(getBg());
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<canvas bind:this={canvas} class="fixed w-screen h-screen inset-0 select-none bg-black -z-10" />
