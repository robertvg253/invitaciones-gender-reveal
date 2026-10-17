'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Check, X, Trophy, Sparkles, Award, Play } from 'lucide-react';

const palabrasJuego = [
  { scrambled: 'BAEROB', original: 'BABERO' },
  { scrambled: 'EPETUCH', original: 'CHUPETE' },
  { scrambled: 'OCHCEITOC', original: 'COCHECITO' },
  { scrambled: 'BIÓNBER', original: 'BIBERÓN' },
  { scrambled: 'LÑAAP', original: 'PAÑAL' },
  { scrambled: 'NCUA', original: 'CUNA' },
  { scrambled: 'EGAATR', original: 'GATEAR' },
  { scrambled: 'BLBAEOUC', original: 'BALBUCEO' },
  { scrambled: 'DNTIEE ED CHELE', original: 'DIENTE DE LECHE' },
  { scrambled: 'NAAN', original: 'NANA' },
  { scrambled: 'NAJESORO', original: 'SONAJERO' },
  { scrambled: 'ÓVIML', original: 'MÓVIL' }
];

// Función para normalizar texto (ignora mayúsculas/minúsculas y acentos)
function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export default function JuegoClient() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [answers, setAnswers] = useState<string[]>(() => new Array(palabrasJuego.length).fill(''));
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Arreglo de useRefs para cada input de la lista
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clave en localStorage para asegurar UNA SOLA JUGADA sin recargar contador
  const STORAGE_KEY = 'babyshower_game_palabras_desordenadas';

  // Verificar si ya se jugó previamente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isFinished) {
          setAnswers(parsed.answers || new Array(palabrasJuego.length).fill(''));
          setTimeLeft(0);
          setIsPlaying(false);
          setIsFinished(true);
        }
      }
    } catch (e) {
      console.error('Error leyendo estado del juego:', e);
    }
  }, []);

  // Temporizador: decrementa cada 1s cuando isPlaying está activo
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isFinished, answers]);

  // Finalizar juego y persistir resultado de forma estricta
  const finishGame = (finalAnswers: string[]) => {
    setIsPlaying(false);
    setIsFinished(true);
    setShowModal(true);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isFinished: true,
          answers: finalAnswers
        })
      );
    } catch (e) {
      console.error('Error guardando partida:', e);
    }
  };

  // Comenzar el juego
  const handleStartGame = () => {
    if (isFinished) return;

    setAnswers(new Array(palabrasJuego.length).fill(''));
    setTimeLeft(60);
    setIsPlaying(true);
    setShowModal(false);

    // Auto-focus en el primer input optimizado para experiencia móvil
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
  };

  // Terminar si el usuario llena todo o presiona terminar
  const handleFinishEarly = () => {
    finishGame(answers);
  };

  // Manejador del cambio de texto
  const handleInputChange = (index: number, val: string) => {
    const updated = [...answers];
    updated[index] = val;
    setAnswers(updated);
  };

  // Evaluación de acierto individual
  const isCorrect = (index: number): boolean => {
    const answer = answers[index];
    if (!answer || !answer.trim()) return false;
    return normalizeText(answer) === normalizeText(palabrasJuego[index].original);
  };

  // Cálculo del puntaje total
  const score = palabrasJuego.reduce((acc, _, index) => {
    return isCorrect(index) ? acc + 1 : acc;
  }, 0);

  // Cantidad de palabras respondidas
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-800 flex flex-col items-center pt-[max(env(safe-area-inset-top),2.5rem)] pb-16 px-4 sm:px-6 relative selection:bg-[#EB9EAB] selection:text-white">
      {/* Fondo con textura sutil en armonía con el baby shower */}
      <div
        className="fixed inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23FFE6E7' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Contenedor principal */}
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        
        {/* Encabezado elegante */}
        <div className="text-center mb-6 mt-2">
          <p className="font-playfair text-[11px] tracking-[0.25em] uppercase text-[#6B4E41] font-semibold mb-1">
            Baby Shower de Avril
          </p>
          <h1 className="font-great-vibes text-5xl sm:text-6xl text-[#6B4E41] mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Palabras Desordenadas
          </h1>
          <p className="font-playfair text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Ordena las letras para descubrir las 12 palabras de bebé antes de que el tiempo se agote.
          </p>
        </div>

        {/* Tarjeta de Inicio: Solo visible antes de jugar */}
        {!isPlaying && !isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/95 backdrop-blur-xs border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-sm text-center mb-6 flex flex-col items-center relative z-20"
          >
            <div className="w-16 h-16 rounded-full bg-[#FFE6E7] text-[#b56a7f] flex items-center justify-center mb-4 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#6B4E41] mb-2 tracking-wide">
              ¿Listo para el desafío?
            </h2>
            <div className="text-xs text-gray-600 font-playfair space-y-2 mb-6 max-w-sm text-left bg-[#FDFBF9] p-4 rounded-2xl border border-gray-100">
              <p className="flex items-center gap-2">
                <span className="text-[#b56a7f] font-bold">⏱</span> Tienes <strong className="text-gray-800">60 segundos</strong> en el reloj.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#b56a7f] font-bold">⌨️</span> Presiona <strong className="text-gray-800">&quot;Siguiente&quot;</strong> en tu teclado para saltar al siguiente campo automáticamente.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#b56a7f] font-bold">🎯</span> Solo tienes <strong>una oportunidad</strong>. ¡Da lo mejor de ti!
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleStartGame}
              className="w-full sm:w-auto px-10 py-4 bg-[#b56a7f] hover:bg-[#a0556b] text-white rounded-full font-playfair text-sm tracking-widest uppercase font-semibold shadow-md shadow-pink-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Comenzar Juego</span>
            </motion.button>
          </motion.div>
        )}

        {/* 
          Barra flotante de Control:
          Ajustada con top-[max(env(safe-area-inset-top),1.5rem)] y top-12
          para garantizar compatibilidad total con Dynamic Island en iPhones nuevos
        */}
        {(isPlaying || isFinished) && (
          <div className="sticky top-[max(env(safe-area-inset-top),1.5rem)] top-12 z-30 w-full mb-6 bg-white/95 backdrop-blur-md border border-pink-200/80 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 transition-all">
            {/* Temporizador */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-colors duration-300 ${
                  isFinished
                    ? 'bg-gray-100 text-gray-500'
                    : timeLeft <= 10
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : 'bg-[#FFE6E7] text-[#b56a7f]'
                }`}
              >
                <Timer className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-playfair text-[10px] tracking-widest uppercase text-gray-500">
                  {isFinished ? 'Juego Finalizado' : 'Tiempo Restante'}
                </span>
                <span
                  className={`font-mono text-lg font-bold leading-tight ${
                    isFinished
                      ? 'text-gray-600'
                      : timeLeft <= 10
                      ? 'text-rose-600 animate-pulse'
                      : 'text-[#6B4E41]'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Contador de progreso / Botón de Acción */}
            <div className="flex items-center gap-2">
              {isPlaying && (
                <>
                  <span className="hidden sm:inline-block font-playfair text-xs text-gray-500 mr-1">
                    {answeredCount} de {palabrasJuego.length}
                  </span>
                  <button
                    onClick={handleFinishEarly}
                    className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#b56a7f] border border-pink-200 rounded-full font-playfair text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Terminar
                  </button>
                </>
              )}

              {isFinished && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-[#b56a7f] hover:bg-[#a0556b] text-white rounded-full font-playfair text-xs tracking-wider uppercase font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Puntaje ({score}/12)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 
          Lista del Juego:
          OFUSCADO CON BLUR cuando el juego aún no ha iniciado (!isPlaying && !isFinished).
          Se revela quitando el blur inmediatamente al cambiar isPlaying === true.
        */}
        <div
          className={`w-full bg-white border border-pink-100 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col gap-3.5 mb-10 transition-all duration-500 ${
            !isPlaying && !isFinished
              ? 'blur-md opacity-40 select-none pointer-events-none'
              : 'blur-0 opacity-100'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
            <span className="font-playfair text-xs tracking-wider uppercase text-gray-400 font-semibold">
              Palabra Desordenada
            </span>
            <span className="font-playfair text-xs tracking-wider uppercase text-gray-400 font-semibold">
              Tu Respuesta
            </span>
          </div>

          {palabrasJuego.map((item, index) => {
            const correct = isCorrect(index);
            const userVal = answers[index] || '';
            const isUserEmpty = userVal.trim().length === 0;

            // Clases dinámicas: text-[16px] (16px mínimo) para prevenir zoom automático en Safari iOS
            let inputClasses =
              'w-full px-3.5 py-3 rounded-xl font-medium text-[16px] tracking-wide transition-all duration-200 outline-none ';

            if (isFinished) {
              if (correct) {
                inputClasses +=
                  'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-semibold';
              } else {
                inputClasses +=
                  'bg-red-50/80 border-2 border-red-400 text-red-600 ' +
                  (!isUserEmpty ? 'line-through decoration-red-500 decoration-2' : '');
              }
            } else if (isPlaying) {
              inputClasses +=
                'bg-white border-2 border-gray-200 text-gray-800 focus:border-[#b56a7f] focus:bg-[#FFFDFD] focus:ring-2 focus:ring-[#b56a7f]/20';
            } else {
              inputClasses += 'bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed';
            }

            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-2xl transition-colors ${
                  isFinished
                    ? correct
                      ? 'bg-emerald-50/40 border border-emerald-100'
                      : 'bg-red-50/30 border border-red-100'
                    : 'hover:bg-[#FAF8F5]'
                }`}
              >
                {/* Lado Izquierdo: Número + Palabra Desordenada en Mayúsculas y Negrita */}
                <div className="flex items-center gap-2.5 sm:w-5/12 shrink-0">
                  <span className="w-6 h-6 rounded-full bg-[#FFE6E7] text-[#6B4E41] text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="bg-[#F6F2EE] border border-[#EBE3DC] px-3 py-1.5 rounded-xl font-mono tracking-widest uppercase font-black text-gray-800 text-sm sm:text-base select-none shadow-2xs">
                    {item.scrambled}
                  </div>
                </div>

                {/* 
                  Lado Derecho: Input con tamaño 16px (sin zoom en iOS),
                  enterKeyHint="next" y auto-focus al siguiente input al presionar Enter
                */}
                <div className="w-full sm:w-7/12 flex flex-col relative">
                  <div className="relative flex items-center">
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      disabled={!isPlaying || isFinished}
                      value={userVal}
                      placeholder={isPlaying ? 'Escribe aquí...' : '••••••'}
                      enterKeyHint="next"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (index < palabrasJuego.length - 1) {
                            inputRefs.current[index + 1]?.focus();
                          } else {
                            // En el último campo, Enter termina el juego
                            handleFinishEarly();
                          }
                        }
                      }}
                      className={inputClasses}
                    />

                    {/* Ícono de feedback en evaluación */}
                    {isFinished && (
                      <div className="absolute right-3 pointer-events-none flex items-center">
                        {correct ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs">
                            <X className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Si es incorrecto o vacío, mostrar la respuesta correcta en pequeñito al lado/debajo */}
                  {isFinished && !correct && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-1.5 mt-1.5 px-1"
                    >
                      <span className="text-[11px] font-playfair uppercase tracking-wider text-gray-500">
                        Correcta:
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {item.original}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        Modal Final Estricto (Una sola jugada):
        Solo muestra el puntaje final y el botón "VER RESPUESTAS".
        Sin opción de "Jugar de nuevo" ni "Volver a la invitación".
      */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-pink-100 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Adornos festivos de fondo */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFE6E7] rounded-full blur-2xl opacity-60 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

              <div className="w-20 h-20 rounded-full bg-[#FFE6E7] text-[#b56a7f] flex items-center justify-center mb-4 shadow-inner">
                {score >= 10 ? (
                  <Trophy className="w-10 h-10 animate-bounce" />
                ) : score >= 6 ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <Sparkles className="w-10 h-10" />
                )}
              </div>

              <span className="font-great-vibes text-4xl sm:text-5xl text-[#6B4E41] mb-1" style={{ fontFamily: "'Great Vibes', cursive" }}>
                ¡Tiempo!
              </span>

              {/* Banner festivo con puntaje exacto */}
              <div className="bg-[#FAF5F2] border border-[#EFE5DD] rounded-2xl px-6 py-3 my-3 w-full">
                <p className="font-playfair text-base sm:text-lg font-bold text-[#6B4E41] tracking-wide">
                  Lograste <span className="text-[#b56a7f] text-2xl font-black">{score}</span> de{' '}
                  <span className="text-gray-800 text-xl font-black">{palabrasJuego.length}</span>{' '}
                  puntos
                </p>
              </div>

              <p className="font-playfair text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
                {score === 12
                  ? '¡Impresionante! ¡Descifraste todas las palabras a la perfección! 🏆👶'
                  : score >= 9
                  ? '¡Excelente trabajo! Tienes una agilidad increíble para las cosas de bebé. ✨'
                  : score >= 6
                  ? '¡Muy bien jugado! Lograste una gran puntuación en este desafío. 👏'
                  : '¡Gracias por participar! Un juego lleno de emoción para celebrar a Avril. 💕'}
              </p>

              {/* Único botón permitido en el modal: VER RESPUESTAS */}
              <div className="w-full">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 bg-[#b56a7f] hover:bg-[#a0556b] text-white rounded-full font-playfair text-xs tracking-widest uppercase font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Ver Respuestas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
