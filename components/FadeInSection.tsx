'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeInSection({ 
  children, 
  delay = 0 
}: { 
  children: ReactNode; 
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, delay }}
      className="w-full flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
