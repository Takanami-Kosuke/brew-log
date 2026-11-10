import { useId } from "react";
import type { ComponentProps } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = ComponentProps<"input"> & {
	label: string;
	unit?: string;
};

export function TextField({ label, unit, id, ...props }: TextFieldProps) {
	const autoId = useId();
	const inputId = id ?? autoId;
	const unitId = `${inputId}-unit`;

	return (
		<div className={styles.root}>
			<label htmlFor={inputId} className={styles.label}>
				{label}
			</label>
			<div className={styles.box}>
				<input id={inputId} className={styles.input} aria-describedby={unit ? unitId : undefined} {...props} />
				{unit && (
					<span id={unitId} className={styles.unit}>
						{unit}
					</span>
				)}
			</div>
		</div>
	);
}
