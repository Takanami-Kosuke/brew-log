import { Plus } from "lucide-react";
import { Link } from "react-router";
import styles from "./Fab.module.css";

type FabProps = {
	to: string;
	label: string;
};

export function Fab({ to, label }: FabProps) {
	return (
		<Link to={to} className={styles.root} aria-label={label}>
			<Plus aria-hidden="true" />
		</Link>
	);
}
