<script>
import Center from "./Center.svelte";
import Container from "./Container.svelte";
import Item from "./Item.svelte";
import List from "./List.svelte";
import Logo from "./Logo.svelte";
import Panel from "./Panel.svelte";
import SimpleButton from "./SimpleButton.svelte";

const API_URL = `${window.location.href}api`;
const CITIES = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Нижний Новгород', 'Самара', 'Омск', 'Казань', 'Челябинск', 'Ростов-на-Дону', 'Уфа', 'Волгоград', 'Красноярск', 'Воронеж', 'Пермь'];

let currentCity = null;
let weatherParams = null;
let weatherIcon = null;
let notification = 'Выберите город в панели слева, чтобы отобразить параметры';

const setNotification = (str) => {
	weatherParams = null;
	notification = str;
}

const setWeather = (obj) => {

	const main = obj.main;
	if (!main) return setNotification('Отсутствует объект температуры');

	const wind = obj.wind;
	if (!main) return setNotification('Отсутствует объект ветра');

	weatherIcon =  obj.weather[0]?.icon || '';

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

		if (!currentCity) {
			throw new Error('Вначале выберите город');
		}

		const response = await fetch(`${API_URL}/weather/${currentCity}`, { method: 'POST' });
		const json = await response.json();

		if (json.error) {
			throw new Error(json.error);
		}

		weatherParams = weatherIcon = null;
		setWeather(json);
	}
	catch (e) {
		setNotification(e.toString());
	}
}

</script>

<Container>

	<Panel>

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
			{#each CITIES as city, index}
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
		
	</Panel>


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

		<div class="flex justify-center">
			{#if weatherIcon}
				<img alt="Иконка" src="http://openweathermap.org/img/wn/{weatherIcon}@2x.png" />
			{/if}
		</div>

	</Panel>

</Container>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>