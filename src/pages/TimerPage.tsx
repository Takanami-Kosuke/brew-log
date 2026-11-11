import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button/Button";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useStopwatch } from "../hooks/useStopwatch";
import { formatBrewTime } from "../lib/format";
import { HAND_DRIP_RECIPE, getCurrentStepIndex } from "../lib/timerRecipe";
import { BREW_METHOD_LABELS } from "../types/brew";
import styles from "./TimerPage.module.css";

const recipe = HAND_DRIP_RECIPE;

// 進み具合の輪。円周の長さに対して、どれだけ線を描くかで表す
const RING_SIZE = 232;
const RING_STROKE = 12;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function TimerPage() {
	const navigate = useNavigate();
	const { elapsedSeconds, isRunning, start, pause, reset } = useStopwatch();

	const isFinished = elapsedSeconds >= recipe.totalTime;
	const currentIndex = getCurrentStepIndex(recipe.steps, elapsedSeconds);
	const currentStep = recipe.steps[currentIndex];
	const nextStep = recipe.steps[currentIndex + 1];
	const progress = Math.min(elapsedSeconds / recipe.totalTime, 1);
	const hasStarted = elapsedSeconds > 0 || isRunning;

	function getStepStatus(index: number) {
		if (isFinished || index < currentIndex) return "done";
		if (index === currentIndex && hasStarted) return "current";
		return "upcoming";
	}

	function getSubText() {
		if (isFinished) return "目安の時間になりました。落としきったら記録しましょう";
		if (!hasStarted) return "スタートを押すと計測を始めます";
		const nextAt = nextStep ? nextStep.startAt : recipe.totalTime;
		const label = nextStep ? "次のステップまで" : "終了まで";
		return `${label} ${formatBrewTime(nextAt - elapsedSeconds)}`;
	}

	function handleFinish() {
		pause();
		// 抽出条件と時間をフォームに渡す。URL に入れるので、フォームを再読み込みしても消えない
		const params = new URLSearchParams({
			method: recipe.method,
			beanWeight: String(recipe.beanWeight),
			waterAmount: String(recipe.waterAmount),
			waterTemp: String(recipe.waterTemp),
		});
		if (elapsedSeconds > 0) params.set("brewTime", String(elapsedSeconds));
		navigate(`/brews/new?${params.toString()}`);
	}

	return (
		<>
			{/* ページ名はヘッダーに表示しているので、h1 は読み上げ専用にする */}
			<h1>
				<VisuallyHidden>抽出タイマー</VisuallyHidden>
			</h1>
			<div className={styles.root}>
				<p className={styles.recipe}>
					{BREW_METHOD_LABELS[recipe.method]} ・ 豆{recipe.beanWeight}g ・ 湯{recipe.waterAmount}ml ・ {recipe.waterTemp}℃
				</p>

				<div className={styles.ring}>
					<svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true">
						<circle className={styles.track} cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} strokeWidth={RING_STROKE} />
						{progress > 0 && (
							<circle
								className={styles.progress}
								cx={RING_SIZE / 2}
								cy={RING_SIZE / 2}
								r={RING_RADIUS}
								strokeWidth={RING_STROKE}
								strokeDasharray={RING_CIRCUMFERENCE}
								strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
							/>
						)}
					</svg>
					{/* role="timer" は、毎秒の変化を読み上げで割り込ませない */}
					<div className={styles.time} role="timer">
						<span className={styles.elapsed}>{formatBrewTime(elapsedSeconds)}</span>
						<span className={styles.total}>
							<VisuallyHidden>目安 </VisuallyHidden>/ {formatBrewTime(recipe.totalTime)}
						</span>
					</div>
				</div>

				<div className={styles.current}>
					{/* ステップが変わったときだけ読み上げる */}
					<p className={styles.instruction} aria-live="polite">
						{isFinished ? "抽出完了" : `${currentStep.name}：${currentStep.instruction}`}
					</p>
					<p className={styles.subText}>{getSubText()}</p>
				</div>

				<ol className={styles.steps}>
					{recipe.steps.map((step, index) => {
						const status = getStepStatus(index);
						return (
							<li key={step.name} className={styles.step} data-status={status} aria-current={status === "current" ? "step" : undefined}>
								<span className={styles.badge}>
									{status === "done" ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : index + 1}
								</span>
								<span className={styles.stepName}>
									{step.name}
									{status === "done" && <VisuallyHidden>（完了）</VisuallyHidden>}
								</span>
								<span className={styles.stepTime}>{formatBrewTime(step.startAt)}</span>
								<span className={styles.stepAmount}>{step.targetAmount === null ? "—" : `${step.targetAmount}ml`}</span>
							</li>
						);
					})}
				</ol>

				<div className={styles.controls}>
					<Button variant="secondary" onClick={reset} disabled={!hasStarted}>
						リセット
					</Button>
					<Button onClick={isRunning ? pause : start}>{isRunning ? "一時停止" : hasStarted ? "再開" : "スタート"}</Button>
				</div>

				<Button variant="ghost" onClick={handleFinish}>
					終了して記録する <span aria-hidden="true">→</span>
				</Button>
			</div>
		</>
	);
}
