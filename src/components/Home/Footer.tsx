import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-['Syncopate'] text-xl text-white mb-4">ATLANTIS</h3>
            <p className="text-gray-400 text-sm">
              Building a smarter, more connected future through innovative urban solutions 
              and sustainable development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Syncopate'] text-lg text-white mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {['Emergency', 'Transport', 'Events', 'Weather', 'News'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-['Syncopate'] text-lg text-white mb-4">CONNECT</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="text-blue-400">Email:</span> contact@atlantis.city
              </p>
              <p className="text-gray-400">
                <span className="text-blue-400">Emergency:</span> 100
              </p>
              <div className="flex space-x-4 mt-4">
                {['Twitter', 'Facebook', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href={`#${social.toLowerCase()}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Atlantis Smart City. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;