'use client';

import { useState } from 'react';
import FadeInSection from '@/components/FadeInSection';
import { Heart } from 'lucide-react';
import ReferenciaModal, { Referencia } from './ReferenciaModal';

const marcasNina: Referencia[] = [
  { id: 1, marca: 'Pañal Farmatodo Premium Etapa 1 Talla P 30 Und', img: '/pañales-farmatodo-etapa1.PNG' },
  { id: 2, marca: 'Pañal Farmatodo Premium Etapa 2 Talla M x 30 und', img: '/pañales-farmatodo-etapa2.PNG' },
  { id: 3, marca: 'Pañal Huggies Natural Care Etapa 0 Talla RN x 20 und', img: '/pañales-huggies.PNG' },
  { id: 4, marca: 'Pañal Winny Ultratrim Sec Etapa 2 Talla M x 30 und + Toallas Húmedas x 20 und', img: '/pañales-winny.PNG' }
];

const marcasNino: Referencia[] = [
  { id: 1, marca: 'Crema Antipanalitis Overskin 13% x 50 gr', img: '/crema-overskin13.PNG' },
  { id: 2, marca: 'Crema Overskin Antipanalitis 40% 50Gr', img: '/crema-overskin40.PNG' },
  { id: 3, marca: 'Toallas Humedas Uppy Sensitive 60Und', img: '/toallas-uppy.PNG' },
  { id: 4, marca: 'Toallas Húmedas Farmatodo Bebé Premium 99% Agua x 72 und', img: '/toallas-farmatodo.PNG' },
  { id: 5, marca: 'Toallas Humedas Uppy Shea Butter 72Und', img: '/toallas-uppy-sheabutter.PNG' }
];

export default function DinamicaRegalos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'nina' | 'nino' | null>(null);

  const openModal = (type: 'nina' | 'nino') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalType(null), 300); // Wait for exit animation
  };

  return (
    <>
      <FadeInSection delay={0.3}>
        <div className="flex flex-col items-center mb-16 md:mb-24 w-full">
          {/* Cabecera */}
          <div className="text-center mb-10 flex flex-col items-center">
            <p className="font-playfair text-[10px] md:text-[12px] tracking-[0.2em] text-gray-800 uppercase">
              QUEREMOS SABER
            </p>
            <h2 className="font-great-vibes text-[3.5rem] text-[#706458] -mt-1 md:-mt-2 mb-2 leading-none">
              tu predicción
            </h2>
            <p className="font-playfair text-[11px] md:text-[12px] text-gray-600 italic px-4">
              ¡Elige tu bando y trae un obsequio representativo para el bebé!
            </p>
          </div>

          {/* Grid Dividido */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-6 items-stretch w-full max-w-[340px] md:max-w-[440px]">
            {/* Team Niña */}
            <div className="flex flex-col items-center text-center h-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#C5B39A] mb-3">
                <path d="M3 6h18l-1.5 9c-1 3-4 5-7.5 5s-6.5-2-7.5-5L3 6z" />
                <path d="M3 6c2 4 4.5 6 9 6s7-2 9-6" />
                <path d="M8 9h2" />
                <path d="M14 9h2" />
              </svg>
              <h3 className="font-great-vibes text-3xl md:text-4xl text-[#706458] mb-2">Team Niña</h3>
              <p className="font-playfair text-base md:text-lg text-gray-600">
                (Trae pañales)
              </p>
              <button
                onClick={() => openModal('nina')}
                className="mt-auto pt-3 font-playfair font-semibold text-[9px] md:text-[10px] tracking-[0.2em] text-[#C5B39A] uppercase border-b border-[#C5B39A] pb-[2px] transition-colors hover:text-gray-600 hover:border-gray-600 focus:outline-none"
              >
                VER MARCAS SUGERIDAS
              </button>
            </div>

            {/* Divisor */}
            <div className="flex flex-col items-center justify-center pt-2 h-full">
              <div className="w-[1px] h-10 md:h-14 bg-[#C5B39A] opacity-60"></div>
              <Heart className="w-3.5 h-3.5 text-[#C5B39A] fill-[#C5B39A] my-3 animate-heartbeat origin-center" />
              <div className="w-[1px] h-10 md:h-14 bg-[#C5B39A] opacity-60"></div>
            </div>

            {/* Team Niño */}
            <div className="flex flex-col items-center text-center h-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#C5B39A] mb-3">
                <rect x="9" y="3" width="6" height="3" rx="1" />
                <path d="M7 6h10l-1.5 15h-7L7 6z" />
                <circle cx="12" cy="14" r="2" />
              </svg>
              <h3 className="font-great-vibes text-3xl md:text-4xl text-[#706458] mb-2">Team Niño</h3>
              <p className="font-playfair text-base md:text-lg text-gray-600">
                (Trae toallitas húmedas<br />+ crema para pañalitis)
              </p>
              <button
                onClick={() => openModal('nino')}
                className="mt-auto pt-3 font-playfair font-semibold text-[9px] md:text-[10px] tracking-[0.2em] text-[#C5B39A] uppercase border-b border-[#C5B39A] pb-[2px] transition-colors hover:text-gray-600 hover:border-gray-600 focus:outline-none"
              >
                VER MARCAS SUGERIDAS
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Render the modal */}
      <ReferenciaModal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        data={modalType === 'nina' ? marcasNina : modalType === 'nino' ? marcasNino : []}
      />
    </>
  );
}
