import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBrews } from "./useBrews";
import type { BrewInput } from "../types/brew";

const input: BrewInput = {
	beanName: "エチオピア",
	shop: "近所のロースター",
	roastLevel: "light",
	method: "handDrip",
	grindSize: "mediumFine",
	beanWeight: 15,
	waterAmount: 240,
	waterTemp: 92,
	brewTime: 150,
	taste: { acidity: 4, bitterness: 2, sweetness: 3, body: 3, aftertaste: 4 },
	memo: "",
};

const STORAGE_KEY = "brew-log:brews";

describe("useBrews", () => {
	it("追加した記録を localStorage に保存する", () => {
		const { result } = renderHook(() => useBrews());

		act(() => {
			result.current.addBrew(input);
		});

		expect(result.current.brews).toHaveLength(1);
		expect(result.current.brews[0].id).toEqual(expect.any(String));
		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")).toHaveLength(1);
	});

	it("保存した記録を、次に開いたときに読み込む", () => {
		const first = renderHook(() => useBrews());
		act(() => {
			first.result.current.addBrew(input);
		});

		const { result } = renderHook(() => useBrews());

		expect(result.current.brews[0].beanName).toBe("エチオピア");
	});

	it("編集で購入店を空にすると、古い値が残らない", () => {
		const { result } = renderHook(() => useBrews());
		let id = "";
		act(() => {
			id = result.current.addBrew(input).id;
		});
		const createdAt = result.current.brews[0].createdAt;

		// 購入店のキーが無い入力（任意項目を省略した形）で更新する
		const { shop: _omitted, ...inputWithoutShop } = input;
		void _omitted;
		act(() => {
			result.current.updateBrew(id, { ...inputWithoutShop, beanName: "ケニア" });
		});

		const updated = result.current.getBrew(id);
		expect(updated?.shop).toBeUndefined();
		expect(updated?.beanName).toBe("ケニア");
		// id と作成日時は変わらない
		expect(updated?.id).toBe(id);
		expect(updated?.createdAt).toBe(createdAt);
	});

	it("記録を削除する", () => {
		const { result } = renderHook(() => useBrews());
		let id = "";
		act(() => {
			id = result.current.addBrew(input).id;
		});

		act(() => {
			result.current.deleteBrew(id);
		});

		expect(result.current.brews).toHaveLength(0);
		expect(result.current.getBrew(id)).toBeUndefined();
	});

	it("保存データが壊れていても、空の一覧として読み込む", () => {
		localStorage.setItem(STORAGE_KEY, "{ broken");

		const { result } = renderHook(() => useBrews());

		expect(result.current.brews).toEqual([]);
	});
});
