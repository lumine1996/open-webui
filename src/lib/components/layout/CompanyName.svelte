<script>
	import { COMPANY_NAME_ZEN, COMPANY_NAME_CHAN } from '$lib/stores';
	export let bottomValue;
	export let isVertical;
</script>

<div
	class="flex justify-center items-center w-full h-[40px] absolute bottom-[{bottomValue}px] left-0 z-10"
>
	<span><img class="w-[30px]" src="/static/splash.png" alt="" /></span>
	<span>{$COMPANY_NAME_CHAN}</span>
	{#if isVertical}
		<span>&nbsp;|&nbsp</span>
	{:else}
		<span class="w-6"></span>
	{/if}
	<span><img class="w-[40px] dark:invert" src="/static/logo.png" alt="" /></span>
	<span>{$COMPANY_NAME_ZEN}</span>
</div>

<style>
	/* your styles go here */
</style>
