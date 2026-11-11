import { useNavigate } from "react-router";
import { BrewForm } from "../components/BrewForm/BrewForm";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useBrews } from "../hooks/useBrews";
import { emptyBrewFormValues } from "../lib/brewSchema";
import type { BrewFormOutput } from "../lib/brewSchema";

export function BrewFormPage() {
	const { addBrew } = useBrews();
	const navigate = useNavigate();

	function handleSubmit(input: BrewFormOutput) {
		const brew = addBrew(input);
		// 保存後に「戻る」でフォームへ戻らないよう、履歴を置き換える
		navigate(`/brews/${brew.id}`, { replace: true });
	}

	return (
		<>
			{/* ページ名はヘッダーに表示しているので、h1 は読み上げ専用にする */}
			<h1>
				<VisuallyHidden>記録する</VisuallyHidden>
			</h1>
			<BrewForm defaultValues={{ ...emptyBrewFormValues }} submitLabel="保存する" onSubmit={handleSubmit} />
		</>
	);
}
