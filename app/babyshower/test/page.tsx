'use client';

import { useState } from 'react';
import BotonConfirmar from '@/components/BotonConfirmar';
import FadeInSection from '@/components/FadeInSection';
import { Heart } from 'lucide-react';
import DinamicaRegalos from '@/components/DinamicaRegalos';
import DressCodePalette from '@/components/DressCodePalette';
import Image from 'next/image';
import EnvelopeReveal from '@/components/EnvelopeReveal';
import InvitationDetails from '@/components/InvitationDetails';

export default function InvitationTestPage() {
  const [showEnvelope, setShowEnvelope] = useState(true);

  // Datos simulados (mock) para poder previsualizar el diseño en esta ruta 
  // sin necesitar una conexión a la base de datos ni un parámetro [slug].
  const invitado = {
    id: 'test-id-123',
    slug: 'familia-gomez',
    nombre_mostrar: 'Familia Gómez',
    num_invitados: 2,
    estado_confirmacion: false
  };

  return (
    <>
      {showEnvelope && (
        <EnvelopeReveal onComplete={() => setShowEnvelope(false)} />
      )}
      <main className="min-h-screen bg-[#F9F8F6] text-gray-800 flex flex-col items-center py-16 px-6 sm:px-12 relative overflow-hidden">

      {/* Contenido de la invitación que aparece EN CASCADA solo cuando el sobre se ha ido */}
      {!showEnvelope && (
        <InvitationDetails guestData={invitado} />
      )}

    </main>
    </>
  );
}
