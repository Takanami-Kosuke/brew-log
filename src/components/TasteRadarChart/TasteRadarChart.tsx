import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { TASTE_ITEMS } from "../../types/brew";
import type { Taste } from "../../types/brew";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import styles from "./TasteRadarChart.module.css";

type TasteRadarChartProps = {
	taste: Taste;
};

const OUTER_RADIUS = 86;
const LABEL_RADIUS = 106; // 項目名は、いちばん外側の線より少し外に置く

type TickProps = {
	x: number | string;
	y: number | string;
	payload: { value: string };
};

// 項目名（「酸味 4」など）を、その位置の中央にそろえて書く
function AngleTick({ x, y, payload }: TickProps) {
	return (
		<text x={x} y={y} textAnchor="middle" dominantBaseline="central" className={styles.label}>
			{payload.value}
		</text>
	);
}

export function TasteRadarChart({ taste }: TasteRadarChartProps) {
	const data = TASTE_ITEMS.map((item) => ({
		label: `${item.label} ${taste[item.key]}`,
		score: taste[item.key],
	}));

	// 動きを減らす設定の人には、描画のアニメーションをしない
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	return (
		<div className={styles.root}>
			{/* グラフは見た目のためのもの。読み上げには下の一覧を使う */}
			<div className={styles.chart} aria-hidden="true">
				<ResponsiveContainer width="100%" height={250}>
					<RadarChart data={data} cy={130} outerRadius={OUTER_RADIUS} accessibilityLayer={false}>
						<PolarGrid gridType="polygon" />
						<PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
						{/* tickSize は外周から項目名までの距離。目盛りの線は消して、位置の調整にだけ使う */}
						<PolarAngleAxis
							dataKey="label"
							tick={(props: TickProps) => <AngleTick {...props} />}
							tickLine={false}
							tickSize={LABEL_RADIUS - OUTER_RADIUS}
						/>
						<Radar dataKey="score" isAnimationActive={!reduceMotion} />
					</RadarChart>
				</ResponsiveContainer>
			</div>
			<VisuallyHidden as="div">
				<dl>
					{TASTE_ITEMS.map((item) => (
						<div key={item.key}>
							<dt>{item.label}</dt>
							<dd>5段階中 {taste[item.key]}</dd>
						</div>
					))}
				</dl>
			</VisuallyHidden>
		</div>
	);
}
