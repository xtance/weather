import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';

interface IWeather {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	humidity: number;
	speed: number;
	deg: number;
	icon: string;
}

export default class ApiController {

	private static API = 'http://api.openweathermap.org/data/2.5/weather';
	private static TEST_WEATHER = false;
	private static TEST_DATA = {
		status: 200,
		data: {
			coord: { lon: -0.1257, lat: 51.5085 },
			weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
			base: 'stations',
			main: { temp: 7.82, feels_like: 6.6, temp_min: 5.73, temp_max: 10.31, pressure: 1041, humidity: 87 },
			visibility: 10000,
			wind: { speed: 2.06, deg: 250 },
			clouds: { all: 3 },
			dt: 1641995162,
			sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1641974505, sunset: 1642004119 },
			timezone: 0,
			id: 2643743,
			name: 'London',
			cod: 200
		}
	}

	/* Метод получения погоды по HTTP */
	public async getWeatherHTTP({ request, response }: HttpContextContract) {
		try {
			const city = this.getCity(request);
			const data = await this.getWeather(city);
			return response.status(200).json(data);
		}
		catch (e) {
			const error = e.toString();
			console.log('Ошибка', e, error);
			return response.status(500).json({ error });
		}
	}

	/* Общий метод получения объекта погоды */
	public async getWeather(city: string){
		const token = this.getToken();
		const data = await this.getRawWeather(city, token);
		const parsed = this.getParsedWeather(data);
		return parsed;
	}

	private getToken(): string {
		const token = Env.get('OWM_TOKEN');
		if (!token) throw new Error('Отсутствует токен');
		return token;
	}

	private getCity(request: RequestContract): string {
		const city = decodeURI(request.param('city'));
		if (!city) throw new Error('Отсутствует город');
		return city;
	}

	/* Возвращает объект погоды как из апи */
	private getRawWeather(city: string, token: string) {
		return ApiController.TEST_WEATHER ? ApiController.TEST_DATA : axios({
			method: 'GET',
			url: ApiController.API,
			params: {
				q: city,
				appid: token,
				units: 'metric',
			}
		});
	}

	/* Возвращает распарсенную погоду */
	private getParsedWeather(data: any) : IWeather {

		const obj = data.data;
		if (!obj) throw new Error('Отсутствует объект данных'); 

		const main = obj.main;
		if (!main) throw new Error('Отсутствует объект температуры');

		const wind = obj.wind;
		if (!wind) throw new Error('Отсутствует объект ветра');

		const icon = obj.weather[0]?.icon || '';

		return {
			temp: main.temp,
			feels_like: main.feels_like,
			temp_min: main.temp_min,
			temp_max: main.temp_max,
			pressure: main.pressure,
			humidity: main.humidity,
			speed: wind.speed,
			deg: wind.deg,
			icon: icon,
		}
	}
}
