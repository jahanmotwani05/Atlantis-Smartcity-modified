import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  id: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // FAQ database
  const faqs = {
    "what is atlantis": "Atlantis is an innovative smart city platform designed to enhance urban living through technology.",
    "features": `Our smart city features include:
    • Real-time traffic monitoring
    • Smart waste management
    • Energy consumption tracking
    • Emergency response system
    • Community engagement portal`,
    "transportation": `Our transportation services offer:
    • Live bus/metro tracking
    • Smart parking locations
    • Traffic updates
    • Bike-sharing system`,
    "waste": `Our waste management includes:
    • Automated collection
    • Smart bin monitoring
    • Recycling programs
    • Waste sorting guides`,
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate unique ID for messages
  const generateId = () => Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "👋 Hello! I'm your Atlantis Smart City Assistant. Ask me anything about our services, or type 'help' for available topics!",
        isUser: false,
        id: generateId()
      }]);
    }
  }, [isOpen]);

  const checkFAQs = (input: string): string | null => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput === 'help') {
      return "I can help you with:\n• Smart City Features\n• Transportation Services\n• Waste Management\n• Energy Systems\n\nWhat would you like to know about?";
    }

    for (const [key, value] of Object.entries(faqs)) {
      if (lowercaseInput.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const getAIResponse = async (userInput: string) => {
    // First check FAQs
    const faqResponse = checkFAQs(userInput);
    if (faqResponse) return faqResponse;

    // Simple mock response generation
    const mockResponses = [
      "Our smart city is designed to improve urban living through innovative technologies.",
      "Atlantis focuses on sustainable urban solutions, including smart transportation and energy management.",
      "We're committed to creating more efficient and connected urban environments.",
      "Our smart city platform integrates various services to enhance citizen experiences.",
      "Transportation, waste management, and energy systems are key focus areas of our smart city initiative."
    ];

    // Simulate async response with a random delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Return a random mock response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { 
      text: input, 
      isUser: true, 
      id: generateId() 
    };

    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await getAIResponse(input);
      const aiMessage: Message = { 
        text: response || "I'm sorry, I couldn't process that request.", 
        isUser: false,
        id: generateId()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage: Message = {
        text: "Oops! Something went wrong. Please try again.",
        isUser: false,
        id: generateId()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className={`bg-blue-600 text-white rounded-full p-4 shadow-lg 
          transition-all duration-300 hover:shadow-xl hover:scale-105 transform
          ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
          ${isAnimating ? 'pointer-events-none' : ''}`}
      >
        <MessageCircle size={24} className="animate-pulse" />
      </button>

      <div
        className={`absolute bottom-0 right-0 transition-all duration-300 transform
          ${isOpen 
            ? 'scale-100 opacity-100 animate-[slideInUp_0.3s_ease-out]' 
            : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col backdrop-blur-sm border border-gray-800">
          {/* Header */}
          <div className="bg-gray-950 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <h3 className="font-semibold text-lg animate-[fadeIn_0.3s_ease-out]">Atlantis Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-gray-800 p-2 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900 scrollbar-thin scrollbar-thumb-blue-600">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2 
                  animate-[typeIn_0.3s_ease-out] origin-bottom 
                  ${msg.isUser ? 'animate-[slideInRight_0.3s_ease-out]' : 'animate-[slideInLeft_0.3s_ease-out]'}`}
              >
                {!msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm 
                    animate-[popIn_0.3s_ease-out]">
                    A
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 relative 
                    ${msg.isUser 
                      ? 'bg-blue-600 text-white shadow-md rounded-br-none' 
                      : 'bg-gray-800 text-white rounded-bl-none'}
                    animate-[scaleIn_0.3s_ease-out]`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator with Enhanced Animation */}
            {isLoading && (
              <div className="flex justify-start items-center space-x-2 
                animate-[slideInLeft_0.3s_ease-out]">
                <Loader2 
                  size={20} 
                  className="text-blue-500 animate-spin" 
                />
                <div className="bg-gray-800 text-white rounded-lg p-3 
                  animate-[pulse_1.5s_infinite]">
                  Analyzing your request...
                </div>
              </div>
            )}
            
            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area with Enhanced Interactivity */}
          <div className="border-t border-gray-800 p-6 bg-gray-900 rounded-b-2xl">
            <div className="flex space-x-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Atlantis..."
                disabled={isLoading}
                className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-full px-6 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-300 hover:border-blue-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  animate-[slideInUp_0.3s_ease-out]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`bg-blue-600 text-white rounded-full p-3 
                  hover:shadow-lg transition-all duration-200 hover:scale-110 transform
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group flex items-center justify-center
                  animate-[slideInRight_0.3s_ease-out]`}
              >
                <Send 
                  size={20} 
                  className="group-hover:rotate-12 transition-transform duration-300" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

// Custom Tailwind animations
const customAnimations = `
@keyframes typeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;