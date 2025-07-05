import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export interface Notificacao {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'appointment';
  titulo: string;
  mensagem: string;
  read: boolean;
  created_at: string;
  metadata?: {
    payment_id?: string;
    appointment_id?: string;
    amount?: number;
    [key: string]: any;
  };
}

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissaoNotificacao, setPermissaoNotificacao] = useState<NotificationPermission>('default');
  const { user } = useAuth();
  const supabase = createClient();

  // Verificar permissão de notificação
  useEffect(() => {
    if ('Notification' in window) {
      setPermissaoNotificacao(Notification.permission);
    }
  }, []);

  // Solicitar permissão para notificações
  const solicitarPermissao = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissaoNotificacao(permission);
      return permission === 'granted';
    }
    return false;
  }, []);

  // Carregar notificações do Supabase
  const carregarNotificacoes = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar notificações:', error);
        return;
      }

      const notificacoesFormatadas = data?.map(notification => ({
        id: notification.id,
        tipo: mapTipoNotificacao(notification.type),
        titulo: notification.title,
        mensagem: notification.message,
        read: notification.read,
        created_at: notification.created_at,
        metadata: notification.metadata
      })) || [];

      setNotificacoes(notificacoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  // Configurar realtime para notificações
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          const notificacaoFormatada: Notificacao = {
            id: newNotification.id,
            tipo: mapTipoNotificacao(newNotification.type),
            titulo: newNotification.title,
            mensagem: newNotification.message,
            read: newNotification.read,
            created_at: newNotification.created_at,
            metadata: newNotification.metadata
          };

          // Adicionar à lista
          setNotificacoes(prev => [notificacaoFormatada, ...prev]);

          // Mostrar notificação push se permitido
          if (permissaoNotificacao === 'granted') {
            showNotificationPush(notificacaoFormatada);
          }

          // Mostrar notificação web se a página estiver em foco
          showWebNotification(notificacaoFormatada);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, permissaoNotificacao, supabase]);

  // Carregar notificações quando o usuário estiver logado
  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // Mostrar notificação push
  const showNotificationPush = useCallback((notificacao: Notificacao) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(notificacao.titulo, {
        body: notificacao.mensagem,
        icon: '/logo-instauto.svg',
        badge: '/logo-instauto.svg',
        tag: notificacao.id,
        requireInteraction: notificacao.tipo === 'error' || notificacao.tipo === 'payment',
        data: {
          id: notificacao.id,
          type: notificacao.tipo,
          metadata: notificacao.metadata
        }
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navegar baseado no tipo
        if (notificacao.tipo === 'payment') {
          window.location.href = '/dashboard/financeiro';
        } else if (notificacao.tipo === 'appointment') {
          window.location.href = '/dashboard/agendamentos';
        }
      };

      // Auto-close após 5 segundos para notificações normais
      if (notificacao.tipo !== 'error' && notificacao.tipo !== 'payment') {
        setTimeout(() => notification.close(), 5000);
      }
    }
  }, []);

  // Mostrar notificação web (in-app)
  const showWebNotification = useCallback((notificacao: Notificacao) => {
    // Aqui você pode integrar com uma biblioteca de toast como react-hot-toast
    console.log('Nova notificação:', notificacao);
  }, []);

  // Marcar notificação como lida
  const marcarComoLida = useCallback(async (notificacaoId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificacaoId);

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        return;
      }

      setNotificacoes(prev => 
        prev.map(notif => 
          notif.id === notificacaoId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, [supabase]);

  // Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Erro ao marcar todas como lidas:', error);
        return;
      }

      setNotificacoes(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  }, [user?.id, supabase]);

  // Criar nova notificação (para uso interno)
  const criarNotificacao = useCallback(async (
    titulo: string, 
    mensagem: string, 
    tipo: Notificacao['tipo'] = 'info',
    metadata?: any
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: titulo,
          message: mensagem,
          type: mapTipoParaDatabase(tipo),
          read: false,
          metadata,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao criar notificação:', error);
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }, [user?.id, supabase]);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.read);

  return {
    notificacoes,
    notificacoesNaoLidas,
    loading,
    permissaoNotificacao,
    solicitarPermissao,
    marcarComoLida,
    marcarTodasComoLidas,
    criarNotificacao,
    carregarNotificacoes
  };
}

// Mapear tipos de notificação
function mapTipoNotificacao(type: string): Notificacao['tipo'] {
  switch (type) {
    case 'payment_approved':
    case 'payment_refunded':
      return 'payment';
    case 'appointment_confirmed':
    case 'appointment_cancelled':
      return 'appointment';
    case 'payment_failed':
    case 'error':
      return 'error';
    case 'payment_pending':
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return 'info';
  }
}

function mapTipoParaDatabase(tipo: Notificacao['tipo']): string {
  switch (tipo) {
    case 'payment':
      return 'payment_info';
    case 'appointment':
      return 'appointment_info';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return 'info';
  }
} 