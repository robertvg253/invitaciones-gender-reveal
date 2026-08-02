'use client';

import { motion } from 'framer-motion';

export default function DressCodePalette() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.35, 
        delayChildren: 0.5 
      } 
    }
  };

  const circleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: 'spring', stiffness: 80, damping: 16 } 
    }
  };

  const colors = [
    { bg: 'bg-[#FFFFFF]', z: 'z-[1]' },
    { bg: 'bg-[#F4F1EA]', z: 'z-[2]' },
    { bg: 'bg-[#E8D8C4]', z: 'z-[3]' },
    { bg: 'bg-[#C5B39A]', z: 'z-[4]' },
    { bg: 'bg-[#9E8268]', z: 'z-[5]' },
  ];

  return (
    <motion.div 
      className="flex -space-x-3 md:-space-x-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1 }}
    >
      {colors.map((color, index) => (
        <motion.div 
          key={index}
          variants={circleVariants}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-sm border border-black/5 ${color.bg} relative ${color.z}`}
        />
      ))}
    </motion.div>
  );
}
