import { Suspense } from 'react';
import BuscarOficinasClient from './BuscarOficinasClient';

export default function BuscarOficinasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BuscarOficinasClient />
    </Suspense>
  );
} 