'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Referencia = {
  id: number;
  img: string; // Placeholder or actual URL
  marca: string;
};

interface ReferenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'nina' | 'nino' | null;
  data: Referencia[];
}

export default function ReferenciaModal({ isOpen, onClose, type, data }: ReferenciaModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, type]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextSlide = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const item = data[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full h-[65vh] md:h-[60vh] max-w-lg bg-[#FCFBF9] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col items-center px-6 pb-8"
          >
            {/* Drag Pill */}
            <div className="w-12 h-1.5 bg-[#C5B39A]/40 rounded-full mt-4 mb-2" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-[#C5B39A]" />
            </button>

            {/* Title */}
            <h3 className="font-great-vibes text-3xl md:text-4xl text-[#706458] mt-2 mb-6">
              {type === 'nina' ? 'Team Niña' : 'Team Niño'}
            </h3>

            {/* Carousel Area */}
            {data.length > 0 ? (
              <div className="flex-1 w-full flex flex-col items-center justify-center relative">
                
                {/* Left Arrow */}
                {currentIndex > 0 && (
                  <button 
                    onClick={prevSlide}
                    className="absolute left-0 z-10 p-2 rounded-full bg-white/50 shadow-sm border border-[#C5B39A]/20 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#C5B39A]" />
                  </button>
                )}

                {/* Right Arrow */}
                {currentIndex < data.length - 1 && (
                  <button 
                    onClick={nextSlide}
                    className="absolute right-0 z-10 p-2 rounded-full bg-white/50 shadow-sm border border-[#C5B39A]/20 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-[#C5B39A]" />
                  </button>
                )}

                {/* Image */}
                <div className="w-full max-w-[240px] aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img 
                    src={item.img} 
                    alt={item.marca} 
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Brand Name (Outside image) */}
                <p className="font-playfair text-sm md:text-base text-gray-800 mt-6 tracking-wide text-center px-4 w-full leading-snug">
                  {item.marca}
                </p>

                {/* Dots indicator */}
                <div className="flex items-center gap-2 mt-6">
                  {data.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-6 bg-[#C5B39A]' : 'w-1.5 bg-[#C5B39A]/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No hay sugerencias disponibles.
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
