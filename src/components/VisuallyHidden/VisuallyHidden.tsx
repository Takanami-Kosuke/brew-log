import type { ReactNode } from "react";
import styles from "./VisuallyHidden.module.css";

type VisuallyHiddenProps = {
	// 中に <dl> などのブロック要素を入れるときは "div" にする
	as?: "span" | "div";
	children: ReactNode;
};

// 画面には表示しないが、読み上げソフトには読ませる
export function VisuallyHidden({ as: Tag = "span", children }: VisuallyHiddenProps) {
	return <Tag className={styles.root}>{children}</Tag>;
}
