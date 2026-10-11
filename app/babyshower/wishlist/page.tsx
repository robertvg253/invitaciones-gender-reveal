import { supabase } from '../../../lib/supabase';
import WishlistClient from './WishlistClient';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const { data: regalos, error } = await supabase
    .from('regalos_babyshower')
    .select('*')
    .order('orden', { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching regalos:", error);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <WishlistClient initialRegalos={regalos || []} />
    </main>
  );
}
