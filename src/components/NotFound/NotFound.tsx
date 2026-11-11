import { Link } from "react-router";
import styles from "./NotFound.module.css";

// 記録が見つからないときの表示。詳細画面と編集画面で使う
export function NotFound() {
	return (
		<div className={styles.root}>
			<h1 className={styles.title}>記録が見つかりません</h1>
			<p>削除されたか、URLが間違っている可能性があります。</p>
			<Link to="/" className={styles.link}>
				記録一覧に戻る
			</Link>
		</div>
	);
}
