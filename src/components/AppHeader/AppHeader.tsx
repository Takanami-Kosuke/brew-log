import { ChevronLeft, Coffee, Timer } from "lucide-react";
import { Link, useLocation } from "react-router";
import styles from "./AppHeader.module.css";

function getTitle(pathname: string) {
	if (pathname === "/brews/new") return "記録する";
	if (pathname.startsWith("/brews/")) return "記録の詳細";
	if (pathname === "/timer") return "抽出タイマー";
	return null;
}

export function AppHeader() {
	const { pathname } = useLocation();
	const title = getTitle(pathname);

	if (title === null) {
		return (
			<header className={styles.root}>
				<Link to="/" className={styles.brand}>
					<Coffee aria-hidden="true" />
					<span className={styles.brandName}>Brew Log</span>
				</Link>
				<Link to="/timer" className={styles.iconLink} aria-label="抽出タイマー">
					<Timer aria-hidden="true" />
				</Link>
			</header>
		);
	}

	return (
		<header className={styles.root}>
			<Link to="/" className={styles.iconLink} aria-label="一覧に戻る">
				<ChevronLeft aria-hidden="true" />
			</Link>
			<p className={styles.title}>{title}</p>
			<span className={styles.spacer} />
		</header>
	);
}
