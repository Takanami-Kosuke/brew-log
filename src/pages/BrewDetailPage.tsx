import { Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { Section } from "../components/Section/Section";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useBrews } from "../hooks/useBrews";
import { averageScore, formatBrewTime, formatDate, formatRatio } from "../lib/format";
import { BREW_METHOD_LABELS, GRIND_SIZE_LABELS, ROAST_LEVEL_LABELS, TASTE_ITEMS } from "../types/brew";
import styles from "./BrewDetailPage.module.css";

export function BrewDetailPage() {
	const { id } = useParams();
	const { getBrew } = useBrews();
	const brew = id ? getBrew(id) : undefined;

	if (!brew) {
		return (
			<div className={styles.notFound}>
				<h1 className={styles.notFoundTitle}>記録が見つかりません</h1>
				<p>削除されたか、URLが間違っている可能性があります。</p>
				<Link to="/" className={styles.backLink}>
					記録一覧に戻る
				</Link>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.titleBlock}>
				<p className={styles.meta}>
					<time dateTime={brew.createdAt}>{formatDate(brew.createdAt)}</time>
					{" ・ "}
					{BREW_METHOD_LABELS[brew.method]}
					{brew.shop && ` ・ ${brew.shop}`}
				</p>
				<h1 className={styles.title}>{brew.beanName}</h1>
				<div className={styles.badges}>
					<p className={styles.score}>
						<Star size={20} fill="currentColor" aria-hidden="true" className={styles.star} />
						<span>
							<VisuallyHidden>平均の評価 </VisuallyHidden>
							{averageScore(brew.taste)}
						</span>
					</p>
					<p className={styles.roast}>{ROAST_LEVEL_LABELS[brew.roastLevel]}</p>
				</div>
			</div>

			<Section title="抽出条件">
				<dl className={styles.stats}>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>豆の量</dt>
						<dd className={styles.statValue}>
							{brew.beanWeight}
							<span className={styles.unit}>g</span>
						</dd>
					</div>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>湯量</dt>
						<dd className={styles.statValue}>
							{brew.waterAmount}
							<span className={styles.unit}>ml</span>
						</dd>
					</div>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>湯温</dt>
						<dd className={styles.statValue}>
							{brew.waterTemp}
							<span className={styles.unit}>℃</span>
						</dd>
					</div>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>抽出時間</dt>
						<dd className={styles.statValue}>{formatBrewTime(brew.brewTime)}</dd>
					</div>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>挽き目</dt>
						<dd className={styles.statText}>{GRIND_SIZE_LABELS[brew.grindSize]}</dd>
					</div>
					<div className={styles.stat}>
						<dt className={styles.statLabel}>比率</dt>
						<dd className={styles.statValue}>{formatRatio(brew.beanWeight, brew.waterAmount)}</dd>
					</div>
				</dl>
			</Section>

			<Section title="味の評価">
				<dl className={styles.tasteList}>
					{TASTE_ITEMS.map((item) => (
						<div key={item.key} className={styles.tasteItem}>
							<dt>{item.label}</dt>
							<dd className={styles.tasteScore}>{brew.taste[item.key]}</dd>
						</div>
					))}
				</dl>
			</Section>

			<Section title="メモ">
				{brew.memo ? <p className={styles.memo}>{brew.memo}</p> : <p className={styles.memoEmpty}>メモはありません</p>}
			</Section>
		</div>
	);
}
