import { useId } from "react";
import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
	title: string;
	children: ReactNode;
};

// 見出し（h2）と白いカードのまとまり。フォームと詳細画面で使う
export function Section({ title, children }: SectionProps) {
	const headingId = useId();

	return (
		<section className={styles.root} aria-labelledby={headingId}>
			<h2 id={headingId} className={styles.title}>
				{title}
			</h2>
			<div className={styles.card}>{children}</div>
		</section>
	);
}
