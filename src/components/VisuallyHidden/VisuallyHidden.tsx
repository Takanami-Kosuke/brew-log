import type { ComponentProps } from "react";
import styles from "./VisuallyHidden.module.css";

// 画面には表示しないが、読み上げソフトには読ませる
export function VisuallyHidden({ className, ...props }: ComponentProps<"span">) {
	const classNames = [styles.root, className].filter(Boolean).join(" ");

	return <span className={classNames} {...props} />;
}
