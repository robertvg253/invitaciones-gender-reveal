"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check } from "lucide-react";

interface PredictionFormProps {
  userId: string;
  userName: string;
  userEmail: string;
  onPredictionComplete: () => void;
}

export default function PredictionForm({ userId, userName, userEmail, onPredictionComplete }: PredictionFormProps) {
  const [genero, setGenero] = useState<"Niño" | "Niña" | null>(null);
  const [nombreBebe, setNombreBebe] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [horaNacimiento, setHoraNacimiento] = useState("");
  const [peso, setPeso] = useState(3500);
  const [longitud, setLongitud] = useState(50);
  const [colorOjos, setColorOjos] = useState("");
  const [colorCabello, setColorCabello] = useState("");
  const [parecido, setParecido] = useState("");
  const [consejo, setConsejo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genero || !horaNacimiento || !colorOjos || !colorCabello || !parecido) {
      setError("Por favor, selecciona todas las opciones.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await supabase.from("predicciones").insert({
      user_id: userId,
      nombre_invitado: userName,
      genero,
      nombre_bebe: nombreBebe,
      fecha_nacimiento: fechaNacimiento,
      hora_nacimiento: horaNacimiento,
      peso_gramos: peso,
      longitud_cm: longitud,
      color_ojos: colorOjos,
      color_cabello: colorCabello,
      parecido,
      consejo,
    });

    if (submitError) {
      if (submitError.code === "23505") { // Unique constraint violation
        onPredictionComplete();
      } else {
        setError("Ocurrió un error al guardar tu predicción. Intenta de nuevo.");
        console.error(submitError);
      }
    } else {
      onPredictionComplete();
    }
    setLoading(false);
  };


  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-[#C5B39A]/20">
      <div className="text-center mb-10">
        <h2 className="font-great-vibes text-5xl text-[#706458] mb-2">Tus Predicciones</h2>
        <p className="font-playfair text-gray-500 text-sm tracking-widest uppercase">
          Hola, {userName.split(' ')[0]}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-8 bg-red-50/50 text-red-800 text-center font-playfair text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Género */}
        <div>
          <label className="block font-playfair text-center text-lg text-gray-700 mb-6">¿Niño o Niña?</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setGenero("Niño")}
              className={`flex-1 py-8 rounded-2xl border-2 transition-all duration-300 ${
                genero === "Niño"
                  ? "border-[#B8D8E3] bg-[#B8D8E3]/20 text-[#60828e] shadow-sm transform scale-[1.02]"
                  : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-[#B8D8E3]/50 hover:bg-[#B8D8E3]/10"
              }`}
            >
              <span className="font-playfair text-2xl">Niño</span>
            </button>
            <button
              type="button"
              onClick={() => setGenero("Niña")}
              className={`flex-1 py-8 rounded-2xl border-2 transition-all duration-300 ${
                genero === "Niña"
                  ? "border-[#F2C9D8] bg-[#F2C9D8]/20 text-[#a06a7c] shadow-sm transform scale-[1.02]"
                  : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-[#F2C9D8]/50 hover:bg-[#F2C9D8]/10"
              }`}
            >
              <span className="font-playfair text-2xl">Niña</span>
            </button>
          </div>
        </div>

        {/* Nombre del Bebé */}
        <div>
          <label htmlFor="nombreBebe" className="block font-playfair text-center text-lg text-gray-700 mb-4">¿Qué nombre le pondremos?</label>
          <input
            id="nombreBebe"
            type="text"
            value={nombreBebe}
            onChange={(e) => setNombreBebe(e.target.value)}
            className="w-full bg-transparent border-b-2 border-[#C5B39A]/30 py-3 px-2 text-center text-xl text-gray-800 focus:outline-none focus:border-[#C5B39A] transition-colors font-sans placeholder-gray-200"
            placeholder="Escribe el nombre aquí..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fecha de Nacimiento */}
          <div>
            <label htmlFor="fechaNacimiento" className="block font-playfair text-center md:text-left text-lg text-gray-700 mb-4">Fecha de Nacimiento</label>
            <input
              id="fechaNacimiento"
              type="date"
              min="2026-08-06"
              max="2026-11-15"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full bg-transparent border-b border-[#C5B39A]/30 py-3 px-2 text-gray-800 focus:outline-none focus:border-[#C5B39A] transition-colors font-sans"
              required
            />
          </div>

          {/* Hora de Nacimiento */}
          <div>
            <label className="block font-playfair text-center md:text-left text-lg text-gray-700 mb-4">Hora de Nacimiento</label>
            <div className="grid grid-cols-2 gap-3">
              {["Madrugada", "Mañana", "Tarde", "Noche"].map((hora) => (
                <button
                  key={hora}
                  type="button"
                  onClick={() => setHoraNacimiento(hora)}
                  className={`py-2 px-3 rounded-full border border-[#C5B39A] font-playfair tracking-widest uppercase text-[10px] sm:text-xs transition-all duration-300 ${
                    horaNacimiento === hora
                      ? "bg-[#C5B39A] text-white"
                      : "bg-transparent text-[#C5B39A] hover:bg-[#C5B39A] hover:text-white"
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-8 bg-gray-50/50 p-6 rounded-3xl">
          {/* Peso */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label htmlFor="peso" className="block font-playfair text-lg text-gray-700">Peso</label>
              <span className="font-sans font-medium text-[#C5B39A]">{(peso / 1000).toFixed(2)} Kg</span>
            </div>
            <input
              id="peso"
              type="range"
              min="2000"
              max="5000"
              step="50"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              className="w-full custom-slider accent-[#C5B39A]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-sans">
              <span>2.0 Kg</span>
              <span>5.0 Kg</span>
            </div>
          </div>

          {/* Longitud */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label htmlFor="longitud" className="block font-playfair text-lg text-gray-700">Longitud</label>
              <span className="font-sans font-medium text-[#C5B39A]">{longitud} cm</span>
            </div>
            <input
              id="longitud"
              type="range"
              min="40"
              max="60"
              step="1"
              value={longitud}
              onChange={(e) => setLongitud(Number(e.target.value))}
              className="w-full custom-slider accent-[#C5B39A]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-sans">
              <span>40 cm</span>
              <span>60 cm</span>
            </div>
          </div>
        </div>

        {/* Rasgos Físicos */}
        <div className="space-y-8">
          <div>
            <label className="block font-playfair text-center text-lg text-gray-700 mb-4">Color de Ojos</label>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { hex: "#3B2F2F", label: "Oscuro" },
                { hex: "#8B5A2B", label: "Claro" },
                { hex: "#CD853F", label: "Ámbar" },
                { hex: "#556B2F", label: "Verde" }
              ].map((color) => (
                <div key={color.hex} className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setColorOjos(color.hex)}
                    className={`w-12 h-12 rounded-full shadow-sm transition-all duration-300 ${
                      colorOjos === color.hex
                        ? "ring-4 ring-offset-2 ring-[#C5B39A] scale-110"
                        : "ring-1 ring-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.label}
                  />
                  <span className="text-xs font-sans text-gray-500">{color.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-playfair text-center text-lg text-gray-700 mb-4">Color de Cabello</label>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { hex: "#0F0F0F", label: "Negro" },
                { hex: "#3E2723", label: "Castaño" },
                { hex: "#5D4037", label: "Claro" },
                { hex: "#D4AF37", label: "Rubio" }
              ].map((color) => (
                <div key={color.hex} className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setColorCabello(color.hex)}
                    className={`w-12 h-12 rounded-full shadow-sm transition-all duration-300 ${
                      colorCabello === color.hex
                        ? "ring-4 ring-offset-2 ring-[#C5B39A] scale-110"
                        : "ring-1 ring-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.label}
                  />
                  <span className="text-xs font-sans text-gray-500">{color.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-playfair text-center text-lg text-gray-700 mb-4">¿A quién se parecerá más?</label>
            <div className="flex flex-wrap justify-center gap-3">
              {["Mamá", "Papá", "Mitad y Mitad"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setParecido(p)}
                  className={`py-3 px-6 rounded-full border border-[#C5B39A] font-playfair tracking-widest uppercase text-xs sm:text-sm transition-all duration-300 ${
                    parecido === p
                      ? "bg-[#C5B39A] text-white shadow-sm transform scale-[1.02]"
                      : "bg-transparent text-[#C5B39A] hover:bg-[#C5B39A] hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consejo */}
        <div>
          <label htmlFor="consejo" className="block font-playfair text-center text-lg text-gray-700 mb-4">Un consejo para nosotros</label>
          <textarea
            id="consejo"
            value={consejo}
            onChange={(e) => setConsejo(e.target.value)}
            className="w-full min-h-[120px] bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-[#fdfbf7] border border-[#C5B39A]/20 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C5B39A]/30 focus:border-transparent font-playfair resize-y leading-relaxed"
            placeholder="Escribe tu consejo aquí..."
            required
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border border-[#C5B39A] text-[#C5B39A] bg-transparent font-playfair tracking-widest uppercase text-sm hover:bg-[#C5B39A] hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "ENVIANDO PREDICCIÓN..." : "GUARDAR PREDICCIÓN"}
          </button>
        </div>
      </form>
    </div>
  );
}
