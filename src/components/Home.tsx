import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category?: string;
  relevanceScore?: number;
  location?: string;
}

// Add helper function at the top after imports
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// In Home.tsx, add this constant at the top of the file
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUYyOTM3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NEI1RjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkF0bGFudGlzIE5ld3M8L3RleHQ+PC9zdmc+';


// Update the NewsCard component
const NewsCard: React.FC<{
  item: NewsItem;
  index: number;
  active: number;
  total: number;
  onClick: () => void;
}> = ({ item, index, active, total, onClick }) => {
  const RADIUS = 800;
  const ANGLE = 360 / Math.min(total, 8);
  const rotation = (index - active) * ANGLE;
  
  const angleRad = (rotation * Math.PI) / 180;
  const x = RADIUS * Math.sin(angleRad);
  const z = RADIUS * Math.cos(angleRad) - RADIUS;
  
  const scale = mapRange(z, -RADIUS, 0, 0.7, 1);
  const opacity = mapRange(z, -RADIUS, 0, 0.4, 1);

  return (
    <motion.div
      initial={false}
      animate={{
        x,
        z,
        rotateY: rotation,
        scale,
        opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 15,
      }}
      style={{
        position: 'absolute',
        width: '450px',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
      whileHover={{ 
        scale: scale * 1.1,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className={`
        bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden
        border border-gray-700/50
        shadow-[0_0_20px_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-out
        hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
        hover:border-blue-500/30
        ${Math.abs(rotation) < 90 ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
    >
      {/* Updated card content */}
      <div className="relative group">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={item.urlToImage || FALLBACK_IMAGE}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />
        <div className="absolute top-4 right-4">
          {item.category !== 'all' && (
            <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full 
                           backdrop-blur-sm border border-blue-500/20">
              {item.category}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
        
        {/* Updated metadata section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-400 text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
            </svg>
            {item.source.name}
          </span>
          <div className="flex items-center space-x-3">
            {item.location && (
              <span className="text-emerald-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {item.location}
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-xl text-white font-semibold mb-3 line-clamp-2">{item.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
        
        {/* Updated action buttons */}
        <div className="flex justify-between items-center">
          <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg 
                           text-sm font-medium transition-all duration-300 flex items-center space-x-2
                           border border-blue-500/20 hover:border-blue-500/40">
            <span>Read More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
          <span className="text-gray-400 text-sm">
            {new Date(item.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Add circular positions constants
const CIRCULAR_POSITIONS = [
  { rotateY: 0, translateZ: 300, opacity: 1, scale: 1 },
  { rotateY: 72, translateZ: 250, opacity: 0.7, scale: 0.9 },
  { rotateY: 144, translateZ: 200, opacity: 0.5, scale: 0.8 },
  { rotateY: 216, translateZ: 150, opacity: 0.4, scale: 0.7 },
  { rotateY: 288, translateZ: 100, opacity: 0.3, scale: 0.6 },
];

// Update the CarouselContainer component
const CarouselContainer: React.FC<{
  news: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
}> = ({ news, onSelectNews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleNews, setVisibleNews] = useState(news.slice(0, 5));

  useEffect(() => {
    setVisibleNews(news.slice(currentIndex, currentIndex + 5));
  }, [currentIndex, news]);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(0, news.length - 4));
    }, 3000);

    return () => clearInterval(interval);
  }, [news.length]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % Math.max(0, news.length - 4));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => 
          prev === 0 ? Math.max(0, news.length - 5) : prev - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [news.length]);

  return (
    <div className="relative h-[600px] flex justify-center items-center">
      <div className="relative w-[600px] h-[400px] perspective-1000">
        <AnimatePresence>
          {visibleNews.map((item, index) => {
            const pos = CIRCULAR_POSITIONS[index];
            return (
              <motion.div
                key={`${item.title}-${index}`}
                className="absolute w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{
                  rotateY: pos.rotateY,
                  translateZ: pos.translateZ,
                  opacity: pos.opacity,
                  scale: pos.scale,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                onClick={() => index === 0 && onSelectNews(item)}
                style={{
                  transformStyle: "preserve-3d",
                  transformPerspective: 1000,
                  filter: index === 0 ? "none" : "blur(2px)",
                }}
              >
                <div className="relative h-full">
                  {item.urlToImage && (
                    <div className="h-1/2 overflow-hidden">
                      <img
                        src={item.urlToImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/640x360?text=No+Image+Available';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6 h-1/2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 text-sm">{item.source.name}</span>
                      {item.location && (
                        <span className="text-emerald-400 text-sm">📍 {item.location}</span>
                      )}
                    </div>
                    <h3 className="text-xl text-white font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: Math.ceil(news.length / 5) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * 5)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / 5) === index ? 'bg-blue-500 w-4' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentTime] = useState('2025-02-16 12:01:27');
  const [currentUser] = useState('abhinavx04');

  const navItems = [
    { name: 'Events', icon: '🎉', path: '/events' },
    { name: 'Emergency', icon: '🚨', path: '/emergency' },
    { name: 'Announcements', icon: '📢', path: '/announcements' },
    { name: 'Transportation', icon: '🚗', path: '/transport' },
    { name: 'Alerts', icon: '⚠️', path: '/alerts' },
    { name: 'Ambulance', icon: '🚑', path: '/ambulance' },
  ];

  const categories = ['all', 'city', 'health', 'transport', 'emergency', 'events'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
      
      // Add page and pageSize parameters
      const queries = [
        'India urban development',
        'India smart city',
        'India infrastructure',
        'Indian cities problems'
      ];
      
      const newsPromises = queries.map(query => 
        axios.get(
          `https://newsapi.org/v2/everything`, {
            params: {
              q: query,
              apiKey: API_KEY,
              sortBy: 'publishedAt',
              language: 'en',
              pageSize: 10, // Limit results per query
              page: 1 // Start with first page
            }
          }
        )
      );

      const responses = await Promise.all(newsPromises);
      
      // Log the API response for debugging
      console.log('API Responses:', responses.map(r => r.data));

      const allArticles = responses.flatMap(response => 
        response.data.articles || []
      );

      // Remove duplicates and null values
      const uniqueArticles = Array.from(
        new Map(
          allArticles
            .filter(article => article && article.title)
            .map(article => [article.title, article])
        ).values()
      );

      const processedNews = uniqueArticles
        .map((article: NewsItem) => ({
          ...article,
          category: categorizeNews(article),
          location: detectLocation(article)
        }))
        .slice(0, 30);

      setNews(processedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(getSampleNews());
    } finally {
      setLoading(false);
    }
  };

  const getSampleNews = (): NewsItem[] => {
    return [
      {
        title: "Smart City Initiative Launches in Delhi",
        description: "New smart city project aims to improve urban infrastructure...",
        url: "#",
        urlToImage: "https://via.placeholder.com/640x360?text=Smart+City+Delhi",
        publishedAt: new Date().toISOString(),
        source: { name: "Indian Express" },
        category: "city",
        location: "Delhi"
      },
      // Add more sample news items as needed
    ];
  };

  const categorizeNews = (article: NewsItem): string => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    if (text.includes('emergency') || text.includes('accident')) return 'emergency';
    if (text.includes('transport') || text.includes('traffic')) return 'transport';
    if (text.includes('event') || text.includes('festival')) return 'events';
    if (text.includes('health') || text.includes('hospital')) return 'health';
    if (text.includes('city') || text.includes('urban')) return 'city';
    return 'all';
  };

  const detectLocation = (article: NewsItem): string => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    const cities = [
      'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 
      'hyderabad', 'pune', 'ahmedabad', 'jaipur'
    ];
    
    for (const city of cities) {
      if (text.includes(city)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    return 'India';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const filteredNews = news.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
      
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl text-white font-light">Atlantis</span>
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-gray-400 text-sm">{currentTime} UTC</span>
                <span className="text-gray-400 text-sm ml-4">{currentUser}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">Loading news...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div 
              className="relative h-[800px] w-full flex items-center justify-center overflow-hidden"
              style={{
                perspective: '2000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {filteredNews.map((item, index) => (
                <NewsCard
                  key={index}
                  item={item}
                  index={index}
                  active={activeIndex}
                  total={filteredNews.length}
                  onClick={() => setSelectedNews(item)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setActiveIndex((prev) => {
                    const newIndex = prev - 1;
                    return newIndex < 0 ? filteredNews.length - 1 : newIndex;
                  });
                }}
                className="group px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full transition-colors flex items-center space-x-2"
              >
                <svg 
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % filteredNews.length);
                }}
                className="group px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-lg">No news found for this category</p>
          </div>
        )}
      </main>

      {selectedNews && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedNews.title}</h2>
                <button onClick={() => setSelectedNews(null)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
              {selectedNews.urlToImage && (
                <img 
                  src={selectedNews.urlToImage || FALLBACK_IMAGE}
                  alt={selectedNews.title} 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                />
              )}
              <p className="text-gray-300 mb-4">{selectedNews.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400">{selectedNews.source.name}</span>
                <a 
                  href={selectedNews.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Read more ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;