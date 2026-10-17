import type { Metadata } from 'next';
import JuegoClient from './JuegoClient';

export const metadata: Metadata = {
  title: 'Palabras Desordenadas - Baby Shower de Avril',
  description: 'Minijuego interactivo de palabras desordenadas para el baby shower de Avril.',
};

export default function JuegoPage() {
  return <JuegoClient />;
}
