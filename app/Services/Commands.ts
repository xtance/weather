import ApiController from 'App/Controllers/Http/ApiController';
import Command from './Command';

(new Command('start', null, () => {
	return 'Привет. \nЯ умею показывать погоду. \nЧтобы увидеть все команды бота, напиши */help*';
}))
.setDesc('Показать приветствие');


(new Command('help', null, () => {
	
	const values = Object.values(Command.cache);
	let answer = `Вижу *${values.length}* команд! Список: \n\n`;

	values.forEach((cmd: Command) => {
		answer += `/${cmd.name}: *${cmd.desc} *\n`;
	});
	
	return answer;
}))
.setDesc('Список команд');

(new Command('city', { city: String }, async ({ city }: any) => {

	const controller = new ApiController();
	const weather = await controller.getWeather(city);

	let answer = `*Погода в городе ${city}: *\n\n`;
	answer +=	`Температура: *${weather.temp} °C *\n`;
	answer +=	`Ощущается как: *${weather.feels_like} °C *\n`;
	answer +=	`Минимум: *${weather.temp_min} °C *\n`;
	answer +=	`Максимум: *${weather.temp_max} °C *\n`;
	answer +=	`Давление: *${weather.pressure} мм рт. ст. *\n`;
	answer +=	`Влажность: *${weather.humidity} % *\n`;
	answer +=	`Скорость ветра: *${weather.speed} м/с *\n`;
	answer +=	`Направление ветра: *${weather.deg} ° *\n`;

	return answer;
}))
.setDesc('Погода в городе');