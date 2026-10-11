'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export interface GuestData {
  id?: string;
  slug?: string;
  nombre_mostrar: string;
  num_invitados: number;
  nombres_detallados?: string;
  tipo_invitacion?: string;
  estado_confirmacion?: boolean;
}

interface InvitationDetailsProps {
  guestData: GuestData;
}

// Variantes del contenedor para la cascada
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    }
  }
};

// Variante para el lazo (primero en animarse)
const bowVariant = {
  hidden: { x: -150, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" }
  }
};

// Componente Wrapper para estandarizar las secciones separadas
// Ahora con initial/whileInView propio para que animen al hacer scroll
const MotionSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={{
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut", delay }
      }
    }}
    className={`w-full flex flex-col items-center text-center ${className}`}
  >
    {children}
  </motion.div>
);

export default function InvitationDetails({ guestData }: InvitationDetailsProps) {
  const [isConfirmed, setIsConfirmed] = useState(guestData.estado_confirmacion || false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!guestData.slug) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invitados_babyshower')
        .update({ estado_confirmacion: true, fecha_confirmacion: new Date().toISOString() })
        .eq('slug', guestData.slug);

      if (error) throw error;
      setIsConfirmed(true);
    } catch (err) {
      console.error("Error al confirmar asistencia:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full py-32 px-4 flex flex-col items-center bg-white overflow-x-hidden">

      {/* Fondo que se replica en toda la invitación */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23FFE6E7' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center bg-transparent">

        {/* Lazo: Primera animación en ejecutarse */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { x: -150, opacity: 0 },
            visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
          }}
          className="absolute -top-48 left-0 -translate-x-1/3 md:-translate-x-1/4 -z-10 opacity-60 pointer-events-none w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
        >
          <Image
            src="/IMG_8672.PNG"
            alt="Lazo decorativo"
            fill
            className="object-contain object-top"
            priority
          />
        </motion.div>

        {/* Encabezado */}
        <MotionSection className="mt-48" delay={0.6}>
          <p className="font-playfair text-[10px] tracking-[0.2em] uppercase text-[#6B4E41] mb-2 relative z-10 font-bold">
            Acompáñanos a celebrar un dulce
          </p>
          <h1 className="font-playfair text-6xl tracking-widest uppercase text-[#6B4E41] relative z-10">
            Baby
          </h1>
          <h2 className="font-great-vibes text-8xl text-[#6B4E41] -mt-6 relative z-10" style={{ fontFamily: "'Great Vibes', cursive" }}>
            shower
          </h2>
        </MotionSection>

        {/* Homenajeada */}
        <MotionSection className="mt-16 relative z-10" delay={0.9}>
          <p className="font-playfair text-xs tracking-widest uppercase text-gray-500 mb-4">
            En honor a
          </p>
          <h3 className="font-great-vibes text-6xl text-[#b56a7f]" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Avril Elena
          </h3>
        </MotionSection>

        {/* Sección de Fecha EXACTA al diseño */}
        <MotionSection className="mt-16 relative z-10" delay={1.2}>
          <p className="font-playfair text-xs tracking-widest uppercase text-gray-500 mb-6">
            OCT
          </p>

          <div className="flex items-center justify-center w-full max-w-[280px]">

            {/* Columna Izquierda */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-8 h-[1px] bg-gray-300"></div>
              <span className="font-playfair text-sm tracking-widest uppercase text-gray-600">
                Sáb
              </span>
              <div className="w-8 h-[1px] bg-gray-300"></div>
            </div>

            {/* Círculo Central */}
            <div className="w-16 h-16 rounded-full bg-[#FFE6E7] text-[#6B4E41] flex items-center justify-center font-playfair text-2xl shadow-sm shrink-0 mx-4 font-bold">
              17
            </div>

            {/* Columna Derecha */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-8 h-[1px] bg-gray-300"></div>
              <span className="font-playfair text-sm tracking-widest uppercase text-gray-600 whitespace-nowrap">
                4:00 PM
              </span>
              <div className="w-8 h-[1px] bg-gray-300"></div>
            </div>

          </div>

          <p className="font-playfair text-xs tracking-widest text-gray-500 mt-6">
            2026
          </p>
        </MotionSection>

        {/* Banderines decorativos animados */}
        <motion.div
          initial={{ WebkitMaskPosition: '0% 0', maskPosition: '0% 0', x: 20 } as any}
          whileInView={{ WebkitMaskPosition: '100% 0', maskPosition: '100% 0', x: 0 } as any}
          viewport={{ once: true, amount: 0.6, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 45%, black 55%)',
            maskImage: 'linear-gradient(to right, transparent 45%, black 55%)',
            WebkitMaskSize: '200% 100%',
            maskSize: '200% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
          }}
          className="mt-16 -mb-24 w-full max-w-sm mx-auto relative z-0 flex justify-center px-4"
        >
          <Image
            src="/IMG_8674.PNG"
            alt="Banderines decorativos"
            width={350}
            height={100}
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* Ubicación */}
        <MotionSection className="mt-16 relative z-10">
          <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
            Ubicación
          </p>
          <p className="font-playfair text-sm tracking-widest uppercase text-gray-700 mb-2 leading-relaxed">
            Residencias el Sol, Urb. El Parque,<br />calle 2B.
          </p>
          <p className="font-playfair text-xs tracking-widest uppercase text-gray-500 mb-6">
            Detrás del C.C. París
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=10.068005,-69.2869704"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[#EB9EAB] text-[#EB9EAB] pb-1 font-playfair text-[10px] tracking-widest uppercase transition-colors hover:text-[#6B4E41] hover:border-[#6B4E41]"
          >
            Ver en Google Maps
          </a>
        </MotionSection>

        {/* Dress Code */}
        <MotionSection className="mt-32 relative z-10">
          <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
            Dress Code: Estilo Casual
          </p>
          <p className="font-playfair text-[11px] tracking-wider leading-relaxed text-gray-600 italic mb-6 max-w-[280px]">
            Nos encantaría que nos acompañes usando tonos de esta paleta de colores:
          </p>
          {/* Paleta de colores: Lazos animados en cascada */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.4 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-center justify-center -space-x-6 mt-4"
          >
            {[
              '/lazos-dresscode/great - 6.png',
              '/lazos-dresscode/great - 7.png',
              '/lazos-dresscode/great - 8.png',
              '/lazos-dresscode/great - 9.png',
              '/lazos-dresscode/great - 10.png',
              '/lazos-dresscode/great - 11.png',
              '/lazos-dresscode/great - 12.png',
            ].map((src, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5, ease: "easeOut" }
                  }
                }}
                className="relative w-[72px] h-[72px] drop-shadow-sm"
                style={{ zIndex: 10 - idx }}
              >
                <Image
                  src={src}
                  alt={`Color de vestimenta ${idx + 1}`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </MotionSection>

        {/* Datos del Invitado (Dinámico) */}
        <MotionSection className="mt-32 relative z-10">

          {/* Lazo gigante secundario de fondo */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            whileInView={{ opacity: 0.6, x: 0, rotate: -15 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 -right-60 md:-right-32 w-[480px] h-[480px] z-0 pointer-events-none"
          >
            <Image
              src="/IMG_8672.PNG"
              alt="Lazo secundario"
              fill
              className="object-contain object-bottom"
            />
          </motion.div>

          <div className="relative w-full max-w-[300px] border-t border-b border-gray-200 py-6 flex flex-col items-center">
            <p className="font-playfair text-[11px] tracking-[0.2em] text-gray-500 uppercase mb-3 relative z-10">
              Especialmente para:
            </p>
            <p className="font-playfair text-base tracking-widest text-gray-800 mb-1 relative z-10">
              {guestData.nombre_mostrar}
            </p>

            {guestData.tipo_invitacion === 'A' && (
              <p className="font-playfair text-[10px] tracking-widest text-[#EB9EAB] uppercase mt-2 relative z-10">
                Pase para {guestData.num_invitados} {guestData.num_invitados > 1 ? 'personas' : 'persona'}
              </p>
            )}

            {guestData.tipo_invitacion === 'B' && guestData.nombres_detallados && (
              <p className="font-playfair text-[11px] tracking-wider text-gray-500 mt-2 italic text-center max-w-[240px] relative z-10">
                {guestData.nombres_detallados}
              </p>
            )}
          </div>
        </MotionSection>

        {/* RSVP */}
        <MotionSection className="mt-32 relative z-10">
          <h3 className="font-great-vibes text-7xl text-[#EB9EAB] mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>Rsvp</h3>
          <p className="font-playfair text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
            Confirma tu asistencia
          </p>
          <p className="font-playfair text-xs tracking-wider text-gray-600 mb-8 max-w-[280px] leading-relaxed">
            Por favor, haznos saber si nos acompañarás antes del 10 de Octubre.
          </p>
          <motion.button
            whileTap={{ scale: isConfirmed || isLoading ? 1 : 0.95 }}
            disabled={isConfirmed || isLoading}
            onClick={handleConfirm}
            className={`w-[260px] py-3 flex justify-center items-center font-playfair text-sm tracking-widest uppercase rounded-full transition-colors duration-500 ease-in-out border ${isConfirmed
              ? 'bg-[#b56a7f] text-white border-[#b56a7f]'
              : 'bg-[#FFE6E7] text-[#6B4E41] border-[#FFE6E7] hover:bg-[#EB9EAB] hover:border-[#EB9EAB] hover:text-white'
              }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-[#6B4E41]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isConfirmed ? (
              'CONFIRMADO ✓'
            ) : (
              'Confirmar Asistencia'
            )}
          </motion.button>
        </MotionSection>

        {/* Mesa de Regalos */}
        <MotionSection className="mt-32 mb-16 relative z-10">
          <h3 className="font-great-vibes text-6xl text-[#6B4E41] mb-6" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Mesa de Regalos
          </h3>
          <p className="font-playfair text-xs tracking-wider text-gray-600 mb-8 max-w-[280px] leading-relaxed">
            Si deseas tener un detalle con Avril, hemos preparado una pequeña lista de sugerencias que puedes ver aquí:
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/babyshower/wishlist')}
            className="bg-transparent border border-[#EB9EAB] text-[#EB9EAB] px-10 py-4 font-playfair text-sm md:text-base tracking-widest uppercase rounded-full transition-colors duration-300 hover:bg-[#dda7b8] hover:text-white hover:border-[#dda7b8] drop-shadow-sm"
          >
            Ver Lista de Regalos
          </motion.button>
        </MotionSection>

      </div>

      {/* Detalle decorativo de fondo: Cajita de regalo gigante pegada al borde inferior */}
      <motion.img
        src="/IMG_8714.PNG"
        alt="Regalo decorativo"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="absolute bottom-0 -left-10 md:left-0 z-0 w-[520px] sm:w-[620px] md:w-[720px] opacity-85 pointer-events-none mix-blend-multiply"
      />
    </section>
  );
}

