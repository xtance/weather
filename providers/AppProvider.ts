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
		// App is ready
		const telegram = new Telegram();
	}

	public async shutdown() {
		console.log('done');
		// Cleanup, since app is going down
	}
}
