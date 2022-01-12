<script>
	export let title;
	export let subtitle;
</script>

<!-- Логотип -->
<div class="
	p-8 text-center
	">
	<!-- 	<div
		class="py-16 bg-contain bg-no-repeat bg-center"
		style="background-image: url('./files/images/logos/{imageName}.png');"
	/> -->
	<p class="text-center py-8 stroke">
		<span class="text-2xl bold font-bold">{title}</span><br>
		<span>{subtitle}</span>
	</p>
</div>