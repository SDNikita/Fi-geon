import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage/HomePage"
import TrainingPage from './pages/TrainigPage/TrainingPage';
import UiKitPage from './pages/UiKitPage/UiKitPage'
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<HomePage />}/>
                <Route path="/training" element={<TrainingPage />}/>
                <Route path='/ui-kit' element = {<UiKitPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;