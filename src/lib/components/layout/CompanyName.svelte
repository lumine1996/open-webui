<script>
	import { COMPANY_NAME, PARTNERSHIP_NAME } from '$lib/stores';
	export let isVertical;
	export let classBottom;
</script>

<div
	class="flex justify-center items-center w-full h-[40px] absolute left-0 z-10 dark:text-gray-100 md:text-base text-xs {classBottom}"
>
	<span><img class="w-[30px]" src="/static/splash.png" alt="" /></span>
	<span>{$COMPANY_NAME}</span>
	{#if isVertical}
		<span>&nbsp;|&nbsp</span>
	{:else}
		<span class="w-6"></span>
	{/if}
	<span><img class="w-[40px] dark:invert" src="/static/partnership.png" alt="" /></span>
	<span>{$PARTNERSHIP_NAME}</span>
</div>

<style>
	/* your styles go here */
</style>
