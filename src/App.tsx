import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreatePastePage } from './pages/CreatePastePage';
import { ViewPastePage } from './pages/ViewPastePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePastePage />} />
        <Route path="/pastes/:id" element={<ViewPastePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
