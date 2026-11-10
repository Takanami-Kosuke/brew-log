import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Chip } from "../components/Chip/Chip";
import { TextField } from "../components/TextField/TextField";

export function BrewListPage() {
	const [selected, setSelected] = useState(false);

	return (
		<div style={{ display: "grid", gap: 16 }}>
			<h1>記録一覧</h1>
			<Button>保存する</Button>
			<Button variant="secondary">保存する</Button>
			<Button variant="ghost">保存する</Button>
			<Button variant="danger">削除する</Button>
			<Chip selected={selected} onClick={() => setSelected(!selected)}>
				中煎り
			</Chip>
			<TextField label="豆の量" unit="g" inputMode="decimal" defaultValue="15" />
		</div>
	);
}
