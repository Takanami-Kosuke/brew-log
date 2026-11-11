import { describe, expect, it } from "vitest";
import { brewFormValuesFromSearchParams, brewSchema, emptyBrewFormValues, toBrewFormValues } from "./brewSchema";
import type { BrewFormValues } from "./brewSchema";
import type { Brew } from "../types/brew";

const validValues: BrewFormValues = {
	...emptyBrewFormValues,
	beanName: " エチオピア ",
	shop: "",
	beanWeight: "15",
	waterAmount: "240",
	waterTemp: "92",
	brewTime: "2:30",
};

describe("brewSchema", () => {
	it("入力値を保存用の形に変換する", () => {
		const result = brewSchema.parse(validValues);

		expect(result.beanName).toBe("エチオピア");
		expect(result.beanWeight).toBe(15);
		expect(result.brewTime).toBe(150);
		// 空の購入店は「なし」として扱う
		expect(result.shop).toBeUndefined();
	});

	it("全角の数字とコロンも受け付ける", () => {
		const result = brewSchema.parse({ ...validValues, beanWeight: "１５", brewTime: "２：３０" });

		expect(result.beanWeight).toBe(15);
		expect(result.brewTime).toBe(150);
	});

	it("必須項目が空ならエラーにする", () => {
		const result = brewSchema.safeParse({ ...validValues, beanName: "  ", beanWeight: "" });

		expect(result.success).toBe(false);
		const messages = result.error?.issues.map((issue) => issue.message);
		expect(messages).toContain("豆の名前を入力してください");
		expect(messages).toContain("豆の量を入力してください");
	});

	it.each([
		["waterTemp", "120", "湯温は50〜100の範囲で入力してください"],
		["beanWeight", "abc", "豆の量は数字で入力してください"],
		["brewTime", "150", "抽出時間は「2:30」の形で入力してください"],
		["brewTime", "2:75", "抽出時間は「2:30」の形で入力してください"],
		["brewTime", "0:00", "抽出時間は0:01以上で入力してください"],
	] as const)("%s が「%s」ならエラーにする", (field, value, message) => {
		const result = brewSchema.safeParse({ ...validValues, [field]: value });

		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe(message);
	});
});

describe("toBrewFormValues", () => {
	it("保存した記録を、フォームの値に戻せる", () => {
		const brew: Brew = {
			id: "1",
			createdAt: "2026-11-10T09:00:00.000Z",
			...brewSchema.parse({ ...validValues, shop: "近所のロースター" }),
		};

		const values = toBrewFormValues(brew);

		expect(values.shop).toBe("近所のロースター");
		expect(values.brewTime).toBe("2:30");
		expect(brewSchema.parse(values)).toEqual(brewSchema.parse({ ...validValues, shop: "近所のロースター" }));
	});
});

describe("brewFormValuesFromSearchParams", () => {
	it("タイマーから渡された値を初期値にする", () => {
		const params = new URLSearchParams("method=frenchPress&beanWeight=15&brewTime=163");
		const values = brewFormValuesFromSearchParams(params);

		expect(values.method).toBe("frenchPress");
		expect(values.beanWeight).toBe("15");
		expect(values.brewTime).toBe("2:43");
	});

	it("知らない値は無視する", () => {
		const params = new URLSearchParams("method=siphon&beanWeight=abc");
		const values = brewFormValuesFromSearchParams(params);

		expect(values.method).toBe(emptyBrewFormValues.method);
		expect(values.beanWeight).toBe("");
	});
});
