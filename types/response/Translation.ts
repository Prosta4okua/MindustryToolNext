import { Locale } from '@/locales/client';

export type TranslationDiff = {
  id: string;
  key: string;
  value: string;
  keyGroup: string;
};

export type TranslationCompare = {
  id: string;
  key: string;
  value: Record<Locale, string>;
  keyGroup: string;
};