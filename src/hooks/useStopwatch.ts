import { useEffect, useState } from "react";

// 一時停止できるストップウォッチ。
// setInterval の回数で数えると、タブが裏に回ったときなどに遅れが積み重なるため、
// 「開始した時刻」と「今の時刻」の差から経過時間を計算する
export function useStopwatch() {
	const [accumulatedMs, setAccumulatedMs] = useState(0); // 一時停止までに経過した時間
	const [startedAt, setStartedAt] = useState<number | null>(null); // 動いているときの開始時刻
	const [now, setNow] = useState(0);

	const isRunning = startedAt !== null;

	useEffect(() => {
		if (startedAt === null) return;

		const intervalId = setInterval(() => setNow(Date.now()), 200);
		return () => clearInterval(intervalId);
	}, [startedAt]);

	const elapsedMs = accumulatedMs + (startedAt === null ? 0 : Math.max(0, now - startedAt));

	function start() {
		const time = Date.now();
		setStartedAt(time);
		setNow(time);
	}

	function pause() {
		if (startedAt === null) return;
		setAccumulatedMs((ms) => ms + Date.now() - startedAt);
		setStartedAt(null);
	}

	function reset() {
		setAccumulatedMs(0);
		setStartedAt(null);
	}

	return { elapsedSeconds: Math.floor(elapsedMs / 1000), isRunning, start, pause, reset };
}
