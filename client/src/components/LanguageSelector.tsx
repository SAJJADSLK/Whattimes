import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'fr', name: 'Francais', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'zh', name: 'Chinese', flag: 'CN' },
  { code: 'ja', name: 'Japanese', flag: 'JP' },
  { code: 'ar', name: 'Arabic', flag: 'SA' },
  { code: 'pt', name: 'Portugues', flag: 'PT' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
  { code: 'he', name: 'Hebrew', flag: 'IL' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('chronos-language', lang);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
