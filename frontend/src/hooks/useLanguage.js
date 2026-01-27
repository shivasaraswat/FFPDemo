import { useAuth } from '../context/AuthContext';
import { t } from '../utils/translations';

/**
 * Custom hook to get selected language and translation function
 * @returns {object} - { language, t: translation function }
 */
export const useLanguage = () => {
  const { language } = useAuth();
  const currentLanguage = language || 'en';
  
  const translate = (key) => {
    return t(key, currentLanguage);
  };
  
  return {
    language: currentLanguage,
    t: translate
  };
};

