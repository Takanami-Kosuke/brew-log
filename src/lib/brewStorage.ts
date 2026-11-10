import type { Brew } from "../types/brew";

const STORAGE_KEY = "brew-log:brews";

export function loadBrews(): Brew[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === null) return [];

		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Brew[]) : [];
	} catch {
		return [];
	}
}

export function saveBrews(brews: Brew[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(brews));
	} catch (error) {
		console.error("記録を保存できませんでした", error);
	}
}
