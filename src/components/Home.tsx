import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';

interface NewsApiResponse {
  articles: NewsItem[];
}

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
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Navigation items
  const navItems = [
    { name: 'Events', icon: '🎉', path: '/events' },
    { name: 'Emergency', icon: '🚨', path: '/emergency' },
    { name: 'Announcements', icon: '📢', path: '/announcements' },
    { name: 'Transportation', icon: '🚗', path: '/transport' },
    { name: 'Alerts', icon: '⚠', path: '/alerts' },
    { name: 'Ambulance', icon: '🚑', path: '/ambulance' },
  ];

  // Categories for news filtering
  const categories = ['all', 'city', 'health', 'transport', 'emergency', 'events'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY; // Get API key from environment variables
      const response = await axios.get<NewsApiResponse>(
        `https://newsapi.org/v2/everything?q=smart+city&apiKey=${API_KEY}`
      );

      // Basic ML-like processing for news relevance
      const processedNews = response.data.articles.map((article: NewsItem) => ({
        ...article,
        category: categorizeNews(article),
        relevanceScore: calculateRelevance(article)
      }));

      // Sort by relevance score
      const sortedNews = processedNews.sort((a: NewsItem, b: NewsItem) => 
        (b.relevanceScore || 0) - (a.relevanceScore || 0)
      );

      setNews(sortedNews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  // Basic categorization based on keywords
  const categorizeNews = (article: NewsItem): string => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    if (text.includes('emergency') || text.includes('accident')) return 'emergency';
    if (text.includes('transport') || text.includes('traffic')) return 'transport';
    if (text.includes('event') || text.includes('festival')) return 'events';
    if (text.includes('health') || text.includes('hospital')) return 'health';
    if (text.includes('city') || text.includes('urban')) return 'city';
    
    return 'all';
  };

  // Basic relevance scoring
  const calculateRelevance = (article: NewsItem): number => {
    let score = 0;
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    const keywords = ['smart city', 'technology', 'innovation', 'urban', 'development'];
    keywords.forEach(keyword => {
      if (text.includes(keyword)) score += 0.2;
    });

    const daysOld = (new Date().getTime() - new Date(article.publishedAt).getTime()) / (1000 * 3600 * 24);
    score += Math.max(0, 1 - daysOld / 30);

    return Math.min(1, score);
  };

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
      {/* Navbar */}
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

            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto pt-20 px-4">
        {/* Category Filters */}
        <div className="mb-8 flex space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news
              .filter(item => activeCategory === 'all' || item.category === activeCategory)
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.urlToImage && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.urlToImage}
                        alt={item.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 text-sm">{item.source.name}</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;