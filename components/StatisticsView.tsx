"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Info, Calendar, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

// Custom hook for animated number counting
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    // reset count if end changes
    setCount(0);
    animationFrameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
}

interface Stats {
  total: number;
  ninoPercent: number;
  ninaPercent: number;
  avgPeso: number;
  avgLongitud: number;
  topOjos: string | null;
  topCabello: string | null;
  topFecha: string | null;
  topHora: string | null;
  topParecido: string | null;
}

// Helper to find the most frequent value, breaking ties by first occurrence
function getMostFrequent(arr: any[]) {
  if (arr.length === 0) return null;
  
  const counts: Record<string, number> = {};
  let maxCount = 0;
  let mostFrequent = arr[0];

  for (const item of arr) {
    if (!item) continue;
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      mostFrequent = item;
    }
  }
  return mostFrequent;
}

export default function StatisticsView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("predicciones").select("genero, peso_gramos, longitud_cm, color_ojos, color_cabello, fecha_nacimiento, hora_nacimiento, parecido");
      
      if (error || !data) {
        console.error("Error fetching stats", error);
        setLoading(false);
        return;
      }

      const total = data.length;
      if (total === 0) {
        setStats({ total: 0, ninoPercent: 0, ninaPercent: 0, avgPeso: 0, avgLongitud: 0, topOjos: null, topCabello: null, topFecha: null, topHora: null, topParecido: null });
        setLoading(false);
        return;
      }

      let ninos = 0;
      let ninas = 0;
      let sumPeso = 0;
      let sumLongitud = 0;
      
      const coloresOjos: string[] = [];
      const coloresCabello: string[] = [];
      const fechas: string[] = [];
      const horas: string[] = [];
      const parecidos: string[] = [];

      data.forEach(p => {
        if (p.genero === "Niño") ninos++;
        if (p.genero === "Niña") ninas++;
        sumPeso += p.peso_gramos;
        sumLongitud += p.longitud_cm;
        
        if (p.color_ojos) coloresOjos.push(p.color_ojos);
        if (p.color_cabello) coloresCabello.push(p.color_cabello);
        if (p.fecha_nacimiento) fechas.push(p.fecha_nacimiento);
        if (p.hora_nacimiento) horas.push(p.hora_nacimiento);
        if (p.parecido) parecidos.push(p.parecido);
      });

      setStats({
        total,
        ninoPercent: Math.round((ninos / total) * 100),
        ninaPercent: Math.round((ninas / total) * 100),
        avgPeso: Math.round(sumPeso / total),
        avgLongitud: Math.round(sumLongitud / total),
        topOjos: getMostFrequent(coloresOjos),
        topCabello: getMostFrequent(coloresCabello),
        topFecha: getMostFrequent(fechas),
        topHora: getMostFrequent(horas),
        topParecido: getMostFrequent(parecidos)
      });
      setLoading(false);

      // Trigger animations shortly after load
      setTimeout(() => setShowProgress(true), 150);
    };

    fetchStats();
  }, []);

  const animatedNino = useCountUp(stats?.ninoPercent || 0, 1500);
  const animatedNina = useCountUp(stats?.ninaPercent || 0, 1500);
  const animatedPeso = useCountUp(stats?.avgPeso || 0, 1500);
  const animatedLongitud = useCountUp(stats?.avgLongitud || 0, 1500);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-[#C5B39A]/20 flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5B39A]"></div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-[#C5B39A]/20 text-center">
        <h2 className="font-great-vibes text-4xl text-[#706458] mb-4">Aún no hay predicciones</h2>
      </div>
    );
  }

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha + "T00:00:00Z");
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-[#C5B39A]/20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#C5B39A]/30">
          <Check className="w-10 h-10 text-[#C5B39A]" />
        </div>
        <h2 className="font-great-vibes text-5xl text-[#706458] mb-2">¡Resultados en vivo!</h2>
        <p className="font-playfair text-gray-500 text-sm tracking-widest uppercase mb-4">
          Ya has guardado tu predicción
        </p>
        <p className="text-gray-600 font-sans max-w-md mx-auto leading-relaxed">
          Aquí te mostramos los resultados acumulados de todos nuestros invitados. ¡Veamos hacia dónde se inclina la balanza!
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Progress Bar Niño vs Niña */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="bg-white/50 p-6 rounded-3xl border border-[#C5B39A]/10"
        >
          <div className="flex justify-between font-playfair text-lg text-gray-700 mb-4">
            <span>Niño <span className="text-[#60828e] font-bold ml-1">{Math.round(animatedNino)}%</span></span>
            <span>Niña <span className="text-[#a06a7c] font-bold mr-1">{Math.round(animatedNina)}%</span></span>
          </div>
          <div className="w-full h-8 bg-[#F9F8F6] rounded-full overflow-hidden flex relative shadow-inner">
            <div 
              className="h-full bg-[#B8D8E3] transition-all duration-1500 ease-out flex items-center justify-center text-xs text-[#60828e] font-bold"
              style={{ width: showProgress ? `${stats.ninoPercent}%` : '0%' }}
            />
            <div 
              className="h-full bg-[#F2C9D8] transition-all duration-1500 ease-out flex items-center justify-center text-xs text-[#a06a7c] font-bold"
              style={{ width: showProgress ? `${stats.ninaPercent}%` : '0%' }}
            />
          </div>
        </motion.div>

        {/* Peso y Longitud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white/50 p-6 rounded-3xl border border-[#C5B39A]/10 text-center"
          >
            <h3 className="font-playfair text-lg text-gray-700 mb-2">Peso Promedio</h3>
            <div className="text-4xl font-sans text-[#C5B39A] font-light">
              {(animatedPeso / 1000).toFixed(2)} <span className="text-xl">Kg</span>
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white/50 p-6 rounded-3xl border border-[#C5B39A]/10 text-center"
          >
            <h3 className="font-playfair text-lg text-gray-700 mb-2">Longitud Promedio</h3>
            <div className="text-4xl font-sans text-[#C5B39A] font-light">
              {Math.round(animatedLongitud)} <span className="text-xl">cm</span>
            </div>
          </motion.div>
        </div>

        {/* Top Selecciones Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white/50 p-8 rounded-3xl border border-[#C5B39A]/10 flex flex-col items-center justify-center text-center"
          >
            <Calendar className="w-10 h-10 text-[#C5B39A] mb-4 opacity-80" strokeWidth={1.5} />
            <h3 className="font-playfair text-sm text-gray-500 mb-2">Día Favorito</h3>
            <div className="font-sans text-2xl text-gray-800 font-medium">
              {formatFecha(stats.topFecha)}
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white/50 p-8 rounded-3xl border border-[#C5B39A]/10 flex flex-col items-center justify-center text-center"
          >
            <Clock className="w-10 h-10 text-[#C5B39A] mb-4 opacity-80" strokeWidth={1.5} />
            <h3 className="font-playfair text-sm text-gray-500 mb-2">Hora Favorita</h3>
            <div className="font-sans text-2xl text-gray-800 font-medium">{stats.topHora || 'N/A'}</div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white/50 p-8 rounded-3xl border border-[#C5B39A]/10 flex flex-col items-center justify-center text-center"
          >
            <Users className="w-10 h-10 text-[#C5B39A] mb-4 opacity-80" strokeWidth={1.5} />
            <h3 className="font-playfair text-sm text-gray-500 mb-2">Se parecerá a</h3>
            <div className="font-sans text-2xl text-gray-800 font-medium">{stats.topParecido || 'N/A'}</div>
          </motion.div>
        </div>

        {/* Colores Ganadores */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="bg-white/50 p-6 rounded-3xl border border-[#C5B39A]/10 text-center"
        >
          <h3 className="font-playfair text-lg text-gray-700 mb-8">Rasgos Físicos Más Votados</h3>
          <div className="flex justify-center gap-16">
            <div className="flex flex-col items-center gap-4">
              <div 
                className={`w-24 h-24 rounded-full shadow-lg border-[6px] border-white transition-all duration-1000 delay-300 ${showProgress ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-45'}`}
                style={{ backgroundColor: stats.topOjos || '#ccc' }}
              />
              <span className="font-sans text-sm font-semibold text-gray-400 uppercase tracking-widest">Ojos</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div 
                className={`w-24 h-24 rounded-full shadow-lg border-[6px] border-white transition-all duration-1000 delay-500 ${showProgress ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-45'}`}
                style={{ backgroundColor: stats.topCabello || '#ccc' }}
              />
              <span className="font-sans text-sm font-semibold text-gray-400 uppercase tracking-widest">Cabello</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 text-center text-xs text-gray-400 font-sans flex items-center justify-center gap-2"
      >
        <Info className="w-5 h-5 opacity-50" />
        Basado en las respuestas de {stats.total} invitados
      </motion.div>
    </div>
  );
}
