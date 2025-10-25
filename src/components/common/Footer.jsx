import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="Speedway 146 Logo" 
                className="h9 w-9 rounded-lg"
              />
              <span className="text-xl font-bold">SPEEDWAY146</span>
            </div>
            <p className="text-gray-300">
              Baytown's go-to spot for family fun! Experience exciting go-kart racing, bounce houses, and more in our welcoming environment.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/p/Speedway146-61575710985956/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/Speedway146/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@Speedway146"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-400 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-red-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-red-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-red-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-red-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-400 mt-1" />
                <span className="text-gray-300">
                  6750 N Highway 146, Baytown, TX 77523
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">(346) 932-1266</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">speedsway146@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hours of Operation</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-red-400 mt-1" />
                <div className="text-gray-300 text-sm">
                  <div><span className="font-medium">Thursday:</span> 5:00 PM – 10:30 PM</div>
                  <div><span className="font-medium">Friday:</span> 5:00 PM – 10:30 PM</div>
                  <div><span className="font-medium">Saturday:</span> 10:30 AM – 10:30 PM</div>
                  <div><span className="font-medium">Sunday:</span> 10:30 AM – 10:30 PM</div>
                  <div><span className="font-medium">Monday:</span> Closed</div>
                  <div><span className="font-medium">Tuesday:</span> Closed</div>
                  <div><span className="font-medium">Wednesday:</span> Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Speedway 146. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-red-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-red-400 text-sm">Terms of Service</a>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Design by <a href="https://taylorurl.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">TaylorURL.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
