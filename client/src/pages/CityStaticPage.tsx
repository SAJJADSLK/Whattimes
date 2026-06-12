import { useParams } from 'wouter';
import { useEffect, useState } from 'react';

export default function CityStaticPage() {
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
          setHtml('<div style="text-align: center; padding: 40px;"><h1>City page not found</h1></div>');
        }
      } catch (error) {
        console.error('Error loading city page:', error);
        setHtml('<div style="text-align: center; padding: 40px;"><h1>Error loading city page</h1></div>');
      } finally {
        setLoading(false);
      }
    };

    fetchCityPage();
  }, [cityNumber]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  // Render the static HTML content
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
