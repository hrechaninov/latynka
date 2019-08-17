class Latynka{
	constructor(){
		this._cyrillicToLatinRegExp = this.getCyrillicToLatinRegExp({
			alphabet: this.cyrillicAlphabet,
			map: this.cyrillicToLatinMap
		});
		this._latinToCyrillicReqExp = this.getLatinToCyrillicRegExp({
			alphabet: this.latinAlphabet,
			map: this.latinToCyrillicMap
		});
	}
	toLatin(str = ""){
		let latin = str;

		this._cyrillicToLatinRegExp.forEach(({exp, replaceWith}) => {
			latin = latin.replace(exp, replaceWith);
		});

		return latin;
	}
	toCyrillic(str = ""){
		let cyrillic = str;

		this._latinToCyrillicReqExp.forEach(({exp, replaceWith}) => {
			cyrillic = cyrillic.replace(exp, replaceWith);
		});

		return cyrillic;
	}
	getCyrillicToLatinRegExp({alphabet, map}){
		const hardConsonantIotatedChecks = [];
		const softConsonantIotatedChecks = [];
		const restLettersChecks = [];
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
	getLatinToCyrillicRegExp({alphabet, map}){
		const consonantIotatedChecks = [];
		const consonantSoftSignChecks = [];
		const softConsonantIotatedChecks = [];
		const softConsonantChecks = [];
		const specialChecks = [];
		const restLettersChecks = [];

		const consonants = [
			...alphabet.consonants.hard,
			...alphabet.consonants.soft
		];
		const iotatedRegular = alphabet.iotated.regular;
		const iotatedShort = alphabet.iotated.short;
		const iotated = [
			...iotatedRegular,
			...alphabet.iotated.soften,
			...iotatedShort
		];
		const softConsonants = alphabet.consonants.soft;
		const special = alphabet.special;
		const letters = [
			...consonants,
			...alphabet.vowels,
			...iotated
		];

		consonants.forEach(consonant => {
			const cyrillicConsonant = map.get(consonant) ? map.get(consonant).regular : consonant;
			const apostrophe = map.get("apostrophe").regular;
			const latinSoftSign = alphabet.softSign;
			const cyrillicSoftSign = map.get(alphabet.softSign).regular;

			iotatedRegular.forEach(iotated => {
				const cyrillicIotated = map.get(iotated) ? map.get(iotated).regular : iotated;
				const exp = new RegExp(`${consonant}${iotated}`, "g");
				const replaceWith = `${cyrillicConsonant}${apostrophe}${cyrillicIotated}`;

				consonantIotatedChecks.push({exp, replaceWith});
			});

			const exp = new RegExp(`${consonant}${latinSoftSign}`, "g");
			const replaceWith = `${cyrillicConsonant}${cyrillicSoftSign}`;

			consonantSoftSignChecks.push({exp, replaceWith});
		});

		softConsonants.forEach(consonant => {
			const cyrillicConsonant = map.get(consonant) ? map.get(consonant).regular : consonant;
			const cyrillicSoftSign = map.get(alphabet.softSign).regular;

			iotatedShort.forEach(iotated => {
				const cyrillicIotated = map.get(`j${iotated}`) ? map.get(`j${iotated}`).regular : iotated;
				const exp = new RegExp(`${consonant}${iotated}`, "g");
				const replaceWith = `${cyrillicConsonant}${cyrillicIotated}`;

				softConsonantIotatedChecks.push({exp, replaceWith});
			});

			const exp = new RegExp(consonant, "g");
			const replaceWith = `${cyrillicConsonant}${cyrillicSoftSign}`;

			softConsonantChecks.push({exp, replaceWith});
		});

		special.forEach(letter => {
			const cyrillicLetter = map.get(letter) ? map.get(letter).regular : letter;
			const exp = new RegExp(letter, "g");
			const replaceWith = cyrillicLetter;

			specialChecks.push({exp, replaceWith});
		});

		iotated.forEach(i => {
			const cyrillicLetter = map.get(i) ? map.get(i).regular : i;
			const exp = new RegExp(i, "g");
			const replaceWith = cyrillicLetter;

			specialChecks.push({exp, replaceWith});
		});

		letters.forEach(letter => {
			const cyrillicLetter = map.get(letter) ? map.get(letter).regular : letter;
			const exp = new RegExp(letter, "g");
			const replaceWith = cyrillicLetter;

			restLettersChecks.push({exp, replaceWith});
		});

		// order is important!
		return [
			...consonantIotatedChecks,
			...consonantSoftSignChecks,
			...softConsonantIotatedChecks,
			...softConsonantChecks,
			...specialChecks,
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
	get latinAlphabet(){
		const alphabet =  {
			vowels: [
				"\u0061",
				"\u0065",
				"\u0069",
				"\u006F",
				"\u0075",
				"\u0079",
				"\u0041",
				"\u0045",
				"\u0049",
				"\u004F",
				"\u0055",
				"\u0059"
			],
			consonants: {
				hard: [
					"\u0062",
					"\u0076",
					"\u0067",
					"\u0121",
					"\u017E",
					"\u006B",
					"\u006D",
					"\u0070",
					"\u0066",
					"\u0068",
					"\u010D",
					"\u0161",
					"\u006A",
					"\u0042",
					"\u0056",
					"\u0047",
					"\u0120",
					"\u017D",
					"\u004B",
					"\u004D",
					"\u0050",
					"\u0046",
					"\u0048",
					"\u010C",
					"\u0160",
					"\u004A",
					"\u0064",
					"\u007A",
					"\u006C",
					"\u006E",
					"\u0072",
					"\u0073",
					"\u0074",
					"\u0063",
					"\u0044",
					"\u005A",
					"\u004C",
					"\u004E",
					"\u0052",
					"\u0053",
					"\u0054",
					"\u0043"
				],
				soft: [
					"\u010F",
					"\u017A",
					"\u013E",
					"\u0144",
					"\u0155",
					"\u015B",
					"\u0165",
					"\u0107",
					"\u010E",
					"\u0179",
					"\u013D",
					"\u0143",
					"\u0154",
					"\u015A",
					"\u0164",
					"\u0106"
				]
			},
			special: [
				"\u0161\u010D",
				"\u0160\u010C"
			],
			iotated: {
				regular: [
					"\u006A\u0061",
					"\u006A\u0075",
					"\u006A\u0065",
					"\u006A\u0069",
					"\u004A\u0061",
					"\u004A\u0075",
					"\u004A\u0065",
					"\u004A\u0069"
				],
				soften: [
					"\u0069\u0061",
					"\u0069\u0075",
					"\u0069\u0065",
					"\u0049\u0061",
					"\u0049\u0075",
					"\u0049\u0065"
				],
				short: [
					"\u0061",
					"\u0075",
					"\u0065"
				]
			},
			softSign: "`"
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
		map.set("Щ", {regular: "\u0160\u010D"});
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
	get latinToCyrillicMap(){
		const map = new Map();
		map.set("\u0061", {regular: "а"});
		map.set("\u0062", {regular: "б"});
		map.set("\u0076", {regular: "в"});
		map.set("\u0067", {regular: "г"});
		map.set("\u0121", {regular: "ґ"});
		map.set("\u0065", {regular: "е"});
		map.set("\u017E", {regular: "ж"});
		map.set("\u0079", {regular: "и"});
		map.set("\u0069", {regular: "і"});
		map.set("\u006B", {regular: "к"});
		map.set("\u006D", {regular: "м"});
		map.set("\u006F", {regular: "о"});
		map.set("\u0070", {regular: "п"});
		map.set("\u0075", {regular: "у"});
		map.set("\u0066", {regular: "ф"});
		map.set("\u0068", {regular: "х"});
		map.set("\u010D", {regular: "ч"});
		map.set("\u0161", {regular: "ш"});
		map.set("\u006A", {regular: "й"});
		map.set("\u0064", {regular: "д"});
		map.set("\u007A", {regular: "з"});
		map.set("\u006C", {regular: "л"});
		map.set("\u006E", {regular: "н"});
		map.set("\u0072", {regular: "р"});
		map.set("\u0073", {regular: "с"});
		map.set("\u0074", {regular: "т"});
		map.set("\u0063", {regular: "ц"});
		map.set("\u010F", {regular: "д"});
		map.set("\u017A", {regular: "з"});
		map.set("\u013E", {regular: "л"});
		map.set("\u0144", {regular: "н"});
		map.set("\u0155", {regular: "р"});
		map.set("\u015B", {regular: "с"});
		map.set("\u0165", {regular: "т"});
		map.set("\u0107", {regular: "ц"});
		map.set("\u0161\u010D", {regular: "щ"});
		map.set("\u006A\u0061", {regular: "я"});
		map.set("\u0069\u0061", {regular: "я"});
		map.set("\u006A\u0075", {regular: "ю"});
		map.set("\u0069\u0075", {regular: "ю"});
		map.set("\u006A\u0065", {regular: "є"});
		map.set("\u0069\u0065", {regular: "є"});
		map.set("\u006A\u0069", {regular: "ї"});

		map.set("\u0041", {regular: "А"});
		map.set("\u0042", {regular: "Б"});
		map.set("\u0056", {regular: "В"});
		map.set("\u0047", {regular: "Г"});
		map.set("\u0120", {regular: "Ґ"});
		map.set("\u0045", {regular: "Е"});
		map.set("\u017D", {regular: "Ж"});
		map.set("\u0059", {regular: "И"});
		map.set("\u0049", {regular: "І"});
		map.set("\u004B", {regular: "К"});
		map.set("\u004D", {regular: "М"});
		map.set("\u004F", {regular: "О"});
		map.set("\u0050", {regular: "П"});
		map.set("\u0055", {regular: "У"});
		map.set("\u0046", {regular: "Ф"});
		map.set("\u0048", {regular: "Х"});
		map.set("\u010C", {regular: "Ч"});
		map.set("\u0160", {regular: "Ш"});
		map.set("\u004A", {regular: "Й"});
		map.set("\u0044", {regular: "Д"});
		map.set("\u005A", {regular: "З"});
		map.set("\u004C", {regular: "Л"});
		map.set("\u004E", {regular: "Н"});
		map.set("\u0052", {regular: "Р"});
		map.set("\u0053", {regular: "С"});
		map.set("\u0054", {regular: "Т"});
		map.set("\u0043", {regular: "Ц"});
		map.set("\u010E", {regular: "Д"});
		map.set("\u0179", {regular: "З"});
		map.set("\u013D", {regular: "Л"});
		map.set("\u0143", {regular: "Н"});
		map.set("\u0154", {regular: "Р"});
		map.set("\u015A", {regular: "С"});
		map.set("\u0164", {regular: "Т"});
		map.set("\u0106", {regular: "Ц"});
		map.set("\u0160\u010C", {regular: "Щ"});
		map.set("\u004A\u0061", {regular: "Я"});
		map.set("\u0049\u0061", {regular: "Я"});
		map.set("\u004A\u0075", {regular: "Ю"});
		map.set("\u0049\u0075", {regular: "Ю"});
		map.set("\u004A\u0065", {regular: "Є"});
		map.set("\u0049\u0065", {regular: "Є"});
		map.set("\u004A\u0069", {regular: "Ї"});
		map.set("`", {regular: "ь"});
		map.set("apostrophe", {regular: "'"});
		return map;
	}
}

module.exports = {Latynka};