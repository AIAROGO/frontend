import React from 'react';
import { useTheme } from '../context/ThemeContext';
import SettingsForm from '../components/settings/SettingsForm';

const Settings = () => {
  const { darkMode, sidebarOpen } = useTheme();

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-8">Settings</h2>
        <SettingsForm />
      </div>
    </main>
  );
};

export default Settings;