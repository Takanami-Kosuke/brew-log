import { BrewCard } from "../components/BrewCard/BrewCard";
import { Fab } from "../components/Fab/Fab";
import { useBrews } from "../hooks/useBrews";
import styles from "./BrewListPage.module.css";

export function BrewListPage() {
	const { brews } = useBrews();

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<h1 className={styles.title}>記録一覧</h1>
				<p className={styles.count}>全{brews.length}件</p>
			</div>

			{brews.length === 0 ? (
				<p className={styles.empty}>まだ記録がありません。右下の「＋」から、最初の1杯を記録しましょう。</p>
			) : (
				<ul className={styles.list}>
					{brews.map((brew) => (
						<li key={brew.id}>
							<BrewCard brew={brew} />
						</li>
					))}
				</ul>
			)}

			<div className={styles.fabArea}>
				<Fab to="/brews/new" label="新しく記録する" />
			</div>
		</div>
	);
}
