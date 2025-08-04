import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Hook para buscar oficinas
export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data, error } = await supabase
          .from('workshops')
          .select(`
            *,
            profiles (
              name,
              email,
              phone,
              avatar_url
            )
          `)
          .eq('verified', true)
          .order('rating', { ascending: false });

        if (error) {
          setError(error.message);
          toast.error('Erro ao carregar oficinas');
        } else {
          setWorkshops(data || []);
        }
      } catch (err) {
        setError('Erro de conexão');
        toast.error('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return { workshops, loading, error };
};

// Hook para buscar agendamentos
export const useAppointments = (userId?: string) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            workshops (
              business_name,
              address,
              profiles (
                name,
                phone
              )
            ),
            vehicles (
              brand,
              model,
              plate
            )
          `)
          .eq('driver_id', userId)
          .order('scheduled_date', { ascending: false });

        if (error) {
          setError(error.message);
          toast.error('Erro ao carregar agendamentos');
        } else {
          setAppointments(data || []);
        }
      } catch (err) {
        setError('Erro de conexão');
        toast.error('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Escutar mudanças em tempo real
    const subscription = supabase
      .channel('appointments')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `driver_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Mudança em agendamento:', payload);
          fetchAppointments(); // Recarregar dados
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { appointments, loading, error };
};

// Hook para criar agendamento
export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);

  const createAppointment = async (appointmentData: any) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao criar agendamento');
        return null;
      }

      toast.success('Agendamento criado com sucesso!');
      return data;
    } catch (err) {
      toast.error('Erro de conexão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading };
};

// Hook para mensagens em tempo real
export const useMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            profiles (
              name,
              avatar_url
            )
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          toast.error('Erro ao carregar mensagens');
        } else {
          setMessages(data || []);
        }
      } catch (err) {
        toast.error('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Escutar novas mensagens em tempo real
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        (payload) => {
          console.log('Nova mensagem:', payload);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const sendMessage = async (content: string, senderId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: 'text'
        }]);

      if (error) {
        toast.error('Erro ao enviar mensagem');
        return false;
      }

      return true;
    } catch (err) {
      toast.error('Erro de conexão');
      return false;
    }
  };

  return { messages, loading, sendMessage };
}; 