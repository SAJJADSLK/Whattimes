import { useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CityStaticPage() {
  const { t } = useTranslation();
  const params = useParams();
  const cityNumber = params.cityId;
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the static HTML file for the city
    const fetchCityPage = async () => {
      try {
        const response = await fetch(`/pages/city-${cityNumber}.html`);
        if (response.ok) {
          const content = await response.text();
          setHtml(content);
        } else {
          setHtml(`<div style="text-align: center; padding: 40px;"><h1>${t('cityStaticPage.notFound')}</h1></div>`);
        }
      } catch (error) {
        console.error('Error loading city page:', error);
        setHtml(`<div style="text-align: center; padding: 40px;"><h1>${t('cityStaticPage.errorLoading')}</h1></div>`);
      } finally {
        setLoading(false);
      }
    };

    fetchCityPage();
  }, [cityNumber]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>{t('common.loading')}</div>;
  }

  // Render the static HTML content
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
