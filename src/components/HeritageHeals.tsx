import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

export const HeritageHeals: React.FC = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Utensils className="w-24 h-24 mx-auto text-brown-600 mb-8" />
        </motion.div>
        <h2 className="font-display text-4xl md:text-5xl text-brown-800 mb-6">
          Heritage Heals
        </h2>
        <p className="text-xl md:text-2xl text-brown-600 mb-4">
          Where Tradition Meets Wellness
        </p>
        <p className="text-brown-500 max-w-md mx-auto">
          Coming soon: Discover the healing power of ancestral recipes and cultural food wisdom.
        </p>
      </motion.div>
    </div>
  );
};