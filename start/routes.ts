import Route from '@ioc:Adonis/Core/Route';

Route.get('/', 'IndexController.show');
Route.post('/api/weather/:city', 'ApiController.getWeatherHTTP')