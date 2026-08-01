'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function BotonConfirmar({
  invitadoId,
  estadoInicial,
}: {
  invitadoId: string;
  estadoInicial: boolean;
}) {
  const [estado, setEstado] = useState(estadoInicial);
  const [cargando, setCargando] = useState(false);

  const confirmarAsistencia = async () => {
    if (estado) return;
    setCargando(true);

    const { error } = await supabase
      .from('invitados')
      .update({ estado_confirmacion: true, fecha_confirmacion: new Date().toISOString() })
      .eq('id', invitadoId);

    if (!error) {
      setEstado(true);
    }
    setCargando(false);
  };

  return (
    <div className="w-full flex justify-center mt-8 min-h-[60px]">
      <AnimatePresence mode="wait">
        {!estado ? (
          <motion.button
            key="btn-confirmar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={confirmarAsistencia}
            disabled={cargando}
            className="px-8 py-3 rounded-full border border-[#C5B39A] text-[#C5B39A] font-playfair tracking-widest uppercase text-sm hover:bg-[#C5B39A] hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {cargando ? 'Cargando...' : 'Confirmar Asistencia'}
          </motion.button>
        ) : (
          <motion.div
            key="mensaje-confirmado"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 text-emerald-600 font-playfair italic"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="tracking-widest">¡Confirmado! Te esperamos</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
