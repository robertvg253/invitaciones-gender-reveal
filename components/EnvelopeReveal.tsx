'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeRevealProps {
  onComplete: () => void;
}

export default function EnvelopeReveal({ onComplete }: EnvelopeRevealProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handlePlay = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Iniciar el fade out a los 4 segundos
      if (videoRef.current.currentTime >= 4 && !isFading) {
        setIsFading(true);
      }
    }
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isFading && (
        <motion.div
          // 1. Todo el contenedor es clickeable
          onClick={handlePlay}
          className="fixed inset-0 z-50 bg-[#F9F8F6] flex items-center justify-center overflow-hidden cursor-pointer"
          // 4. Timing de salida prolongado a 0.8s
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          
          {/* 2. Contenedor del video */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Máscara CSS aplicada directamente al video para difuminar bordes duros */}
            <video
              ref={videoRef}
              src="/envelope.mp4"
              className="w-full h-[85vh] md:h-full object-contain"
              playsInline
              muted
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              style={{ 
                WebkitMaskImage: 'linear-gradient(transparent 2%, black 12%, black 80%, transparent 95%)', 
                maskImage: 'linear-gradient(transparent 2%, black 12%, black 80%, transparent 95%)' 
              }}
            />
          </div>
          
          {/* 3. Indicador animado centrado en la pantalla (Call to Action) */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                {/* Nuevo CTA reposicionado en la parte inferior */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none text-gray-400">
                  
                  {/* Flecha elegante hacia arriba con rebote */}
                  <div className="animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </div>
                  
                  {/* Texto sutil */}
                  <span className="font-playfair tracking-[0.3em] text-xs uppercase">
                    Toca para abrir
                  </span>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
