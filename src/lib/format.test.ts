import { describe, expect, it } from "vitest";
import { averageScore, formatBrewTime, formatRatio } from "./format";

describe("formatBrewTime", () => {
	it("秒を「分:秒」にする", () => {
		expect(formatBrewTime(150)).toBe("2:30");
		expect(formatBrewTime(65)).toBe("1:05");
		expect(formatBrewTime(0)).toBe("0:00");
	});
});

describe("averageScore", () => {
	it("5項目の平均を小数1桁で返す", () => {
		expect(averageScore({ acidity: 4, bitterness: 2, sweetness: 3, body: 3, aftertaste: 4 })).toBe("3.2");
		expect(averageScore({ acidity: 5, bitterness: 5, sweetness: 5, body: 5, aftertaste: 5 })).toBe("5.0");
	});
});

describe("formatRatio", () => {
	it("豆の量と湯量の比率を返す", () => {
		expect(formatRatio(15, 240)).toBe("1:16");
		expect(formatRatio(15, 230)).toBe("1:15.3");
	});
});
