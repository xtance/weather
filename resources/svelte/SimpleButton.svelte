<script>
	export let text;
	export let cls = '';
</script>

<div class="
	flex-grow p-4
	bg-black/25 text-white border-black/50 border
	hover:bg-black/50 hover:text-white hover:border-transparent duration-100
	text-center cursor-pointer
	{cls}
" on:click>
	{text}
</div>