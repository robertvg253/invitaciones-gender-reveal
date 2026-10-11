'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistTour() {
  const [showPopup, setShowPopup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificamos si ya vio el popup
    const hasSeenPopup = document.cookie.includes('wishlistPopupSeen=true');
    
    if (!hasSeenPopup) {
      // Mostrar el popup 3 segundos después de cargar la página
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Guardar la cookie para que no vuelva a aparecer (expira en 1 año)
    document.cookie = "wishlistPopupSeen=true; path=/; max-age=31536000";
    setShowPopup(false);
  };

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Fondo oscuro backdrop con fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup con entrada suave desde abajo (0.4s easeOut) */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#F9F8F6] p-8 rounded-3xl shadow-2xl max-w-md w-full relative text-center border border-[#e5e5e5] z-10"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#b56a7f] hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h2 className="font-['Playfair_Display'] text-2xl mb-4 text-[#b56a7f] font-bold">
              ¿Cómo funciona la Mesa de Regalos?
            </h2>
            
            <div className="text-left text-[#4a4a4a] text-sm space-y-4 mb-8">
              <p>
                <strong className="text-[#b56a7f]">✨ Regalos Únicos:</strong><br/>
                Al marcar un artículo como reservado, nos aseguras que Avril no reciba el mismo detalle dos veces. 
              </p>
              <p>
                <strong className="text-[#b56a7f]">🔒 Reserva Anónima:</strong><br/>
                Tu reserva es secreta en la lista, pero bloquea el artículo para que sea tu regalo exclusivo.
              </p>
              <p>
                <strong className="text-[#b56a7f]">🎁 Detalles Infinitos:</strong><br/>
                Cualquier otro detalle nacido de tu corazón es bienvenido. ¡Por favor ponle una tarjetita a tu regalo físico para poder agradecerte! 💕
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#b56a7f] hover:bg-[#a05a6f] text-white py-3 rounded-full font-bold shadow-md transition-colors"
            >
              ¡Entendido!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
