import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import BabyshowerClientView from './BabyshowerClientView';

// Desactivar el caché para asegurar que la consulta se hace siempre en tiempo real
export const dynamic = 'force-dynamic';

export default async function BabyshowerDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Resolver los params correctamente (Next.js 15+)
  const { slug } = await params;

  // Consultar la tabla de Supabase explícitamente
  const { data: invitado, error } = await supabase
    .from('invitados_babyshower')
    .select('*')
    .eq('slug', slug)
    .single();

  // Si no se encuentra el invitado o hay error (ej: RLS lo bloquea), mostrar 404
  if (error || !invitado) {
    return notFound();
  }

  return <BabyshowerClientView guestData={invitado} />;
}
