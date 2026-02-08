import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAuth();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        id="language-select"
        value={language || 'en'}
        onChange={handleLanguageChange}
        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 cursor-pointer min-w-[100px] transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
      >
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;

