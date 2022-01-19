import Application from '@ioc:Adonis/Core/Application';
import Env from '@ioc:Adonis/Core/Env';

import axios from 'axios';
import fs from 'fs';

import Command from './Command';
import './Commands';

interface IChat {
	id: number,
}

interface IMessage {
	message_id: number,
	date: number,
	text: string,
	chat: IChat,
}

interface IUpdate {
	update_id: number,
	message: IMessage,
}

export default class Telegram {

	private static API = `https://api.telegram.org/bot${Env.get('TG_TOKEN')}/`;
	private static FOLDER = Application.makePath('telegram');
	private static FILE = '/offset.txt';
	private static LOG_PREFIX = '[Telegram]';
	private static CMD_PREFIX = '/';
	private static TIMEOUT_MS = 10000;
	private static MAX_DATE_MS = 5000;

	/* Значение оффсета хранится как в файле, так и в памяти, чтобы не считывать каждый раз */
	private offset: number;
	
	constructor(){
		this.createOffsetFile();
		this.offset = this.getLastOffset();
		this.log('Последнее обновление:', this.offset);
		this.getUpdates();
	}

	private async getUpdates(){
		const updates: IUpdate[] = await this.request('getUpdates', {
			offset: this.offset + 1,
			allowed_updates: 'message',
			timeout: Telegram.TIMEOUT_MS,
		});
		this.handleUpdates(updates);
		this.log('Обновления', updates);
	}

	private async handleUpdates(updates: IUpdate[]){
		if (!Array.isArray(updates)) throw Error('Фатальная ошибка - не пришли обновления.');
		updates.forEach(update => {
			if (update.update_id) this.offset = Math.max(this.offset, update.update_id);
			if (update.message) this.handleMessage(update.message);
		});
		this.setLastOffset(this.offset);
		this.getUpdates();
	}

	private async handleMessage(message: IMessage){

		const text = String(message.text);
		this.log('Пришло сообщение!', text);

		if (!this.isMessageRecent(message)) return;
		if (!text.startsWith(Telegram.CMD_PREFIX)) return;

		const answer = await Command.execute(text);
		this.sendMessage(answer, message.chat.id);
	}

	private sendMessage(text: string, chat_id: number){
		this.request('sendMessage', {
			chat_id,
			text,
			parse_mode: 'Markdown',
		});
	}

	private getLastOffset() : number {
		const path = Telegram.FOLDER + Telegram.FILE;
		const buffer = fs.readFileSync(path);
		const offset = buffer.toString();
		return Number(offset) || 0;
	}

	private isMessageRecent(message: IMessage){
		const seconds = message.date || 0;
		const ms = seconds * 1000;
		const now = +(new Date());
		return Math.abs(now - ms) < Telegram.MAX_DATE_MS;
	}

	private setLastOffset(offset: number){
		const path = Telegram.FOLDER + Telegram.FILE;
		fs.writeFileSync(path, String(offset));
	}

	private createOffsetFile(){
		const path = Telegram.FOLDER + Telegram.FILE;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(Telegram.FOLDER, {
				recursive: true,
			});
			fs.writeFileSync(path, '', {
				encoding: 'utf-8',
			});
		}
	}

	private log(...args: (string | number | object)[]){
		console.log(Telegram.LOG_PREFIX, ...args);
	}

	private async request(url: string, params: object = {}){
		let result: any;
		try {
			const response = await axios({
				method: 'GET',
				url: Telegram.API + url,
				params,
			});
			result = response?.data?.result;
		}
		catch(e){
			this.log(e);
		}
		return result;
	}
}

