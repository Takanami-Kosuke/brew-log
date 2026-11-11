import { describe, expect, it } from "vitest";
import { filterAndSortBrews, parseRoast, parseSort } from "./brewList";
import type { Brew, Taste } from "../types/brew";

function makeBrew(id: string, createdAt: string, roastLevel: Brew["roastLevel"], score: Taste["acidity"]): Brew {
	return {
		id,
		createdAt,
		beanName: id,
		roastLevel,
		method: "handDrip",
		grindSize: "medium",
		beanWeight: 15,
		waterAmount: 240,
		waterTemp: 92,
		brewTime: 150,
		taste: { acidity: score, bitterness: score, sweetness: score, body: score, aftertaste: score },
		memo: "",
	};
}

const brews = [
	makeBrew("a", "2026-11-10T00:00:00.000Z", "light", 3),
	makeBrew("b", "2026-11-12T00:00:00.000Z", "dark", 2),
	makeBrew("c", "2026-11-11T00:00:00.000Z", "light", 5),
];

const ids = (list: Brew[]) => list.map((brew) => brew.id);

describe("filterAndSortBrews", () => {
	it("新しい順に並べる", () => {
		expect(ids(filterAndSortBrews(brews, null, "newest"))).toEqual(["b", "c", "a"]);
	});

	it("古い順に並べる", () => {
		expect(ids(filterAndSortBrews(brews, null, "oldest"))).toEqual(["a", "c", "b"]);
	});

	it("評価が高い順に並べる", () => {
		expect(ids(filterAndSortBrews(brews, null, "rating"))).toEqual(["c", "a", "b"]);
	});

	it("焙煎度で絞り込む", () => {
		expect(ids(filterAndSortBrews(brews, "light", "newest"))).toEqual(["c", "a"]);
	});

	it("元の配列の順番を変えない", () => {
		filterAndSortBrews(brews, null, "oldest");
		expect(ids(brews)).toEqual(["a", "b", "c"]);
	});
});

describe("URL の値の読み取り", () => {
	it("知らない値は初期値にする", () => {
		expect(parseRoast("bogus")).toBeNull();
		expect(parseRoast("dark")).toBe("dark");
		expect(parseSort(null)).toBe("newest");
		expect(parseSort("rating")).toBe("rating");
	});
});
