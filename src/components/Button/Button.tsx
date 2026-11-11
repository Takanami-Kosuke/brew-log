import type { ComponentProps } from "react";
import { Link } from "react-router";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";

function buttonClassNames(variant: Variant, className?: string) {
	return [styles.root, styles[variant], className].filter(Boolean).join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
	variant?: Variant;
};

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
	return <button type={type} className={buttonClassNames(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
	variant?: Variant;
};

// 見た目はボタン、中身はページ移動のリンク（「編集する」など）
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
	return <Link className={buttonClassNames(variant, className)} {...props} />;
}
