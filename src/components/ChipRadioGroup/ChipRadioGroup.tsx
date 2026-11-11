import { useId } from "react";
import styles from "./ChipRadioGroup.module.css";

type Option<T extends string> = {
	value: T;
	label: string;
};

type ChipRadioGroupProps<T extends string> = {
	legend: string;
	options: readonly Option<T>[];
	value: T;
	onChange: (value: T) => void;
};

// 見た目は Chip、中身は本物のラジオボタン。←→キーで選択を移せる
export function ChipRadioGroup<T extends string>({ legend, options, value, onChange }: ChipRadioGroupProps<T>) {
	const name = useId();

	return (
		<fieldset role="radiogroup" className={styles.root}>
			<legend className={styles.legend}>{legend}</legend>
			<div className={styles.options}>
				{options.map((option) => (
					<label key={option.value} className={styles.option}>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={option.value === value}
							onChange={() => onChange(option.value)}
							className={styles.input}
						/>
						<span className={styles.chip}>{option.label}</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
