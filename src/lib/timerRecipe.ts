import type { BrewMethod } from "../types/brew";

export type TimerStep = {
	name: string;
	instruction: string;
	startAt: number; // 秒
	targetAmount: number | null; // この時点までに注ぐ湯量（ml）。注がないステップは null
};

export type TimerRecipe = {
	method: BrewMethod;
	beanWeight: number;
	waterAmount: number;
	waterTemp: number;
	totalTime: number; // 秒
	steps: TimerStep[];
};

// ハンドドリップの基本レシピ（豆15g・湯240ml・2分30秒）
export const HAND_DRIP_RECIPE: TimerRecipe = {
	method: "handDrip",
	beanWeight: 15,
	waterAmount: 240,
	waterTemp: 92,
	totalTime: 150,
	steps: [
		{ name: "蒸らし", instruction: "30mlまで注いで蒸らす", startAt: 0, targetAmount: 30 },
		{ name: "2投目", instruction: "120mlまで注ぐ", startAt: 30, targetAmount: 120 },
		{ name: "3投目", instruction: "240mlまで注ぐ", startAt: 75, targetAmount: 240 },
		{ name: "落としきり", instruction: "ドリッパーから落としきる", startAt: 110, targetAmount: null },
	],
};

// 経過秒数から、いま何番目のステップかを返す
export function getCurrentStepIndex(steps: TimerStep[], elapsed: number): number {
	let index = 0;
	steps.forEach((step, i) => {
		if (elapsed >= step.startAt) index = i;
	});
	return index;
}
