"use client";

import { useContext } from 'react';
import { LanguageContext } from '@/contexts/language-context';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
