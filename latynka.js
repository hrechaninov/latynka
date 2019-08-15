class Latynka{
	constructor(){
		this._cyrillicAlphabet = this.cyrillicAlphabet;
		this._cyrillicToLatinMap = this.cyrillicToLatinMap;
		this._cyrillicToLatinRegExp = this.cyrillicToLatinRegExp;
	}
	toLatin(str = ""){
		let latin = str;

		this._cyrillicToLatinRegExp.forEach(({exp, replaceWith}) => {
			latin = latin.replace(exp, replaceWith);
		});

		return latin;
	}
	toCyrillic(str = ""){
		return str;
	}
	get cyrillicToLatinRegExp(){
		const hardConsonantIotatedChecks = [];
		const softConsonantIotatedChecks = [];
		const restLettersChecks = [];
		const map = this._cyrillicToLatinMap;
		const alphabet = this._cyrillicAlphabet;
		const consonants = alphabet.consonants;
		const iotatedLetters = alphabet.special.filter(letter => letter.softensPrev);
		const letters = [...alphabet.vowels, ...alphabet.consonants, ...alphabet.special];

		consonants.forEach(consonantObj => {
			iotatedLetters.forEach(iotatedObj => {
				const consonant = consonantObj.value;
				const iotated = iotatedObj.value;
				if(consonantObj.canBeSoft){
					const exp = new RegExp(`${consonant}${iotated}`, "g");
					const latinConsonant = map.get(consonant) ? map.get(consonant).soft : consonant;
					const latinIotated = map.get(iotated) ? map.get(iotated).short : iotated;
					const replaceWith = `${latinConsonant}${latinIotated}`;
					softConsonantIotatedChecks.push({exp, replaceWith});
				}
				else{
					const exp = new RegExp(`${consonant}${iotated}`, "g");
					const latinConsonant = map.get(consonant) ? map.get(consonant).regular : consonant;
					const latinIotated = map.get(iotated) ? map.get(iotated).soften : iotated;
					const replaceWith = `${latinConsonant}${latinIotated}`;
					hardConsonantIotatedChecks.push({exp, replaceWith});
				}
			});
		});
		letters.forEach(letterObj => {
			const letter = letterObj.value;
			const exp = new RegExp(letter, "g");
			const replaceWith = map.get(letter) ? map.get(letter).regular : letter;
			restLettersChecks.push({exp, replaceWith});
		});

		// order is important!
		return [
			...hardConsonantIotatedChecks,
			...softConsonantIotatedChecks,
			...restLettersChecks
		];
	}
	get cyrillicAlphabet(){
		const alphabet =  {
			vowels: [
				{value: "а"},
				{value: "е"},
				{value: "i"},
				{value: "o"},
				{value: "у"},
				{value: "и"},
				{value: "А"},
				{value: "Е"},
				{value: "І"},
				{value: "О"},
				{value: "У"},
				{value: "И"}
			],
			consonants: [
				{value: "б", canBeSoft: false},
				{value: "в", canBeSoft: false},
				{value: "г", canBeSoft: false},
				{value: "ґ", canBeSoft: false},
				{value: "д", canBeSoft: true},
				{value: "ж", canBeSoft: false},
				{value: "з", canBeSoft: true},
				{value: "й", canBeSoft: true},
				{value: "к", canBeSoft: false},
				{value: "л", canBeSoft: true},
				{value: "м", canBeSoft: false},
				{value: "н", canBeSoft: true},
				{value: "п", canBeSoft: false},
				{value: "р", canBeSoft: true},
				{value: "с", canBeSoft: true},
				{value: "т", canBeSoft: true},
				{value: "ф", canBeSoft: false},
				{value: "х", canBeSoft: false},
				{value: "ц", canBeSoft: true},
				{value: "ч", canBeSoft: false},
				{value: "ш", canBeSoft: false},
				{value: "щ", canBeSoft: false},
				{value: "Б", canBeSoft: false},
				{value: "В", canBeSoft: false},
				{value: "Г", canBeSoft: false},
				{value: "Ґ", canBeSoft: false},
				{value: "Д", canBeSoft: true},
				{value: "Ж", canBeSoft: false},
				{value: "З", canBeSoft: true},
				{value: "Й", canBeSoft: true},
				{value: "К", canBeSoft: false},
				{value: "Л", canBeSoft: true},
				{value: "М", canBeSoft: false},
				{value: "Н", canBeSoft: true},
				{value: "П", canBeSoft: false},
				{value: "Р", canBeSoft: true},
				{value: "С", canBeSoft: true},
				{value: "Т", canBeSoft: true},
				{value: "Ф", canBeSoft: false},
				{value: "Х", canBeSoft: false},
				{value: "Ц", canBeSoft: true},
				{value: "Ч", canBeSoft: false},
				{value: "Ш", canBeSoft: false},
				{value: "Щ", canBeSoft: false}
			],
			special: [
				{value: "я", softensPrev: true},
				{value: "ю", softensPrev: true},
				{value: "є", softensPrev: true},
				{value: "ї", softensPrev: false},
				{value: "ь", softensPrev: true},
				{value: "'", softensPrev: false},
				{value: "`", softensPrev: false},
				{value: "Я", softensPrev: true},
				{value: "Ю", softensPrev: true},
				{value: "Є", softensPrev: true},
				{value: "Ї", softensPrev: false},
				{value: "Ь", softensPrev: true}
			]
		};
		return alphabet;
	}
	get cyrillicToLatinMap(){
		const map = new Map();
		map.set("а", {regular: "\u0061"});
		map.set("б", {regular: "\u0062"});
		map.set("в", {regular: "\u0076"});
		map.set("г", {regular: "\u0067"});
		map.set("ґ", {regular: "\u0121"});
		map.set("е", {regular: "\u0065"});
		map.set("ж", {regular: "\u017E"});
		map.set("и", {regular: "\u0079"});
		map.set("і", {regular: "\u0069"});
		map.set("к", {regular: "\u006B"});
		map.set("м", {regular: "\u006D"});
		map.set("о", {regular: "\u006F"});
		map.set("п", {regular: "\u0070"});
		map.set("у", {regular: "\u0075"});
		map.set("ф", {regular: "\u0066"});
		map.set("х", {regular: "\u0068"});
		map.set("ч", {regular: "\u010D"});
		map.set("ш", {regular: "\u0161"});
		map.set("щ", {regular: "\u0161\u010D"});
		map.set("й", {regular: "\u006A", soft: "\u006A"});
		map.set("д", {regular: "\u0064", soft: "\u010F"});
		map.set("з", {regular: "\u007A", soft: "\u017A"});
		map.set("л", {regular: "\u006C", soft: "\u013E"});
		map.set("н", {regular: "\u006E", soft: "\u0144"});
		map.set("р", {regular: "\u0072", soft: "\u0155"});
		map.set("с", {regular: "\u0073", soft: "\u015B"});
		map.set("т", {regular: "\u0074", soft: "\u0165"});
		map.set("ц", {regular: "\u0063", soft: "\u0107"});
		map.set("я", {regular: "\u006A\u0061", soften: "\u0069\u0061", short: "\u0061"});
		map.set("ю", {regular: "\u006A\u0075", soften: "\u0069\u0075", short: "\u0075"});
		map.set("є", {regular: "\u006A\u0065", soften: "\u0069\u0065", short: "\u0065"});
		map.set("ь", {regular: "", soften: "`", short: ""});
		map.set("ї", {regular: "\u006A\u0069"});
		map.set("'", {regular: ""});
		map.set("`", {regular: ""});

		map.set("А", {regular: "\u0041"});
		map.set("Б", {regular: "\u0042"});
		map.set("В", {regular: "\u0056"});
		map.set("Г", {regular: "\u0047"});
		map.set("Ґ", {regular: "\u0120"});
		map.set("Е", {regular: "\u0045"});
		map.set("Ж", {regular: "\u017D"});
		map.set("И", {regular: "\u0059"});
		map.set("І", {regular: "\u0049"});
		map.set("К", {regular: "\u004B"});
		map.set("М", {regular: "\u004D"});
		map.set("О", {regular: "\u004F"});
		map.set("П", {regular: "\u0050"});
		map.set("У", {regular: "\u0055"});
		map.set("Ф", {regular: "\u0046"});
		map.set("Х", {regular: "\u0048"});
		map.set("Ч", {regular: "\u010C"});
		map.set("Ш", {regular: "\u0160"});
		map.set("Щ", {regular: "\u0160\u010C"});
		map.set("Й", {regular: "\u004A", soft: "\u004A"});
		map.set("Д", {regular: "\u0044", soft: "\u010E"});
		map.set("З", {regular: "\u005A", soft: "\u0179"});
		map.set("Л", {regular: "\u004C", soft: "\u013D"});
		map.set("Н", {regular: "\u004E", soft: "\u0143"});
		map.set("Р", {regular: "\u0052", soft: "\u0154"});
		map.set("С", {regular: "\u0053", soft: "\u015A"});
		map.set("Т", {regular: "\u0054", soft: "\u0164"});
		map.set("Ц", {regular: "\u0043", soft: "\u0106"});
		map.set("Я", {regular: "\u004A\u0061", soften: "\u0049\u0061", short: "\u0061"});
		map.set("Ю", {regular: "\u004A\u0075", soften: "\u0049\u0075", short: "\u0075"});
		map.set("Є", {regular: "\u004A\u0065", soften: "\u0049\u0065", short: "\u0065"});
		map.set("Ь", {regular: "", soften: "`", short: ""});
		map.set("Ї", {regular: "\u004A\u0069"});
		return map;
	}
}

module.exports = {Latynka};