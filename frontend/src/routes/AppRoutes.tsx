import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Application Layout with Navbar & Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="*" element={
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Page Under Construction
            </h2>
            <p className="text-slate-500 text-sm">
              WadiGo Phase 1 Milestone setup complete. Route available for future milestones.
            </p>
          </div>
        } />
      </Route>
    </Routes>
  );
};
