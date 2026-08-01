import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import BotonConfirmar from '@/components/BotonConfirmar';
import FadeInSection from '@/components/FadeInSection';
import { Heart } from 'lucide-react';

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: invitado, error } = await supabase
    .from('invitados')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !invitado) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-gray-800 flex flex-col items-center py-16 px-6 sm:px-12 relative overflow-hidden">
      
      {/* Boy OR Girl Section */}
      <FadeInSection>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-great-vibes text-[5rem] sm:text-[6rem] text-gray-800 leading-none -mr-2">boy</span>
          <span className="font-playfair text-[9px] tracking-[0.2em] text-gray-800 self-center uppercase pt-2">OR</span>
          <span className="font-great-vibes text-[5rem] sm:text-[6rem] text-gray-800 leading-none -ml-1">girl</span>
        </div>
      </FadeInSection>

      {/* Heart and Vertical Line */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-col items-center mb-10">
          <Heart className="w-3.5 h-3.5 text-[#C5B39A] fill-[#C5B39A] mb-3" />
          <div className="w-[1px] h-28 bg-[#C5B39A] opacity-60"></div>
        </div>
      </FadeInSection>

      {/* Intro Text */}
      <FadeInSection delay={0.2}>
        <div className="text-center mb-12 flex flex-col items-center">
          <p className="font-playfair text-[9px] sm:text-[10px] tracking-[0.15em] text-gray-800 mb-6 uppercase">
            ACOMPÁÑANOS A LA REVELACIÓN DE GÉNERO<br className="mb-2" />HONORANDO A
          </p>
          <h1 className="font-playfair text-[1.4rem] sm:text-[1.6rem] tracking-[0.15em] text-gray-800 uppercase font-medium">
            EMILIA & ROBERT
          </h1>
        </div>
      </FadeInSection>

      {/* Date Section */}
      <FadeInSection delay={0.3}>
        <div className="flex flex-col items-center mb-14 w-full max-w-[260px]">
          <span className="font-playfair text-[11px] tracking-[0.2em] uppercase mb-4 text-gray-800">
            AGOSTO
          </span>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 flex justify-center border-y border-[#C5B39A] py-[10px]">
              <span className="font-playfair text-[10px] tracking-[0.25em] uppercase text-gray-800">
                SÁBADO
              </span>
            </div>
            <span className="font-playfair text-6xl sm:text-7xl font-normal text-gray-800 leading-none px-1 -mt-2">
              08
            </span>
            <div className="flex-1 flex justify-center border-y border-[#C5B39A] py-[10px]">
              <span className="font-playfair text-[10px] tracking-[0.25em] uppercase text-gray-800">
                3 PM
              </span>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Location */}
      <FadeInSection delay={0.4}>
        <div className="text-center mb-20 font-playfair flex flex-col items-center">
          <p className="text-gray-800 text-[11px] tracking-[0.15em] uppercase mb-[2px]">
            CASA JARDÍN
          </p>
          <p className="text-gray-800 text-[10px] tracking-[0.15em] uppercase mb-[2px]">
            CARR 1 ENTRE CALLE 3 Y 4.
          </p>
          <p className="text-gray-800 text-[10px] tracking-[0.15em] uppercase mb-5">
            URB NUEVA SEGOVIA
          </p>
          <a 
            href="https://maps.app.goo.gl/i4nSbwDEumFjER7NA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#D3AD7A] text-[9px] tracking-[0.2em] uppercase transition-colors hover:text-gray-600"
          >
            Ver en Google Maps
          </a>
        </div>
      </FadeInSection>

      {/* Dynamic Data / Invitation Details */}
      <FadeInSection delay={0.5}>
        <div 
          className="w-full max-w-md border border-[#C5B39A]/30 p-8 rounded-2xl text-center shadow-sm mb-6 flex flex-col items-center relative overflow-hidden"
          style={{
            backgroundImage: 'url(/10366743.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="font-great-vibes text-4xl mb-4 text-gray-900">
              {invitado.nombre_mostrar}
            </h2>
            
            <div className="font-playfair text-sm text-gray-800 font-medium tracking-wider">
              {invitado.tipo_invitacion === 'A' && (
                <p>Válido para {invitado.num_invitados} personas</p>
              )}

              {invitado.tipo_invitacion === 'B' && (
                <p>Especialmente para: {invitado.nombres_detallados}</p>
              )}
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* RSVP Button */}
      <FadeInSection delay={0.6}>
        <BotonConfirmar 
          invitadoId={invitado.id} 
          estadoInicial={invitado.estado_confirmacion} 
        />
      </FadeInSection>

    </main>
  );
}
