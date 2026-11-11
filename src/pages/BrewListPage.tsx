import { SlidersHorizontal } from "lucide-react";
import { useId } from "react";
import { useSearchParams } from "react-router";
import { BrewCard } from "../components/BrewCard/BrewCard";
import { Chip } from "../components/Chip/Chip";
import { Fab } from "../components/Fab/Fab";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useBrews } from "../hooks/useBrews";
import { SORT_ORDER_LABELS, SORT_ORDERS, filterAndSortBrews, parseRoast, parseSort } from "../lib/brewList";
import { ROAST_LEVEL_LABELS, ROAST_LEVELS } from "../types/brew";
import type { RoastLevel } from "../types/brew";
import type { SortOrder } from "../lib/brewList";
import styles from "./BrewListPage.module.css";

export function BrewListPage() {
	const { brews } = useBrews();
	const sortId = useId();

	// 絞り込みと並び順は URL に持たせる。再読み込みや「戻る」でも状態が残る
	const [searchParams, setSearchParams] = useSearchParams();
	const roast = parseRoast(searchParams.get("roast"));
	const sort = parseSort(searchParams.get("sort"));
	const visibleBrews = filterAndSortBrews(brews, roast, sort);

	function updateParams(key: "roast" | "sort", value: string | null) {
		const next = new URLSearchParams(searchParams);
		if (value === null) next.delete(key);
		else next.set(key, value);
		setSearchParams(next, { replace: true });
	}

	function handleRoastChange(value: RoastLevel | null) {
		updateParams("roast", value);
	}

	function handleSortChange(value: SortOrder) {
		updateParams("sort", value === "newest" ? null : value);
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<h1 className={styles.title}>記録一覧</h1>
				{/* 絞り込みで件数が変わったことを、読み上げソフトにも伝える */}
				<p className={styles.count} aria-live="polite">
					{roast ? `${visibleBrews.length}件 / 全${brews.length}件` : `全${brews.length}件`}
				</p>
			</div>

			{brews.length > 0 && (
				<div className={styles.filter}>
					<div className={styles.chips} role="group" aria-label="焙煎度で絞り込む">
						<Chip selected={roast === null} onClick={() => handleRoastChange(null)}>
							すべて
						</Chip>
						{ROAST_LEVELS.map((level) => (
							<Chip key={level} selected={roast === level} onClick={() => handleRoastChange(level)}>
								{ROAST_LEVEL_LABELS[level]}
							</Chip>
						))}
					</div>

					{/* 見えている文字は飾り。操作は上に重ねた透明の <select> で行う */}
					<div className={styles.sort}>
						<span className={styles.sortText} aria-hidden="true">
							並び替え：{SORT_ORDER_LABELS[sort]}
						</span>
						<SlidersHorizontal size={20} aria-hidden="true" className={styles.sortIcon} />
						<label htmlFor={sortId} className={styles.sortLabel}>
							<VisuallyHidden>並び替え</VisuallyHidden>
						</label>
						<select
							id={sortId}
							className={styles.sortSelect}
							value={sort}
							onChange={(event) => handleSortChange(parseSort(event.target.value))}
						>
							{SORT_ORDERS.map((order) => (
								<option key={order} value={order}>
									{SORT_ORDER_LABELS[order]}
								</option>
							))}
						</select>
					</div>
				</div>
			)}

			{brews.length === 0 && (
				<p className={styles.empty}>まだ記録がありません。右下の「＋」から、最初の1杯を記録しましょう。</p>
			)}

			{brews.length > 0 && visibleBrews.length === 0 && (
				<p className={styles.empty}>条件に合う記録がありません。</p>
			)}

			{visibleBrews.length > 0 && (
				<ul className={styles.list}>
					{visibleBrews.map((brew) => (
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
