import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: [{
    main: string;
    description: string;
    icon: string;
  }];
  wind: {
    speed: number;
  };
  name: string;
}

interface Location {
  name: string;
  lat: number;
  lon: number;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        error => {
          setError("Location access denied. Please search for a location.");
          setLoading(false);
        }
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  const searchLocations = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      return data.map((loc: any) => ({
        name: `${loc.name}, ${loc.country}`,
        lat: loc.lat,
        lon: loc.lon
      }));
    } catch (err) {
      return [];
    }
  };

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    await fetchWeatherByCoords(location.lat, location.lon);
    setSavedLocations(prev => [...new Set([...prev, location])]);
    setShowLocationSearch(false);
  };

  const WeatherIcon = ({ condition }: { condition: string }) => {
    // Map weather conditions to custom icons or use weather API icons
    const iconUrl = `https://openweathermap.org/img/wn/${condition}@2x.png`;
    return (
      <img
        src={iconUrl}
        alt="Weather condition"
        className="w-16 h-16 object-contain filter drop-shadow-lg"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20
                    shadow-[0_0_30px_rgba(59,130,246,0.2)] min-w-[320px]">
        {/* Header with location selector */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            Weather Forecast
          </h3>
          <button
            onClick={() => setShowLocationSearch(!showLocationSearch)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>

        {/* Location Search Dropdown */}
        <AnimatePresence>
          {showLocationSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-0 right-0 bg-gray-800 rounded-xl border border-blue-500/20 p-4 z-50"
            >
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={async (e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 2) {
                    const locations = await searchLocations(e.target.value);
                    setSavedLocations(locations);
                  }
                }}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="max-h-48 overflow-y-auto">
                {savedLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Display */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"/>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-4">{error}</div>
        ) : weatherData && (
          <div className="space-y-4">
            {/* Current Temperature */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-3xl font-bold text-white">
                  {Math.round(weatherData.main.temp)}°C
                </h4>
                <p className="text-gray-400">
                  Feels like {Math.round(weatherData.main.feels_like)}°C
                </p>
              </div>
              <WeatherIcon condition={weatherData.weather[0].icon} />
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20"
              >
                <p className="text-gray-400 text-sm">Humidity</p>
                <p className="text-white text-lg">
                  {weatherData.main.humidity}%
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20"
              >
                <p className="text-gray-400 text-sm">Wind Speed</p>
                <p className="text-white text-lg">
                  {Math.round(weatherData.wind.speed)} m/s
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20"
              >
                <p className="text-gray-400 text-sm">Pressure</p>
                <p className="text-white text-lg">
                  {weatherData.main.pressure} hPa
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20"
              >
                <p className="text-gray-400 text-sm">Condition</p>
                <p className="text-white text-lg capitalize">
                  {weatherData.weather[0].description}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Weather;