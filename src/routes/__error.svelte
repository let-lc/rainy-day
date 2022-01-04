<script context="module" lang="ts">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: { error, status }
		};
	};
</script>

<script lang="ts">
	export let error: Error;
	export let status: number;
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="text-center select-none">
		<h1 class="text-gray-100 text-9xl">{status}</h1>
		<h2 class="text-gray-200 text-lg font-bold">{error.message}</h2>
	</div>
</div>
