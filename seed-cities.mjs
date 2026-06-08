import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const cities = [
  // North America
  { name: 'New York', country: 'United States', timezone: 'America/New_York', lat: 40.7128, lon: -74.0060, offset: -240, region: 'North America', population: 8336817 },
  { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', lat: 34.0522, lon: -118.2437, offset: -480, region: 'North America', population: 3979576 },
  { name: 'Chicago', country: 'United States', timezone: 'America/Chicago', lat: 41.8781, lon: -87.6298, offset: -360, region: 'North America', population: 2693976 },
  { name: 'Houston', country: 'United States', timezone: 'America/Chicago', lat: 29.7604, lon: -95.3698, offset: -360, region: 'North America', population: 2320268 },
  { name: 'Phoenix', country: 'United States', timezone: 'America/Phoenix', lat: 33.4484, lon: -112.0742, offset: -420, region: 'North America', population: 1680992 },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', lat: 43.6532, lon: -79.3832, offset: -300, region: 'North America', population: 2930000 },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', lat: 19.4326, lon: -99.1332, offset: -360, region: 'North America', population: 9209944 },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', lat: 49.2827, lon: -123.1207, offset: -480, region: 'North America', population: 675570 },
  { name: 'Miami', country: 'United States', timezone: 'America/New_York', lat: 25.7617, lon: -80.1918, offset: -240, region: 'North America', population: 467963 },
  { name: 'Denver', country: 'United States', timezone: 'America/Denver', lat: 39.7392, lon: -104.9903, offset: -420, region: 'North America', population: 715522 },
  
  // South America
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', lat: -23.5505, lon: -46.6333, offset: -180, region: 'South America', population: 12396372 },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', lat: -34.6037, lon: -58.3816, offset: -180, region: 'South America', population: 15369919 },
  { name: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo', lat: -22.9068, lon: -43.1729, offset: -180, region: 'South America', population: 6748000 },
  { name: 'Lima', country: 'Peru', timezone: 'America/Lima', lat: -12.0464, lon: -77.0428, offset: -300, region: 'South America', population: 9886647 },
  { name: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota', lat: 4.7110, lon: -74.0721, offset: -300, region: 'South America', population: 8181047 },
  
  // Europe
  { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', lat: 51.5074, lon: -0.1278, offset: 0, region: 'Europe', population: 9002488 },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.8566, lon: 2.3522, offset: 60, region: 'Europe', population: 2161000 },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', lat: 52.5200, lon: 13.4050, offset: 60, region: 'Europe', population: 3645000 },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', lat: 40.4168, lon: -3.7038, offset: 60, region: 'Europe', population: 3223000 },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', lat: 41.9028, lon: 12.4964, offset: 60, region: 'Europe', population: 2761477 },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', lat: 52.3676, lon: 4.9041, offset: 60, region: 'Europe', population: 873555 },
  { name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', lat: 50.8503, lon: 4.3517, offset: 60, region: 'Europe', population: 1210000 },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', lat: 48.2082, lon: 16.3738, offset: 60, region: 'Europe', population: 1920000 },
  { name: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', lat: 50.0755, lon: 14.4378, offset: 60, region: 'Europe', population: 1320000 },
  { name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', lat: 52.2297, lon: 21.0122, offset: 60, region: 'Europe', population: 1863000 },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', lat: 55.7558, lon: 37.6173, offset: 180, region: 'Europe', population: 12610100 },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', lat: 41.0082, lon: 28.9784, offset: 180, region: 'Europe', population: 15029231 },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', lat: 53.3498, lon: -6.2603, offset: 0, region: 'Europe', population: 1256057 },
  { name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', lat: 59.3293, lon: 18.0686, offset: 60, region: 'Europe', population: 975551 },
  { name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', lat: 59.9139, lon: 10.7522, offset: 60, region: 'Europe', population: 702050 },
  { name: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', lat: 60.1695, lon: 24.9354, offset: 120, region: 'Europe', population: 656250 },
  { name: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kyiv', lat: 50.4501, lon: 30.5234, offset: 120, region: 'Europe', population: 2952301 },
  
  // Middle East & Africa
  { name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', lat: 25.2048, lon: 55.2708, offset: 240, region: 'Middle East', population: 3331420 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', timezone: 'Asia/Dubai', lat: 24.4539, lon: 54.3773, offset: 240, region: 'Middle East', population: 1450000 },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', lat: 30.0444, lon: 31.2357, offset: 120, region: 'Africa', population: 20076000 },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', lat: 6.5244, lon: 3.3792, offset: 60, region: 'Africa', population: 15387639 },
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', lat: -26.2023, lon: 28.0436, offset: 120, region: 'Africa', population: 5635127 },
  { name: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', lat: -33.9249, lon: 18.4241, offset: 120, region: 'Africa', population: 4618461 },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', lat: -1.2921, lon: 36.8219, offset: 180, region: 'Africa', population: 4386000 },
  { name: 'Addis Ababa', country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', lat: 9.0320, lon: 38.7469, offset: 180, region: 'Africa', population: 5227000 },
  { name: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', lat: 32.0853, lon: 34.7818, offset: 120, region: 'Middle East', population: 438057 },
  { name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', lat: 24.7136, lon: 46.6753, offset: 180, region: 'Middle East', population: 7676654 },
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', lat: 35.6892, lon: 51.3890, offset: 210, region: 'Middle East', population: 8693706 },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503, offset: 540, region: 'Asia', population: 37400068 },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', lat: 39.9042, lon: 116.4074, offset: 480, region: 'Asia', population: 21540000 },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', lat: 31.2304, lon: 121.4737, offset: 480, region: 'Asia', population: 27058000 },
  { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lon: 114.1694, offset: 480, region: 'Asia', population: 7496981 },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lon: 103.8198, offset: 480, region: 'Asia', population: 5917600 },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.7563, lon: 100.5018, offset: 420, region: 'Asia', population: 10156000 },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777, offset: 330, region: 'Asia', population: 20961472 },
  { name: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', lat: 28.7041, lon: 77.1025, offset: 330, region: 'Asia', population: 32941000 },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', lat: 12.9716, lon: 77.5946, offset: 330, region: 'Asia', population: 8436675 },
  { name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', lat: 24.8607, lon: 67.0011, offset: 300, region: 'Asia', population: 15400000 },
  { name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', lat: 23.8103, lon: 90.4125, offset: 360, region: 'Asia', population: 21741090 },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', lat: -6.2088, lon: 106.8456, offset: 420, region: 'Asia', population: 10770487 },
  { name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', lat: 14.5995, lon: 120.9842, offset: 480, region: 'Asia', population: 13484462 },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', lat: 37.5665, lon: 126.9780, offset: 540, region: 'Asia', population: 9776000 },
  { name: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', lat: 34.6937, lon: 135.5023, offset: 540, region: 'Asia', population: 2725006 },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', lat: 3.1390, lon: 101.6869, offset: 480, region: 'Asia', population: 1982112 },
  { name: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 21.0285, lon: 105.8542, offset: 420, region: 'Asia', population: 8053663 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 10.8231, lon: 106.6297, offset: 420, region: 'Asia', population: 9115000 },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', lat: -33.8688, lon: 151.2093, offset: 600, region: 'Oceania', population: 5312163 },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', lat: -37.8136, lon: 144.9631, offset: 600, region: 'Oceania', population: 5159211 },
  { name: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane', lat: -27.4698, lon: 153.0251, offset: 600, region: 'Oceania', population: 2464143 },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', lat: -37.0082, lon: 174.7850, offset: 720, region: 'Oceania', population: 1614300 },
  { name: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland', lat: -41.2865, lon: 174.7762, offset: 720, region: 'Oceania', population: 418500 },
  { name: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', lat: 21.3099, lon: -157.8581, offset: -600, region: 'Oceania', population: 337765 },
  
  // Additional major cities
  { name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', lat: 37.7749, lon: -122.4194, offset: -480, region: 'North America', population: 873965 },
  { name: 'Seattle', country: 'United States', timezone: 'America/Los_Angeles', lat: 47.6062, lon: -122.3321, offset: -480, region: 'North America', population: 753675 },
  { name: 'Boston', country: 'United States', timezone: 'America/New_York', lat: 42.3601, lon: -71.0589, offset: -240, region: 'North America', population: 692600 },
  { name: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin', lat: 50.1109, lon: 8.6821, offset: 60, region: 'Europe', population: 753056 },
  { name: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', lat: 41.3851, lon: 2.1734, offset: 60, region: 'Europe', population: 1620343 },
  { name: 'Milan', country: 'Italy', timezone: 'Europe/Rome', lat: 45.4642, lon: 9.1900, offset: 60, region: 'Europe', population: 1352000 },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', lat: 47.3769, lon: 8.5472, offset: 60, region: 'Europe', population: 415367 },
  { name: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich', lat: 46.2044, lon: 6.1432, offset: 60, region: 'Europe', population: 201818 },
  { name: 'Athens', country: 'Greece', timezone: 'Europe/Athens', lat: 37.9838, lon: 23.7275, offset: 120, region: 'Europe', population: 3154000 },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.7563, lon: 100.5018, offset: 420, region: 'Asia', population: 10156000 },
  { name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', lat: 25.0330, lon: 121.5654, offset: 480, region: 'Asia', population: 2704810 },
  { name: 'Shenzhen', country: 'China', timezone: 'Asia/Shanghai', lat: 22.5431, lon: 114.0579, offset: 480, region: 'Asia', population: 12528340 },
  { name: 'Guangzhou', country: 'China', timezone: 'Asia/Shanghai', lat: 23.1291, lon: 113.2644, offset: 480, region: 'Asia', population: 15301000 },
  { name: 'Chiang Mai', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 18.7883, lon: 98.9853, offset: 420, region: 'Asia', population: 1193000 },
  { name: 'Phuket', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 8.0863, lon: 98.3384, offset: 420, region: 'Asia', population: 413000 },
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    for (const city of cities) {
      const keywords = `${city.name} ${city.country} ${city.timezone}`.toLowerCase();
      await connection.execute(
        'INSERT INTO cities (name, country, timezone, latitude, longitude, utcOffsetMinutes, region, searchKeywords, population) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [city.name, city.country, city.timezone, city.lat, city.lon, city.offset, city.region, keywords, city.population]
      );
    }
    console.log(`✅ Seeded ${cities.length} cities successfully`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
