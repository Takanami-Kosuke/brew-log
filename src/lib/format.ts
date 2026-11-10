import type { Taste } from "../types/brew";

// "2026-11-10T09:00:00.000Z" → "2026.11.10"
export function formatDate(iso: string): string {
	const date = new Date(iso);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
}

// 150 → "2:30"
export function formatBrewTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = String(seconds % 60).padStart(2, "0");
	return `${minutes}:${rest}`;
}

// 5項目の平均を小数1桁で返す（例: "4.0"）
export function averageScore(taste: Taste): string {
	const { acidity, bitterness, sweetness, body, aftertaste } = taste;
	const sum = acidity + bitterness + sweetness + body + aftertaste;
	return (sum / 5).toFixed(1);
}
