import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';  // Add this import
import AnimatedTagline from './AnimatedTagline';

gsap.registerPlugin(ScrollTrigger);

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
}> = ({ item, index }) => {
  return (
    <div
      className={`
        news-card
        flex-shrink-0
        w-[400px]
        bg-gray-800/90
        backdrop-blur-sm
        rounded-xl
        overflow-hidden
        border
        border-gray-700/50
        shadow-[0_0_20px_rgba(0,0,0,0.3)]
        transition-all
        duration-300
        ease-out
        hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
        hover:border-blue-500/30
      `}
    >
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
        <div className="p-4">
          <h3 className="font-['Syncopate'] text-lg font-semibold text-white mb-2 tracking-wide">
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-3">{item.description}</p>
          <div className="mt-4 text-sm text-gray-400">
            {new Date(item.publishedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
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
 
const NewsHeading: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top center+=200",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div 
      ref={headingRef}
      className="text-center mb-12"
    >
      <h2 className="font-['Syncopate'] text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 tracking-wider uppercase">
        Latest News
      </h2>
      <div className="w-24 h-1 bg-blue-500/50 mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Add auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
 
      interface NewsApiResponse {
        articles: NewsItem[];
        status: string;
        totalResults: number;
      }
 
      const responses = await Promise.all(newsPromises);
 
      // Log the API response for debugging
      console.log('API Responses:', responses.map(r => r.data));
 
      const allArticles = responses.flatMap(response => 
        (response.data as NewsApiResponse).articles || []
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
 
  const filteredNews = news.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  useEffect(() => {
    if (containerRef.current && trackRef.current && filteredNews.length > 0) {
      // Reset any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      
      const track = trackRef.current;
      const cards = track.children;
      const totalWidth = (cards.length * 420) - window.innerWidth; // 400px card + 20px gap
  
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Optional: Update card opacity based on position
            Array.from(cards).forEach((card, i) => {
              const progress = self.progress;
              const cardProgress = (i / (cards.length - 1));
              const distance = Math.abs(progress - cardProgress);
              gsap.to(card, {
                opacity: 1 - Math.min(distance * 2, 0.6),
                duration: 0.2
              });
            });
          }
        }
      });
    }
  }, [filteredNews]);
 
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(".news-container", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, [filteredNews.length]);
 
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Smart City Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
        
        {/* Floating Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-[100px] bg-blue-500/20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatingCircuit ${10 + i * 2}s linear infinite`,
                  transform: `rotate(${i * 60}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Digital Rain Effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
              style={{
                left: `${i * 10}%`,
                animation: `digitalRain ${5 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Update styles to remove cyber-pulse animation */}
      <style>{`
        @keyframes floatingCircuit {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-1000px) translateX(1000px); opacity: 0; }
        }

        @keyframes digitalRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <Navbar currentUser={currentUser || ''} />
      
      {/* Add AnimatedTagline here, after Navbar but before main content */}
      <div className="relative z-10">
        <AnimatedTagline />
      </div>

      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Update category buttons background */}
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
                    : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800/50'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Add the NewsHeading component */}
          <NewsHeading />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">Loading news...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden">
            <div 
              ref={trackRef}
              className="absolute top-1/2 left-0 -translate-y-1/2 flex gap-5 pl-[10vw]"
              style={{ 
                willChange: 'transform',
                paddingRight: '10vw' // Add right padding for last card
              }}
            >
              {filteredNews.map((item, index) => (
                <NewsCard
                  key={item.title + index}
                  item={item}
                  index={index}
                />
              ))}
            </div>
            
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              Scroll to explore more news
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-lg">No news found for this category</p>
          </div>
        )}

        {/* Required for scrolling - adjust height based on content */}
        <div style={{ height: `${filteredNews.length * 100}vh` }} />
      </main>

      {/* Update modal background */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-6 max-w-4xl mx-auto border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-['Syncopate'] text-2xl font-bold text-white tracking-wide">
                  {selectedNews.title}
                </h2>
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