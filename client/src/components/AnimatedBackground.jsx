import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Temporarily disabled to fix blue screen issue
  // Can be re-enabled with very subtle opacity if needed
  return null;
  
  /* Original code - disabled
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-purple-400/2 dark:bg-purple-500/1 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-96 h-96 bg-pink-400/2 dark:bg-pink-500/1 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
  */
};

export default AnimatedBackground;

