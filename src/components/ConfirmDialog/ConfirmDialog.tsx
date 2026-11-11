import { useEffect, useId, useRef } from "react";
import { Button } from "../Button/Button";
import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
	open: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
};

// HTML の <dialog> を使った確認ダイアログ。
// showModal() で開くと、背面の操作をブロックし、フォーカスの閉じ込めと Esc キーでの閉じる動作をブラウザが行う
export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const messageId = useId();

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			className={styles.root}
			aria-labelledby={titleId}
			aria-describedby={messageId}
			// Esc キーで閉じたときにも、親の状態を「閉じた」に戻す
			onClose={onCancel}
		>
			<h2 id={titleId} className={styles.title}>
				{title}
			</h2>
			<p id={messageId} className={styles.message}>
				{message}
			</p>
			<div className={styles.actions}>
				{/* 間違えて削除しないよう、最初のフォーカスはキャンセルに置く */}
				<Button variant="secondary" onClick={onCancel} autoFocus>
					キャンセル
				</Button>
				<Button variant="danger" onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</div>
		</dialog>
	);
}
