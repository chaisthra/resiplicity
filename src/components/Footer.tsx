import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-900 text-cream mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl mb-4">Resiplicity</h3>
            <p className="text-cream/80 text-sm">
              Discover, create, and share your culinary masterpieces with our growing community of food enthusiasts.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-cream/80">
              <li><a href="#" className="hover:text-cream transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-cream/80">
              <li><a href="#" className="hover:text-cream transition-colors">Recipe Guide</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Cooking Tips</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cream transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center space-x-2 text-cream/80">
              <Mail className="w-4 h-4" />
              <a href="mailto:contact@resiplicity.com" className="hover:text-cream transition-colors">
                contact@resiplicity.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-cream/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cream/60 text-sm">
              © {currentYear} Resiplicity. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-cream/60 text-sm">
              <a href="#" className="hover:text-cream transition-colors">Privacy</a>
              <a href="#" className="hover:text-cream transition-colors">Terms</a>
              <a href="#" className="hover:text-cream transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};