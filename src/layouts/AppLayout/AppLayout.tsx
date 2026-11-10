import { Outlet } from "react-router";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import styles from "./AppLayout.module.css";

export function AppLayout() {
	return (
		<div className={styles.root}>
			<AppHeader />
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
