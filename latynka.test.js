const {Latynka} = require("./latynka.js");

const transcripter = new Latynka();

describe("cyrillic-latin transcription", () => {
	test("iotated after soft consonants", () => {
		const outputs = [
			"Лю", "ня", "сє"
		].map(phrase => transcripter.toLatin(phrase));
		const expectedOutputs = [
			"Ľu", "ńa", "śe"
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
	test("iotated after hard consonants", () => {
		const outputs = [
			"Бю", "кя", "гє"
		].map(phrase => transcripter.toLatin(phrase));
		const expectedOutputs = [
			"Biu", "kia", "gie"
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
	test("correctly transcripts control phrases", () => {
		const outputs = [
			"Лють і тютюнова нянька",
			"З'їш ще цих жовтих, чорних, білих яблук",
			"Вийшов на ґанок на світанку заспівати про панянку",
			"Ця версія української латинки довгий час вважалася власне за проєкт Йосефа Їречека. Саме як їречківка вона була подана у статті “Українська латинка” на Вікіпедії."
		].map(phrase => transcripter.toLatin(phrase));
		const expectedOutputs = [
			"Ľuť і ťuťunоva ńańka",
			"Zjiš šče cyh žоvtyh, čоrnyh, bіlyh jabluk",
			"Vyjšоv na ġanоk na svіtanku zaspіvaty prо pańanku",
			"Ća versіja ukrajinśkоji latynky dоvgyj čas vvažalaśa vlasne za prоjekt Jоsefa Jirečeka. Same jak jirečkіvka vоna bula pоdana u stattі “Ukrajinśka latynka” na Vіkіpedіji."
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
});
describe("latin-cyrillic transcription", () => {
	test("iotated after soft consonants", () => {
		const outputs = [
			"Ľu", "ńa", "śe"
		].map(phrase => transcripter.toCyrillic(phrase));
		const expectedOutputs = [
			"Лю", "ня", "сє"
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
	test("iotated after hard consonants", () => {
		const outputs = [
			"Biu", "kia", "gie"
		].map(phrase => transcripter.toCyrillic(phrase));
		const expectedOutputs = [
			"Бю", "кя", "гє"
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
	test("'Shch' letter", () => {
		expect(transcripter.toCyrillic("ššččš")).toBe("шщчш");
	});
	test("correctly transcripts control phrases", () => {
		const outputs = [
			"Ľuť і ťuťunоva ńańka",
			"Zjiš šče cyh žоvtyh, čоrnyh, bіlyh jabluk",
			"Vyjšоv na ġanоk na svіtanku zaspіvaty prо pańanku",
			"Ća versіja ukrajinśkоji latynky dоvgyj čas vvažalaśa vlasne za prоjekt Jоsefa Jirečeka. Same jak jirečkіvka vоna bula pоdana u stattі “Ukrajinśka latynka” na Vіkіpedіji."
		].map(phrase => transcripter.toCyrillic(phrase));
		const expectedOutputs = [
			"Лють і тютюнова нянька",
			"З'їш ще цих жовтих, чорних, білих яблук",
			"Вийшов на ґанок на світанку заспівати про панянку",
			"Ця версія української латинки довгий час вважалася власне за проєкт Йосефа Їречека. Саме як їречківка вона була подана у статті “Українська латинка” на Вікіпедії."
		];
		outputs.forEach((output, i) => {
			expect(output).toBe(expectedOutputs[i]);
		});
	});
});