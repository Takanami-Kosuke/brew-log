import { useId } from "react";
import type { ComponentProps } from "react";
import styles from "./TextArea.module.css";

type TextAreaProps = ComponentProps<"textarea"> & {
	label: string;
	error?: string;
};

export function TextArea({ label, error, id, rows = 3, className, ...props }: TextAreaProps) {
	const autoId = useId();
	const textareaId = id ?? autoId;
	const errorId = `${textareaId}-error`;
	const classNames = [styles.textarea, error && styles.textareaError, className].filter(Boolean).join(" ");

	return (
		<div className={styles.root}>
			<label htmlFor={textareaId} className={styles.label}>
				{label}
			</label>
			<textarea
				id={textareaId}
				rows={rows}
				className={classNames}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? errorId : undefined}
				{...props}
			/>
			{error && (
				<p id={errorId} className={styles.error}>
					{error}
				</p>
			)}
		</div>
	);
}
