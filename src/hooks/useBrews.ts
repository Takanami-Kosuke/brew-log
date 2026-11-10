import { useState } from "react";
import { loadBrews, saveBrews } from "../lib/brewStorage";
import type { Brew, BrewInput } from "../types/brew";

export function useBrews() {
	const [brews, setBrews] = useState<Brew[]>(loadBrews);

	function commit(next: Brew[]) {
		saveBrews(next);
		setBrews(next);
	}

	function addBrew(input: BrewInput): Brew {
		const brew: Brew = {
			...input,
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
		};
		commit([brew, ...brews]);
		return brew;
	}

	function updateBrew(id: string, input: BrewInput): void {
		commit(brews.map((brew) => (brew.id === id ? { ...brew, ...input } : brew)));
	}

	function deleteBrew(id: string): void {
		commit(brews.filter((brew) => brew.id !== id));
	}

	function getBrew(id: string): Brew | undefined {
		return brews.find((brew) => brew.id === id);
	}

	return { brews, addBrew, updateBrew, deleteBrew, getBrew };
}
