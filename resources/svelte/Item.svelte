<script>
	export let leftText;
	export let rightText;
	export let selected = false;
	export let line = true;
</script>

<div class="
	flex justify-between items-center
	py-2 px-2
	text-xl
	my-1
	light
	cursor-pointer
	border-y border-transparent
	bg-black/25
	{selected ? 'border-y-white/70' : ''}
	hover:bg-black/50  duration-100
" on:click>
	<div class="px-4 light whitespace-nowrap">{leftText}</div>
	{#if line}
		<div class="px-2 flex-grow border-b border-white/25" />
	{/if}
	<div class="px-4 flex justify-end items-center ">{rightText}<slot></slot></div>
</div>