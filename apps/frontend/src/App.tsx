import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<HomePage />}/>
                <Route path="/training" element={<TrainingPage />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;