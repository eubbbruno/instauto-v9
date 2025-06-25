// Verificação de variáveis de ambiente
export const checkEnvironment = () => {
  const checks = {
    supabaseUrl: {
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      required: true,
      name: 'NEXT_PUBLIC_SUPABASE_URL'
    },
    supabaseAnonKey: {
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      required: true,
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    },
    supabaseServiceRole: {
      value: process.env.SUPABASE_SERVICE_ROLE_KEY,
      required: false,
      name: 'SUPABASE_SERVICE_ROLE_KEY'
    }
  };

  const results = Object.entries(checks).map(([key, config]) => ({
    key,
    name: config.name,
    configured: !!config.value,
    required: config.required,
    status: config.required && !config.value ? 'error' : config.value ? 'ok' : 'warning'
  }));

  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');

  return {
    results,
    hasErrors,
    hasWarnings,
    isReady: !hasErrors
  };
};

export const logEnvironmentStatus = () => {
  const check = checkEnvironment();
  
  console.log('🔧 VERIFICAÇÃO DE AMBIENTE');
  console.log('========================');
  
  check.results.forEach(result => {
    const icon = result.status === 'ok' ? '✅' : 
                 result.status === 'warning' ? '⚠️' : '❌';
    const status = result.configured ? 'Configurado' : 'Não encontrado';
    console.log(`${icon} ${result.name}: ${status}`);
  });
  
  console.log('========================');
  
  if (check.hasErrors) {
    console.error('❌ Configuração incompleta! Verifique as variáveis obrigatórias.');
  } else if (check.hasWarnings) {
    console.warn('⚠️ Algumas variáveis opcionais não foram configuradas.');
  } else {
    console.log('✅ Todas as variáveis necessárias estão configuradas!');
  }
  
  return check;
}; 