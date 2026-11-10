import { Route, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout/AppLayout";
import { BrewDetailPage } from "./pages/BrewDetailPage";
import { BrewFormPage } from "./pages/BrewFormPage";
import { BrewListPage } from "./pages/BrewListPage";
import { TimerPage } from "./pages/TimerPage";

function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<BrewListPage />} />
				<Route path="brews/new" element={<BrewFormPage />} />
				<Route path="brews/:id" element={<BrewDetailPage />} />
				<Route path="timer" element={<TimerPage />} />
			</Route>
		</Routes>
	);
}

export default App;
