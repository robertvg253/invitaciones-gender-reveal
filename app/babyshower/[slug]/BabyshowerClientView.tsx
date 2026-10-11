'use client';

import { useState, useEffect } from 'react';
import EnvelopeReveal from '@/components/EnvelopeReveal';
import InvitationDetails, { GuestData } from '@/components/InvitationDetails';

export default function BabyshowerClientView({ guestData }: { guestData: GuestData }) {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('envelopeOpened') === 'true') {
      setShowEnvelope(false);
    }
    setIsMounted(true);
  }, []);

  const handleEnvelopeComplete = () => {
    sessionStorage.setItem('envelopeOpened', 'true');
    setShowEnvelope(false);
  };

  return (
    <>
      {!isMounted && <div className="min-h-screen bg-[#F9F8F6]"></div>}
      {isMounted && (
        <>
      {/* El sobre se superpone y bloquea el scroll inicialmente */}
      {showEnvelope && (
        <EnvelopeReveal onComplete={handleEnvelopeComplete} />
      )}
      
      {/* 
        El fondo se mantiene estático, pero InvitationDetails solo se renderiza 
        y dispara sus animaciones cuando el sobre se termina de desvanecer.
      */}
      <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center relative overflow-hidden">
        {!showEnvelope && (
          <InvitationDetails guestData={guestData} />
        )}
      </main>
      </>
      )}
    </>
  );
}
