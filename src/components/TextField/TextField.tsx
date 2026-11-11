import { useId } from "react";
import type { ComponentProps } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = ComponentProps<"input"> & {
	label: string;
	unit?: string;
	error?: string;
};

export function TextField({ label, unit, error, id, ...props }: TextFieldProps) {
	const autoId = useId();
	const inputId = id ?? autoId;
	const unitId = `${inputId}-unit`;
	const errorId = `${inputId}-error`;

	// 単位とエラー文の両方を、入力欄の説明として読み上げさせる
	const describedBy = [unit && unitId, error && errorId].filter(Boolean).join(" ") || undefined;
	const boxClassNames = [styles.box, error && styles.boxError].filter(Boolean).join(" ");

	return (
		<div className={styles.root}>
			<label htmlFor={inputId} className={styles.label}>
				{label}
			</label>
			<div className={boxClassNames}>
				<input
					id={inputId}
					className={styles.input}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					{...props}
				/>
				{unit && (
					<span id={unitId} className={styles.unit}>
						{unit}
					</span>
				)}
			</div>
			{error && (
				<p id={errorId} className={styles.error}>
					{error}
				</p>
			)}
		</div>
	);
}
