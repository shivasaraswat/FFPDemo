import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAuth();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">Language:</label>
      <select
        id="language-select"
        value={language || 'en'}
        onChange={handleLanguageChange}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;

