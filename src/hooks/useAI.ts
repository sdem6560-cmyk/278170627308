import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, AIThought } from '../types';
import { getAIResponse, getSystemThoughts } from '../services/geminiService';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useAI = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sentinel_chatMessages');
    const initial = [
      { id: 'chat-1', role: 'ai', text: 'تم تفعيل جميع الأنظمة. الطيار الآلي نشط الآن ويقود العمليات. جاري مسح الشبكة بالكامل ورصد التهديدات العالمية.', timestamp: '04:34:50' },
    ];
    if (!saved) return initial as ChatMessage[];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any, i: number) => ({
        ...m,
        id: m.id && m.id.includes('-') ? m.id : `${m.id || 'chat'}-mig-${i}-${Math.random().toString(36).substring(2, 5)}`
      }));
    } catch {
      return initial as ChatMessage[];
    }
  });

  const [aiThoughts, setAiThoughts] = useState<AIThought[]>(() => {
    const saved = localStorage.getItem('sentinel_aiThoughts');
    const initial = [
      { id: 'th-1', type: 'analysis', text: 'تم اكتشاف 3 نقاط ضعف محتملة في جدار الحماية الرئيسي للهدف.', timestamp: '04:34:55' },
      { id: 'th-2', type: 'prediction', text: 'من المتوقع أن يتم تجاوز نظام كشف التسلل (IDS) خلال 15 دقيقة في حال تفعيل الطيار الآلي.', timestamp: '04:35:00' },
    ];
    if (!saved) return initial as AIThought[];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any, i: number) => ({
        ...t,
        id: t.id && t.id.includes('-') ? t.id : `${t.id || 'th'}-mig-${i}-${Math.random().toString(36).substring(2, 5)}`
      }));
    } catch {
      return initial as AIThought[];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sentinel_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sentinel_aiThoughts', JSON.stringify(aiThoughts));
  }, [aiThoughts]);

  const handleAction = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    
    const history = chatMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const responseText = await getAIResponse(text, history);
    
    const aiMsg: ChatMessage = {
      id: generateId(),
      role: 'ai',
      text: responseText || 'لا يوجد رد من النظام.',
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, aiMsg]);
  }, []);

  const updateThoughts = useCallback(async (phase?: string, threatLevel?: number, arsenal?: any[]) => {
    const newThoughts = await getSystemThoughts(phase, threatLevel, arsenal);
    if (newThoughts && newThoughts.length > 0) {
      const formattedThoughts = newThoughts.map((t: any) => ({
        id: generateId(),
        type: t.type,
        text: t.text,
        timestamp: new Date().toLocaleTimeString().split(' ')[0],
      }));
      setAiThoughts(prev => [...formattedThoughts, ...prev].slice(0, 20));
    }
  }, []);

  return {
    chatMessages,
    aiThoughts,
    handleAction,
    updateThoughts,
    setChatMessages,
    setAiThoughts
  };
};
