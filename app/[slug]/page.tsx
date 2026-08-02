import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import BotonConfirmar from '@/components/BotonConfirmar';
import FadeInSection from '@/components/FadeInSection';
import { Heart } from 'lucide-react';
import DinamicaRegalos from '@/components/DinamicaRegalos';
import DressCodePalette from '@/components/DressCodePalette';
import Image from 'next/image';

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
          <span className="font-great-vibes text-[6.5rem] text-[#706458] leading-none -mr-2">boy</span>
          <span className="font-playfair text-[11px] tracking-[0.2em] text-[#706458] self-center uppercase pt-2 ml-[10px]">OR</span>
          <span className="font-great-vibes text-[6.5rem] text-[#706458] leading-none -ml-1">girl</span>
        </div>
      </FadeInSection>

      {/* Heart and Vertical Line */}
      <FadeInSection delay={0.1}>
        <div className="flex flex-col items-center">
          <Heart className="w-3.5 h-3.5 text-[#C5B39A] fill-[#C5B39A] mb-3 animate-heartbeat origin-center" />
          <div className="w-[1px] h-16 sm:h-20 bg-[#C5B39A] opacity-60"></div>
        </div>
      </FadeInSection>

      {/* Ultrasound Image */}
      <FadeInSection delay={0.15}>
        <div className="flex justify-center my-6 md:my-8 w-full p-4 md:p-6">
          <Image
            src="/IMG_7306.PNG"
            alt="Ecografía"
            width={600}
            height={400}
            className="w-full max-w-sm md:max-w-lg h-60 md:h-80 object-cover mix-blend-luminosity opacity-90"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 60%)',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 60%)',
            }}
          />
        </div>
      </FadeInSection>

      {/* Intro Text */}
      <FadeInSection delay={0.2}>
        <div className="text-center mb-12 flex flex-col items-center">
          <p className="font-playfair text-[9px] sm:text-[10px] tracking-[0.15em] text-gray-800 mb-6 uppercase">
            ACOMPÁÑANOS A LA REVELACIÓN DE GÉNERO<br className="mb-2" />HONORANDO A
          </p>
          <h1 className="font-playfair text-[1.4rem] sm:text-[1.6rem] tracking-[0.15em] text-[#706458] uppercase font-medium">
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
            <span className="font-playfair text-6xl sm:text-7xl font-normal text-[#706458] leading-none px-1 -mt-2">
              08
            </span>
            <div className="flex-1 flex justify-center border-y border-[#C5B39A] py-[10px]">
              <span className="font-playfair text-[10px] tracking-[0.25em] uppercase text-gray-800">
                3:30 PM
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
            className="text-[#D3AD7A] text-[9px] tracking-[0.2em] uppercase transition-colors hover:text-gray-600 border-b border-[#D3AD7A] pb-[1px]"
          >
            Ver en Google Maps
          </a>
        </div>
      </FadeInSection>

      {/* Dress Code Section */}
      <FadeInSection delay={0.25}>
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="w-1 h-1 bg-[#C5B39A] rounded-full mb-6"></div>
          <p className="font-playfair text-[10px] md:text-[12px] tracking-[0.2em] text-gray-800 uppercase">
            DRESS CODE
          </p>
          <p className="font-playfair text-xl md:text-2xl tracking-widest text-gray-800 uppercase mt-2">
            CASUAL
          </p>
          <p className="font-playfair text-[11px] md:text-[13px] text-gray-600 italic mb-6 mt-1">
            Te sugerimos inspirarte en la siguiente paleta de colores
          </p>

          <DressCodePalette />
        </div>
      </FadeInSection>

      {/* Gift Dynamics Section (Extracted to Client Component) */}
      <DinamicaRegalos />

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
