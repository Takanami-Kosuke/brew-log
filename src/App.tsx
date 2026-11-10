function App() {
	return (
		<main
			style={{
				fontFamily: "var(--font-family-base)",
				padding: "var(--space-6)",
				background: "var(--color-bg-base)",
			}}>
			<h1 style={{ fontSize: "var(--font-size-2xl)" }}>Brew Log</h1>
			<p
				style={{
					fontFamily: "var(--font-family-numeric)",
					padding: "var(--space-3) var(--space-5)",
					borderRadius: "var(--radius-md)",
					background: "var(--color-bg-accent)",
					color: "var(--color-text-on-accent)",
				}}>
				2:30 / 240ml / 92℃
			</p>
		</main>
	);
}

export default App;
