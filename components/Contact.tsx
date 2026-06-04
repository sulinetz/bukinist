import React, { useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  useEffect(() => {
    // Dynamically load SmartWidgets map script
    const script = document.createElement('script');
    script.src = 'https://res.smartwidgets.ru/app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="contact" className="relative pt-20 pb-10 bg-brand-paper border-t border-brand-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-4xl font-bold text-brand-dark mb-8">Контакты</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Адрес</h4>
                  <p className="text-gray-600">Москва, Ленинский проспект, 32</p>
                  <p className="text-sm text-gray-500 mt-1">Вход с проспекта, вывеска "Панорама спорт", второй этаж.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Телефон</h4>
                  <a href="tel:+74951234567" className="text-gray-600 hover:text-brand-primary transition-colors">+7 (499) 137-13-71</a>
                  <p className="text-xs text-gray-500">Звоните для оценки книг</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Режим работы</h4>
                  <p className="text-gray-600">Пн-Сб: 11:15 — 20:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Почта</h4>
                  <a href="mailto:bs-sputnik@mail.ru" className="text-gray-600 hover:text-brand-primary transition-colors">bs-sputnik@mail.ru</a>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map Widget (SmartWidgets mapping system) */}
          <div className="h-[400px] bg-brand-dark rounded-sm overflow-hidden relative shadow-lg border border-brand-primary/20 flex flex-col justify-between">
            <div className="flex-1 w-full relative min-h-[350px]">
              {/* Dynamic script component element fallback */}
              <div className="sw-app w-full h-[350px]" data-app="7d1907a13f1c46fa855ab3a52b9db576"></div>
            </div>
            <div className="bg-brand-dark/95 border-t border-brand-primary/20 py-2 px-4 flex items-center justify-between gap-2 z-10">
              <span className="text-[11px] text-gray-400 font-medium">Спутник Букинист на Ленинском 32</span>
              <a 
                href="https://yandex.ru/maps/-/CPTfyXlX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary text-brand-dark hover:bg-white hover:text-brand-dark text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all"
              >
                <MapPin size={11} />
                Карта по ссылке ↗
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Спутник Букинист. Все права защищены.
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-gray-500 hover:text-brand-primary text-sm">Политика конфиденциальности</a>
             <a href="#" className="text-gray-500 hover:text-brand-primary text-sm">Gagarinsquare</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
