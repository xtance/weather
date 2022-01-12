import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';

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

	private async getWeatherData(city: string, token: string) {
		const response = await this.requestWeather(city, token);
		if (response.status !== 200) throw new Error(`Статус ${response.status}`);
		if (!response.data) throw new Error('Отсутствуют данные о погоде');
		return response.data;
	}

	private requestWeather(city: string, token: string) {
		if (ApiController.TEST_WEATHER) return ApiController.TEST_DATA;
		return axios({
			method: 'GET',
			url: ApiController.API,
			params: {
				q: city,
				appid: token,
				units: 'metric',
			}
		});
	}

	/* Метод получения погоды */
	public async weather({ request, response }: HttpContextContract) {
		try {
			const token = this.getToken();
			const city = this.getCity(request);
			const data = await this.getWeatherData(city, token);
			return response.status(200).json(data);
		}
		catch (e) {
			const error = e.toString();
			console.log('Ошибка', e, error);
			return response.status(500).json({ error });
		}
	}
}
