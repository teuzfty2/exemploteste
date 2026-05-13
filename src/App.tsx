"use client";

// Libs
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes
import Layout from "./components/Layout";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DailyDetails from "./pages/DailyDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/financas" element={<DashboardPage />} />
          <Route path="/dia/:date" element={<DailyDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
