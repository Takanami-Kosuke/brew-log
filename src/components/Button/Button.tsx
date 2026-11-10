import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ComponentProps<"button"> & {
	variant?: Variant;
};

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
	const classNames = [styles.root, styles[variant], className].filter(Boolean).join(" ");

	return <button type={type} className={classNames} {...props} />;
}
