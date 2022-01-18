import Application from '@ioc:Adonis/Core/Application';
import Env from '@ioc:Adonis/Core/Env';
import fs from 'fs';

export default class Telegram {

	private static API = `https://api.telegram.org/bot${Env.get('TG_TOKEN')}/`;
	private static FOLDER = Application.makePath('telegram');
	private static FILE = '/update.txt';
	private static PREFIX = '[Telegram]';

	private lastUpdate: number;
	
	constructor(){
		this.createUpdateFile();
		this.lastUpdate = this.getLastUpdate();
		this.log('Последнее обновление:', this.lastUpdate);
	}


	private getLastUpdate() : number {
		const path = Telegram.FOLDER + Telegram.FILE;
		const buffer = fs.readFileSync(path);
		const update = buffer.toString();
		return parseInt(update);
	}

	private setLastUpdate(update: number){
		const path = Telegram.FOLDER + Telegram.FILE;
		fs.writeFileSync(path, String(update));
	}

	private createUpdateFile(){
		if (!fs.existsSync(Telegram.FOLDER + Telegram.FILE)) {
			fs.mkdirSync(Telegram.FOLDER, {
				recursive: true,
			});
		}
	}

	private log(...args: (string | number | object)[]){
		console.log(Telegram.PREFIX, ...args);
	}

}