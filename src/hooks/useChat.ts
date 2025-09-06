import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  product_id: string;
  seller_id: string;
  buyer_id: string;
  created_at: string;
  updated_at: string;
  product?: {
    title: string;
    image_url: string;
  };
  other_user?: {
    name: string;
    id: string;
  };
  last_message?: {
    content: string;
    created_at: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    name: string;
  };
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_conversations', { user_uuid: user.id });

      if (error) throw error;

      setConversations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return { conversations, loading, refetch: fetchConversations };
};

export const useConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversation = async () => {
    if (!conversationId || !user) return;

    try {
      const { data: convData, error: convError } = await supabase
        .rpc('get_conversation_details', { 
          conversation_uuid: conversationId,
          user_uuid: user.id 
        });

      if (convError) throw convError;

      if (convData && convData.length > 0) {
        setConversation(convData[0]);
      }

      const { data: messagesData, error: messagesError } = await supabase
        .rpc('get_conversation_messages', { conversation_uuid: conversationId });

      if (messagesError) throw messagesError;

      setMessages(messagesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch conversation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !conversationId) return;

    try {
      const { data, error } = await supabase
        .rpc('send_message', {
          conversation_uuid: conversationId,
          sender_uuid: user.id,
          message_content: content
        });

      if (error) throw error;

      if (data) {
        setMessages(prev => [...prev, data]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [conversationId, user]);

  return { conversation, messages, loading, sendMessage, refetch: fetchConversation };
};

export const useCreateConversation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createConversation = async (productId: string, sellerId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .rpc('create_or_get_conversation', {
          product_uuid: productId,
          buyer_uuid: user.id,
          seller_uuid: sellerId
        });

      if (error) throw error;

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  return { createConversation };
};