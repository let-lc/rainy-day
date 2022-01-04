<script lang="ts">
  import 'tailwindcss/tailwind.css';
  import { RainingBackground } from '$lib/components';
</script>

<main class="relative w-screen h-screen overflow-hidden">
  <slot />
</main>
<RainingBackground />

<style global lang="scss">
  a,
  button {
    @apply focus:outline-none;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: rgb(255, 255, 255) rgba(0, 0, 0, 0.375);
  }

  /* webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.375);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(255, 255, 255);
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgb(255, 255, 255, 0.75);
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: rgb(255, 255, 255, 0.5);
    background-clip: content-box;
  }
</style>
