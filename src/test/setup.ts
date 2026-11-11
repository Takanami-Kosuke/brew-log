import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// テストごとに、描画した画面と localStorage を片付ける
afterEach(() => {
	cleanup();
	localStorage.clear();
});
