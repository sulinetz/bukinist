import React, { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Catalog from './components/Catalog';
import Services from './components/Services';
import Auction from './components/Auction';
import Contact from './components/Contact';
import GeminiAssistant from './components/GeminiAssistant';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-paper font-sans selection:bg-brand-primary selection:text-white">
      <Header />
      
      <main>
        <Hero />
        <About />
        <Catalog />
        <Services />
        <Auction />
        <Contact />
      </main>

      <Suspense fallback={<div className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full"><Loader2 className="animate-spin"/></div>}>
        <GeminiAssistant />
      </Suspense>
    </div>
  );
};

export default App;