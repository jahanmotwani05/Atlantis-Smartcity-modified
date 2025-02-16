import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

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

// Update the NewsCard component
const NewsCard: React.FC<{
  item: NewsItem;
  index: number;
  progress: number;
  onClick: () => void;
}> = ({ item, index, progress, onClick }) => {
  const rotation = useTransform(progress, [0, 1], [index * 45, (index - 5) * 45]);
  const y = useTransform(progress, [0, 1], [index * 100, (index - 5) * 100]);
  const scale = useTransform(progress, [0, 1], [1 - index * 0.2, 1 - (index - 5) * 0.2]);
  const opacity = useTransform(progress, [0, 1], [1 - index * 0.3, 1 - (index - 5) * 0.3]);

  return (
    <motion.div
      className="absolute w-[600px] bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
      style={{
        rotateX: rotation,
        y,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      whileHover={{ scale: scale.get() * 1.05 }}
      onClick={onClick}
    >
      {item.urlToImage && (
        <div className="aspect-video w-full overflow-hidden">
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-400 text-sm">{item.source.name}</span>
          {item.location && (
            <span className="text-emerald-400 text-sm">📍 {item.location}</span>
          )}
        </div>
        <h3 className="text-xl text-white font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
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
      
      // Modified to focus on Indian news and problems
      const queries = [
        'India urban development',
        'India smart city',
        'India infrastructure',
        'Indian cities problems'
      ];
      
      const newsPromises = queries.map(query => 
        axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&sortBy=publishedAt&language=en`
        )
      );

      const responses = await Promise.all(newsPromises);
      const allArticles = responses.flatMap(response => response.data.articles);

      // Remove duplicates based on title
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.title, article])).values()
      );

      const processedNews = uniqueArticles
        .map((article: NewsItem) => ({
          ...article,
          category: categorizeNews(article),
          location: detectLocation(article)
        }))
        .slice(0, 30); // Limit to 30 articles for better performance

      setNews(processedNews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
      // Add some sample news for testing if API fails
      setNews(getSampleNews());
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
    <div className="min-h-screen bg-gray-900">
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <CarouselContainer 
            news={filteredNews}
            onSelectNews={setSelectedNews}
          />
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
                  src={selectedNews.urlToImage} 
                  alt={selectedNews.title} 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/640x360?text=No+Image+Available';
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