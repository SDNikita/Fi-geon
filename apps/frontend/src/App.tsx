import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import TrainingPage from "./pages/TrainigPage/TrainingPage";
import UiKitPage from "./pages/UiKitPage/UiKitPage";
import SchoolPage from "./pages/SchoolPage/SchoolPage";
// import DungeonPage from './pages/DungeonPage/DungeonPage'

import MainLayout from "./app/MainLayout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ui-kit" element={<UiKitPage />} />
        <Route path="/choose-school" element={<SchoolPage />} />

        <Route element={<MainLayout />}>
        {/* <Route path = "/dungeon" element = {<DungeonPage/>}/> */}

        <Route path="/training" element={<TrainingPage />} />

          <Route
            path="/progress"
            element={
              <main>
                <h1>Прогресс</h1>
              </main>
            }
          />

          <Route
            path="/profile"
            element={
              <main>
                <h1>Профиль</h1>
              </main>
            }
          />

          <Route
            path="/settings"
            element={
              <main>
                <h1>Настройки</h1>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
