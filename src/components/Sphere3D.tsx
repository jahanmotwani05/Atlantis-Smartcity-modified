import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Sphere3D: React.FC = () => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: '150px',
        height: '150px',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {/* Create sphere using multiple circles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full rounded-full border border-blue-500/30"
          style={{
            transform: `rotateY(${i * 15}deg) rotateX(${i * 15}deg)`,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), transparent)',
          }}
        />
      ))}
    </motion.div>
  );
};

export default Sphere3D;