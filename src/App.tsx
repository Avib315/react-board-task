import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { BoardPage } from './pages/BoardPage/BoardPage';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/tasks/:id" element={<div>Task detail (not in scope)</div>} />
      </Routes>
    </BrowserRouter>
  );
}
