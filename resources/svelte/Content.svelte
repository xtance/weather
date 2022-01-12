<script>
import Heading from "./Heading.svelte";
import Section from "./Section.svelte";

let currentCity = 'Москва';

</script>
<Section>
	<Heading text="Узнать погоду" />
	<p>
		Введите интересующий вас город и получите погоду.
	</p>

	<input class="
		w-full p-2 my-4
		border
	" placeholder="Например, СПб" bind:value={currentCity} />

	{#if currentCity}
		<div class="
			p-4 
			text-center  
			border shadow-lg
			bg-gray-700 text-white

		">
			Ну что там в городе <b>{currentCity}</b> ?
		</div>
	{/if}
</Section>