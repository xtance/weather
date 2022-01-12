<script>
import Center from "./Center.svelte";
import Container from "./Container.svelte";
import Item from "./Item.svelte";
import LeftPanel from "./Panel.svelte";
import List from "./List.svelte";
import Logo from "./Logo.svelte";
import Panel from "./Panel.svelte";
import SimpleButton from "./SimpleButton.svelte";

const endPoint = `${window.location.href}api`;
const cities = ['London', 'Moscow'];

let currentCity = null;
let weatherParams = null;
let notification = 'Выберите город в панели слева, чтобы отобразить параметры';

const setNotification = (str) => {
	weatherParams = null;
	notification = str;
}

const setWeather = (obj) => {

	weatherParams = null;

	const main = obj.main;
	if (!main) return setNotification('Отсутствует объект температуры');

	const wind = obj.wind;
	if (!main) return setNotification('Отсутствует объект ветра');

	weatherParams = {
		'Температура': `${main.temp} °C`,
		'Ощущается как': `${main.feels_like} °C`,
		'Минимум': `${main.temp_min} °C`,
		'Максимум': `${main.temp_max} °C`,
		'Давление': `${main.pressure} мм рт. ст.`,
		'Влажность': `${main.humidity} %`,
		'Скорость ветра': `${wind.speed} м/с`,
		'Направление ветра': `${wind.deg} °`,
	};
}

const setCity = (name) => {
	currentCity = name;
	setNotification('...');
}

const showWeather = async () => {
	try {
		if (!currentCity) throw('Вначале выберите город');
		const response = await fetch(`${endPoint}/weather/${currentCity}`, { method: 'POST' });
		const json = await response.json();
		if (json.error) throw(json.error);
		setWeather(json);
	}
	catch (e) {
		setNotification(e.toString());
	}
}

</script>

<Container>

	<LeftPanel>

		<Logo title="Прогноз погоды" subtitle={currentCity || "Выберите город"} />

		<List>
			<Item leftText="Поиск" rightText="" line={false}>
				<input
					bind:value={currentCity}
					class="
						w-9/12 flex-grow	
						bg-white/25
						px-2 rounded
						outline-none
					"
				/>
			</Item>
			{#each cities as city, index}
				<Item
					leftText={city}
					rightText={city === currentCity ? '✔' : '•'}
					selected={city === currentCity}
					on:click={() => setCity(city)}>
				</Item>
			{/each}
		</List>

		<div class="p-4">
			<SimpleButton text="Показать погоду" on:click={showWeather} />
		</div>
		
	</LeftPanel>


	<Panel>

		<Logo title="Информация" subtitle="Данные о погоде" />

		{#if weatherParams}
		<List>
			{#each Object.entries(weatherParams) as [name, value], index}
				<Item
					leftText={name}
					rightText={value}
				/>
			{/each}
		</List>
		{:else}
			<p class="text-center p-4">
				{notification}
			</p>
		{/if}

		<div class="p-4">
			
		</div>

	</Panel>

</Container>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>