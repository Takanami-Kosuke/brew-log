import { Star } from "lucide-react";
import { Link } from "react-router";
import { averageScore, formatBrewTime, formatDate } from "../../lib/format";
import { BREW_METHOD_LABELS, ROAST_LEVEL_LABELS } from "../../types/brew";
import type { Brew } from "../../types/brew";
import styles from "./BrewCard.module.css";

type BrewCardProps = {
	brew: Brew;
};

export function BrewCard({ brew }: BrewCardProps) {
	return (
		<article className={styles.root}>
			<div className={styles.top}>
				<div className={styles.titleGroup}>
					<h2 className={styles.title}>
						<Link to={`/brews/${brew.id}`} className={styles.link}>
							{brew.beanName}
						</Link>
					</h2>
					<p className={styles.meta}>
						<time dateTime={brew.createdAt}>{formatDate(brew.createdAt)}</time>
						{" ・ "}
						{BREW_METHOD_LABELS[brew.method]}
						{" ・ "}
						{ROAST_LEVEL_LABELS[brew.roastLevel]}
					</p>
				</div>
				<p className={styles.score}>
					<Star size={16} fill="currentColor" aria-hidden="true" className={styles.star} />
					{averageScore(brew.taste)}
				</p>
			</div>
			<ul className={styles.stats}>
				<li className={styles.stat}>豆 {brew.beanWeight}g</li>
				<li className={styles.stat}>湯 {brew.waterAmount}ml</li>
				<li className={styles.stat}>{brew.waterTemp}℃</li>
				<li className={styles.stat}>{formatBrewTime(brew.brewTime)}</li>
			</ul>
		</article>
	);
}
