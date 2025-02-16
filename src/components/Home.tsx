import React, { useState, useEffect } from 'react';
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
  content?: string;
}

interface User {
  login: string;
  photoURL?: string;
}

// Add the carousel styles
const carouselStyles = {
  container: {
    perspective: '1000px',
    transformStyle: 'preserve-3d' as 'preserve-3d'
  },
  card: {
    transformOrigin: 'center center -300px',
    transition: 'transform 0.4s ease'
  }
};

// News Modal Component
const NewsModal: React.FC<{ item: NewsItem; onClose: () => void }> = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center"
        >
          <div className="bg-gray-800 rounded-2xl overflow-hidden max-w-4xl w-full">
            {item.urlToImage && (
              <div className="w-full h-[400px] overflow-hidden">
                <img
                  src={item.urlToImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1200x400?text=No+Image+Available';
                  }}
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-blue-400">{item.source.name}</span>
                  {item.location && (
                    <span className="text-emerald-400">📍 {item.location}</span>
                  )}
                </div>
                <span className="text-gray-400">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-3xl text-white font-semibold mb-4">{item.title}</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">{item.description}</p>
                <p className="text-gray-300 whitespace-pre-line">{item.content}</p>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Read Full Article ↗
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// News Card Component
const NewsCard: React.FC<{ 
  item: NewsItem; 
  index: number; 
  active: number;
  onClick: () => void;
}> = ({ item, index, active, onClick }) => {
  const offset = index - active;
  
  return (
    <motion.div
      initial={false}
      animate={{
        scale: offset === 0 ? 1 : 0.9,
        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2,
        zIndex: 10 - Math.abs(offset),
        x: `${offset * 50}%`,
        rotateY: `${offset * -25}deg`,
      }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '600px',
        left: '50%',
        transform: 'translateX(-50%)',
        ...carouselStyles.container
      }}
      whileHover={{ scale: offset === 0 ? 1.02 : 0.92 }}
      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {item.urlToImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={item.urlToImage}
            alt={item.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
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
          <div className="flex items-center space-x-2">
            {item.location && (
              <span className="text-emerald-400 text-sm">📍 {item.location}</span>
            )}
            <span className="text-gray-400 text-sm">
              {new Date(item.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <h3 className="text-xl text-white font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <button
            className="inline-block bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-md text-sm font-medium"
          >
            Read More
          </button>
          {item.category !== 'all' && (
            <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              {item.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentUser] = useState<User>({ login: 'abhinavx04' });

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(filteredNews.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [news, activeCategory]);

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Add the fetchNews function
  const fetchNews = async () => {
    try {
      const response = await axios.get('YOUR_NEWS_API_ENDPOINT');
      const newsData = response.data.articles.map((article: any) => ({
        ...article,
        category: detectCategory(article.title + ' ' + article.description),
        relevanceScore: calculateRelevance(article.title + ' ' + article.description),
        location: detectLocation(article.title + ' ' + article.description)
      }));
      setNews(newsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  // Add helper functions
  const detectCategory = (text: string): string => {
    // Implement your category detection logic
    return 'all';
  };

  const calculateRelevance = (text: string): number => {
    // Implement your relevance calculation logic
    return 1;
  };

  const detectLocation = (text: string): string | undefined => {
    // Implement your location detection logic
    return undefined;
  };

  const filteredNews = news.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
              <div className="text-gray-400 text-sm hidden md:flex items-center space-x-4">
                <span>{formatDateTime(currentTime)} UTC</span>
                <span className="text-blue-400">{currentUser.login}</span>
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

      <main className="container mx-auto pt-20 px-4 pb-16">
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
              {filteredNews.map((item, index) => (
                <NewsCard
                  key={index}
                  item={item}
                  index={index}
                  active={activeIndex}
                  onClick={() => setSelectedNews(item)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 rounded-full transition-colors flex items-center space-x-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                <span>Previous</span>
              </button>
              <button
                onClick={() => setActiveIndex(prev => Math.min(filteredNews.length - 1, prev + 1))}
                disabled={activeIndex === filteredNews.length - 1}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 rounded-full transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </main>

      {selectedNews && (
        <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
};

export default Home;