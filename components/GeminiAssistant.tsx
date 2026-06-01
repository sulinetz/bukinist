import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Satellite } from 'lucide-react';
import { sendGeminiMessage } from '../services/geminiService';
import { ChatMessage, LoadingState } from '../types';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Приветствую! Я — виртуальный консультант салона "Спутник". Чем могу помочь? Оценить книгу, найти издание или рассказать об аукционе?', timestamp: new Date() }
  ]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus(LoadingState.LOADING);

    try {
      // We pass the messages history, but the mock service mostly uses the last user message
      const responseText = await sendGeminiMessage(messages, userMsg.text);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Связь с центром потеряна. Пожалуйста, позвоните нам по телефону.', timestamp: new Date() }]);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-[0_0_30px_rgba(197,165,114,0.4)] transition-all duration-300 hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-brand-primary text-brand-dark'}`}
      >
        <MessageSquare size={28} fill="currentColor" />
      </button>

      {/* Chat Interface */}
      <div 
        className={`fixed z-50 bg-brand-dark border border-brand-primary/20 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col
          ${isOpen 
            ? 'bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:rounded-xl opacity-100 pointer-events-auto' 
            : 'bottom-6 right-6 w-0 h-0 opacity-0 pointer-events-none rounded-full'
          }`}
      >
        {/* Header */}
        <div className="bg-brand-surface p-4 flex justify-between items-center border-b border-brand-primary/20">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/20 p-2 rounded-full border border-brand-primary/50">
              <Satellite size={18} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide uppercase">Спутник AI</h3>
              <p className="text-[10px] text-brand-primary">Консультант</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-brand-dark space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-brand-dark font-medium rounded-tr-none' 
                    : 'bg-brand-surface text-gray-200 border border-gray-700 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {status === LoadingState.LOADING && (
            <div className="flex justify-start">
              <div className="bg-brand-surface p-3 rounded-lg rounded-tl-none border border-gray-700">
                <Loader2 size={18} className="animate-spin text-brand-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-brand-surface border-t border-brand-primary/20">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ваш вопрос..."
              className="w-full pr-12 pl-4 py-3 bg-brand-dark border border-brand-primary/30 rounded-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || status === LoadingState.LOADING}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeminiAssistant;