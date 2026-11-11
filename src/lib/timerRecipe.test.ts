import { describe, expect, it } from "vitest";
import { HAND_DRIP_RECIPE, getCurrentStepIndex } from "./timerRecipe";

describe("getCurrentStepIndex", () => {
	const { steps } = HAND_DRIP_RECIPE;

	it.each([
		[0, 0],
		[29, 0],
		[30, 1],
		[72, 1],
		[75, 2],
		[110, 3],
		[999, 3],
	])("%i秒なら %i 番目のステップ", (elapsed, index) => {
		expect(getCurrentStepIndex(steps, elapsed)).toBe(index);
	});
});
