import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import DailyDetails from './pages/DailyDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/financas" element={<CalendarPage />} />
          <Route path="/dia/:date" element={<DailyDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;