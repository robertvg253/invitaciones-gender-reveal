import LoginForm from "@/components/LoginForm";
import PredictionForm from "@/components/PredictionForm";
import ClientPredictionPage from "@/components/ClientPredictionPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Elementos decorativos (círculos difuminados de fondo) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#C5B39A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#e0d6c8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-[#e8dfd3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-4xl py-12">
        <ClientPredictionPage />
      </div>
    </div>
  );
}
