import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import TrainingPage from "./pages/TrainigPage/TrainingPage";
import UiKitPage from "./pages/UiKitPage/UiKitPage";
import SchoolPage from "./pages/SchoolPage/SchoolPage";
import DungeonPage from './pages/DungeonPage/DungeonPage';
import SettingPage from "./pages/SettingPage/SettingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProgressPage from "./pages/ProgressPage/ProgressPage";
import MainLayout from "./app/MainLayout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ui-kit" element={<UiKitPage />} />
        <Route path="/choose-school" element={<SchoolPage />} />

        <Route element={<MainLayout />}>
          <Route path = "/dungeon" element = {<DungeonPage/>}/>
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/progress"element={<ProgressPage/>}/>
          <Route path="/profile"element={<ProfilePage/>}/>
          <Route path="/settings"element={<SettingPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
