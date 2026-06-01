import React from 'react';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  price: number;
  description: string;
  condition?: string;
  coverUrl: string;
  category: 'Antique' | 'Soviet' | 'Art' | 'Autograph' | string;
}