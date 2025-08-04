'use client';

import { useAuth } from '@/contexts/AuthContextNew';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MotoristaWidgets } from '@/components/dashboard/MotoristaWidgets';
import { OficinaWidgets } from '@/components/dashboard/OficinaWidgets';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function DashboardContent() {
  const { user, profile, loading, getDashboardPath } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeFromUrl = searchParams.get('type') as 'motorista' | 'oficina' | null;
  const planFromUrl = searchParams.get('plan') as 'free' | 'pro' | null;
  const sectionFromUrl = searchParams.get('section');

  console.log('🎯 [NEW DASHBOARD] Renderizando...', {
    user: !!user,
    loading,
    typeFromUrl,
    planFromUrl,
    sectionFromUrl,
    userType: user?.type,
    userPlanType: user?.planType
  });

  useEffect(() => {
    // Se não tem parâmetros na URL, redirecionar para dashboard correto baseado no usuário
    if (!loading && user && !typeFromUrl) {
      const correctPath = getDashboardPath();
      console.log('🔄 [NEW DASHBOARD] Redirecionando para:', correctPath);
      router.replace(correctPath);
    }
  }, [loading, user, typeFromUrl, getDashboardPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">🔄 Carregando...</p>
          <p className="mt-2 text-sm text-gray-500">Inicializando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('❌ [NEW DASHBOARD] Sem usuário, redirecionando para auth...');
    window.location.href = '/auth';
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Redirecionando para login...</p>
      </div>
    );
  }

  // Determinar tipo e plano baseado na URL ou no usuário
  const dashboardType = typeFromUrl || user.type;
  const dashboardPlan = planFromUrl || user.planType || 'free';

  console.log('✅ [NEW DASHBOARD] Dados finais:', {
    dashboardType,
    dashboardPlan,
    sectionFromUrl
  });

  // Verificar se o usuário está acessando o dashboard correto
  if (dashboardType !== user.type) {
    console.log('⚠️ [NEW DASHBOARD] Tipo incorreto, redirecionando...');
    const correctPath = getDashboardPath();
    router.replace(correctPath);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Redirecionando para dashboard correto...</p>
      </div>
    );
  }

  // Se é oficina, verificar plano
  if (dashboardType === 'oficina' && dashboardPlan !== user.planType) {
    console.log('⚠️ [NEW DASHBOARD] Plano incorreto, redirecionando...');
    const correctPath = getDashboardPath();
    router.replace(correctPath);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Redirecionando para plano correto...</p>
      </div>
    );
  }

  // Renderizar conteúdo baseado na seção
  const renderSectionContent = () => {
    if (sectionFromUrl) {
      return (
        <div className="bg-white rounded-lg p-8 shadow-sm border">
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {sectionFromUrl.replace('-', ' ')}
          </h2>
          <p className="text-gray-600 mb-6">
            Conteúdo da seção "{sectionFromUrl}" será implementado aqui.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              🚧 Esta seção está em desenvolvimento. 
              Os componentes originais estão preservados em <code>src/_backup/</code>
            </p>
          </div>
        </div>
      );
    }

    // Renderizar dashboard principal
    if (dashboardType === 'motorista') {
      return <MotoristaWidgets />;
    } else if (dashboardType === 'oficina') {
      return <OficinaWidgets planType={dashboardPlan} />;
    }

    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border">
        <h2 className="text-2xl font-bold mb-4">Tipo de dashboard não reconhecido</h2>
        <p className="text-gray-600">Tipo: {dashboardType}</p>
        <p className="text-gray-600">Plano: {dashboardPlan}</p>
      </div>
    );
  };

  return (
    <DashboardLayout
      type={dashboardType}
      planType={dashboardType === 'oficina' ? dashboardPlan : undefined}
      currentPath={window.location.href}
    >
      <div className="space-y-6">
        {/* Debug Info */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">✅ Sistema Novo Funcionando!</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Usuário:</strong> {user.name} ({user.email})</p>
            <p><strong>Tipo:</strong> {dashboardType}</p>
            {dashboardType === 'oficina' && <p><strong>Plano:</strong> {dashboardPlan}</p>}
            {sectionFromUrl && <p><strong>Seção:</strong> {sectionFromUrl}</p>}
            <p><strong>Componentes originais:</strong> Preservados em <code>src/_backup/</code></p>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {renderSectionContent()}
      </div>
    </DashboardLayout>
  );
}

export default function NewDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">🔄 Carregando dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}