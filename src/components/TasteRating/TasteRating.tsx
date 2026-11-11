import { useId } from "react";
import { TASTE_SCORES } from "../../types/brew";
import type { TasteScore } from "../../types/brew";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import styles from "./TasteRating.module.css";

type TasteRatingProps = {
	label: string;
	value: TasteScore;
	onChange: (value: TasteScore) => void;
};

// 1〜5の評価。中身はラジオボタンで、選んだ点数までのバーを塗る
export function TasteRating({ label, value, onChange }: TasteRatingProps) {
	const name = useId();

	return (
		<fieldset role="radiogroup" className={styles.root}>
			<legend className={styles.legend}>{label}</legend>
			<div className={styles.bars}>
				{TASTE_SCORES.map((score) => (
					<label key={score} className={styles.bar}>
						<input
							type="radio"
							name={name}
							value={score}
							checked={score === value}
							onChange={() => onChange(score)}
							className={styles.input}
						/>
						<span className={score <= value ? styles.fillOn : styles.fill} />
						<VisuallyHidden>{score}</VisuallyHidden>
					</label>
				))}
			</div>
		</fieldset>
	);
}
