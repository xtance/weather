type CommandFunction = (args: object|string) => Promise<string>|string;

export default class Command {

	static cache = {};
	name: string;
	desc: string;
	private params: object | null;
	private keys?: string[];
	fun: CommandFunction;

	constructor(name: string, params: object | null, fun: CommandFunction){
		this.name = name;
		this.params = params;
		this.fun = fun;
		this.desc = '(без описания)';
		if (params) this.keys = Object.keys(params);
		Command.cache[name] = this;
	}

	/* Устанавливает описание для команды */
	public setDesc(desc: string){
		this.desc = desc;
		return this;
	}

	/* Вернёт команду из кэша */
	public static getCommand(name: string) : Command {
		return Command.cache[name] || null;
	}

	/* Выполняет команду, возвращая промис со строкой */
	public static async execute(str: string) : Promise<string> {

		/* Парсинг пришедшей строки */
		const space = str.indexOf(' ');
		const first = (space === -1) ? str.slice(1) : str.slice(1, space);
		const rest = (space === -1) ? '' : str.slice(space, str.length);

		const cmd = Command.getCommand(first);
        if (!cmd) return Promise.resolve('Такая команда отсутствует');

		/* Если указан объект параметров, применим их к команде */
        if (cmd.params && cmd.keys){
    
            const args = this.split(rest);
            if (args.length !== cmd.keys.length) return Promise.resolve(`Ожидалось ${cmd.keys.length} параметров, пришло ${args.length}, параметры: ${cmd.keys}`);
    
            const args2 = {};
            Object.entries(cmd.params).forEach(([param, fun] : [string, Function], index) => args2[param] = fun(args[index]));
			return cmd.fun(args2);
        }

        /* Иначе передастся текст напрямую */
        return cmd.fun(rest);
	}

	/* Разбивает строку */
	private static split(str: string){
		const arr = str.match(/[^\s"]+|"[^"]+"/g); // магия!
		if (!arr) return [];
		let i = arr.length;
		while (i--) arr[i] = arr[i].replace(/"/g,"");
		return arr;
	}
}