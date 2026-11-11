import { ChevronLeft, Coffee, Timer } from "lucide-react";
import { Link, useLocation } from "react-router";
import styles from "./AppHeader.module.css";

type SubPage = {
	title: string;
	backTo: string;
	backLabel: string;
};

// URL から、ヘッダーに出すページ名と「戻る」の行き先を決める。ホームなら null
function getSubPage(pathname: string): SubPage | null {
	const toList = { backTo: "/", backLabel: "一覧に戻る" };

	if (pathname === "/brews/new") return { title: "記録する", ...toList };
	if (pathname === "/timer") return { title: "抽出タイマー", ...toList };

	const editMatch = pathname.match(/^\/brews\/([^/]+)\/edit$/);
	if (editMatch) return { title: "記録を編集", backTo: `/brews/${editMatch[1]}`, backLabel: "詳細に戻る" };

	if (pathname.startsWith("/brews/")) return { title: "記録の詳細", ...toList };
	return null;
}

export function AppHeader() {
	const { pathname } = useLocation();
	const subPage = getSubPage(pathname);

	if (subPage === null) {
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
			<Link to={subPage.backTo} className={styles.iconLink} aria-label={subPage.backLabel}>
				<ChevronLeft aria-hidden="true" />
			</Link>
			<p className={styles.title}>{subPage.title}</p>
			<span className={styles.spacer} />
		</header>
	);
}
