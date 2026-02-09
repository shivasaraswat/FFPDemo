import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' }
  ];

  const currentLanguage = languages.find(lang => lang.value === (language || 'en')) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (langValue) => {
    setLanguage(langValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="language-dropdown-btn flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none min-w-[120px] justify-between"
      >
        <span>{currentLanguage.label}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white rounded-lg shadow-lg min-w-[120px] z-[1000] border border-gray-200 overflow-hidden animate-[slideDownDropdown_0.2s_ease-out]">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => handleLanguageSelect(lang.value)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                currentLanguage.value === lang.value
                  ? 'bg-red-50 text-danger font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .language-dropdown-btn {
          border: 2px solid #e5e7eb !important;
        }
        @keyframes slideDownDropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;

