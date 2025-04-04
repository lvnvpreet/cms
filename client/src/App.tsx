import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Page Components
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import SiteManagerPage from './pages/SiteManagerPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
// Optional: Import Layout component if needed for protected routes
// import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <BrowserRouter>
      {/*
        Future Enhancement: Implement layout switching based on route.
        e.g., Public routes (Home, Login, Register) might have a simple layout,
        while authenticated routes (Dashboard, Editor, etc.) use AppLayout.
      */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Add routes for terms, privacy, forgot-password if needed */}

        {/* Authenticated/App Routes (Consider wrapping with AppLayout later) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Editor route: handles new sites and existing sites */}
        <Route path="/editor" element={<EditorPage />} /> {/* New site */}
        <Route path="/editor/:siteId" element={<EditorPage />} /> {/* Existing site */}
        {/* Site Manager route */}
        <Route path="/site-manager/:siteId" element={<SiteManagerPage />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
