import { averageScore } from "./format";
import { ROAST_LEVELS } from "../types/brew";
import type { Brew, RoastLevel } from "../types/brew";

export const SORT_ORDERS = ["newest", "oldest", "rating"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export const SORT_ORDER_LABELS: Record<SortOrder, string> = {
	newest: "新しい順",
	oldest: "古い順",
	rating: "評価が高い順",
};

// URL の ?roast=… を読む。知らない値なら「すべて」(null) として扱う
export function parseRoast(value: string | null): RoastLevel | null {
	return ROAST_LEVELS.find((level) => level === value) ?? null;
}

// URL の ?sort=… を読む。知らない値なら「新しい順」
export function parseSort(value: string | null): SortOrder {
	return SORT_ORDERS.find((order) => order === value) ?? "newest";
}

// 絞り込んでから並び替える。元の配列は変更しない
export function filterAndSortBrews(brews: Brew[], roast: RoastLevel | null, sort: SortOrder): Brew[] {
	const filtered = roast ? brews.filter((brew) => brew.roastLevel === roast) : [...brews];

	return filtered.sort((a, b) => {
		if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
		if (sort === "rating") {
			const diff = Number(averageScore(b.taste)) - Number(averageScore(a.taste));
			// 評価が同じなら新しい順
			return diff !== 0 ? diff : b.createdAt.localeCompare(a.createdAt);
		}
		return b.createdAt.localeCompare(a.createdAt);
	});
}
