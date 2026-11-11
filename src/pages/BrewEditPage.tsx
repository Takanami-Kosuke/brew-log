import { useNavigate, useParams } from "react-router";
import { BrewForm } from "../components/BrewForm/BrewForm";
import { NotFound } from "../components/NotFound/NotFound";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useBrews } from "../hooks/useBrews";
import { toBrewFormValues } from "../lib/brewSchema";
import type { BrewFormOutput } from "../lib/brewSchema";

export function BrewEditPage() {
	const { id } = useParams();
	const { getBrew, updateBrew } = useBrews();
	const navigate = useNavigate();
	const brew = id ? getBrew(id) : undefined;

	if (!brew) return <NotFound />;

	function handleSubmit(input: BrewFormOutput) {
		if (!brew) return;
		updateBrew(brew.id, input);
		navigate(`/brews/${brew.id}`, { replace: true });
	}

	return (
		<>
			<h1>
				<VisuallyHidden>記録を編集</VisuallyHidden>
			</h1>
			<BrewForm defaultValues={toBrewFormValues(brew)} submitLabel="更新する" onSubmit={handleSubmit} />
		</>
	);
}
