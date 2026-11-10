import type { ComponentProps } from "react";
import styles from "./Chip.module.css";

type ChipProps = ComponentProps<"button"> & {
	selected?: boolean;
};

export function Chip({ selected = false, type = "button", className, ...props }: ChipProps) {
	const classNames = [styles.root, className].filter(Boolean).join(" ");

	return <button type={type} aria-pressed={selected} className={classNames} {...props} />;
}
