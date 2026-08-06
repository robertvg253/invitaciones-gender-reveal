"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface LoginFormProps {
  onLoginSuccess: (userId: string, email: string, name: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setMessage({ type: "error", text: "Por favor, ingresa tu nombre y correo." });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          full_name: name,
        },
      }
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    } else {
      setOtpSent(true);
      setMessage({ type: "success", text: "¡Código enviado! Revisa tu correo." });
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ type: "error", text: "Por favor, ingresa el código." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email' // Using email type for numeric OTP to prevent 403 errors
    });

    if (error) {
      setMessage({ type: "error", text: "Código inválido o expirado." });
      setLoading(false);
    } else if (data.user) {
      onLoginSuccess(data.user.id, data.user.email || email, name);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-[#C5B39A]/20">
      <div className="text-center mb-8">
        <h2 className="font-great-vibes text-5xl text-[#706458] mb-2">Bienvenido</h2>
        <p className="font-playfair text-gray-500 text-sm tracking-widest uppercase">
          Predicciones del Bebé
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-center text-sm font-playfair ${message.type === 'success' ? 'bg-green-50/50 text-green-800' : 'bg-red-50/50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-playfair text-sm text-gray-600 mb-2">Tu Nombre Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-[#C5B39A]/30 py-2 px-1 text-gray-800 focus:outline-none focus:border-[#C5B39A] transition-colors font-sans placeholder-gray-300"
              placeholder="Ej. María Pérez"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-playfair text-sm text-gray-600 mb-2">Tu Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#C5B39A]/30 py-2 px-1 text-gray-800 focus:outline-none focus:border-[#C5B39A] transition-colors font-sans placeholder-gray-300"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border border-[#C5B39A] text-[#C5B39A] bg-transparent font-playfair tracking-widest uppercase text-sm hover:bg-[#C5B39A] hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? "ENVIANDO..." : "INGRESAR"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block font-playfair text-sm text-gray-600 mb-4 text-center">
              Ingresa el código que enviamos a<br/>
              <span className="font-sans text-[#C5B39A] mt-1 block">{email}</span>
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-transparent border-b border-[#C5B39A]/30 py-2 px-1 text-gray-800 text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-[#C5B39A] transition-colors font-sans placeholder-gray-200"
              placeholder="123456"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border border-[#C5B39A] text-[#C5B39A] bg-transparent font-playfair tracking-widest uppercase text-sm hover:bg-[#C5B39A] hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? "VERIFICANDO..." : "VERIFICAR CÓDIGO"}
          </button>
          <button
            type="button"
            onClick={() => { setOtpSent(false); setMessage(null); setOtp(""); }}
            className="w-full text-center text-sm text-gray-400 font-playfair hover:text-[#C5B39A] underline mt-4"
          >
            Usar otro correo
          </button>
        </form>
      )}
    </div>
  );
}
