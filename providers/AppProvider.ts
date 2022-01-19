import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Telegram from 'App/Services/Telegram'

export default class AppProvider {
	constructor(protected app: ApplicationContract) {

	}

	public register() {
		// Register your own bindings
	}

	public async boot() {
		// IoC container is ready
	}

	public async ready() {
		/* Бот создаётся один раз вместе с приложением */
		const telegram = new Telegram();
		telegram.start();
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
