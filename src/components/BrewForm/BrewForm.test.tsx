import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BrewForm } from "./BrewForm";
import { emptyBrewFormValues } from "../../lib/brewSchema";

function renderForm() {
	const handleSubmit = vi.fn();
	render(<BrewForm defaultValues={emptyBrewFormValues} submitLabel="保存する" onSubmit={handleSubmit} />);
	return { handleSubmit, user: userEvent.setup() };
}

describe("BrewForm", () => {
	it("空のまま保存すると、エラーを出して最初の欄にフォーカスする", async () => {
		const { handleSubmit, user } = renderForm();

		await user.click(screen.getByRole("button", { name: "保存する" }));

		expect(await screen.findByText("豆の名前を入力してください")).toBeInTheDocument();
		const beanName = screen.getByRole("textbox", { name: "豆の名前" });
		expect(beanName).toHaveAttribute("aria-invalid", "true");
		expect(beanName).toHaveAccessibleDescription("豆の名前を入力してください");
		expect(beanName).toHaveFocus();
		expect(handleSubmit).not.toHaveBeenCalled();
	});

	it("入力して保存すると、変換した値を渡す", async () => {
		const { handleSubmit, user } = renderForm();

		await user.type(screen.getByRole("textbox", { name: "豆の名前" }), "エチオピア");
		await user.type(screen.getByRole("textbox", { name: "豆の量" }), "15");
		await user.type(screen.getByRole("textbox", { name: "湯量" }), "240");
		await user.type(screen.getByRole("textbox", { name: "湯温" }), "92");
		await user.type(screen.getByRole("textbox", { name: "抽出時間" }), "2:30");
		await user.click(screen.getByRole("radio", { name: "浅煎り" }));
		// 酸味の評価を5にする（radiogroup の名前は「酸味」）
		const acidity = screen.getByRole("radiogroup", { name: "酸味" });
		await user.click(acidity.querySelector('input[value="5"]') as HTMLElement);
		await user.click(screen.getByRole("button", { name: "保存する" }));

		expect(handleSubmit).toHaveBeenCalledTimes(1);
		expect(handleSubmit.mock.calls[0][0]).toMatchObject({
			beanName: "エチオピア",
			roastLevel: "light",
			beanWeight: 15,
			brewTime: 150,
			taste: { acidity: 5, bitterness: 3 },
		});
	});

	it("焙煎度は矢印キーで選び直せる", async () => {
		const { user } = renderForm();
		const medium = screen.getByRole("radio", { name: "中煎り" });

		medium.focus();
		await user.keyboard("{ArrowRight}");

		expect(screen.getByRole("radio", { name: "深煎り" })).toBeChecked();
		expect(medium).not.toBeChecked();
	});
});
