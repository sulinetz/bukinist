import React from 'react';
import { Search, ShoppingBag, Globe, Landmark } from 'lucide-react';
import { ServiceCardProps } from '../types';

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => (
  <div className="group p-8 bg-brand-paper border border-brand-primary/10 hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-sm">
    <div className="mb-6 text-brand-primary group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-serif text-2xl font-bold text-brand-dark mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4">Наши Услуги</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Мы предлагаем полный спектр услуг для библиофилов, коллекционеров и инвесторов в предметы искусства.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            title="Покупка Книг" 
            description="Выкупаем библиотеки и отдельные редкие издания. Быстрая выплата, выезд оценщика на дом."
            icon={<ShoppingBag size={40} />}
          />
          <ServiceCard 
            title="Оценка и Экспертиза" 
            description="Профессиональная атрибуция антикварных книг. Оценка сохранности и рыночной стоимости."
            icon={<Search size={40} />}
          />
          <ServiceCard 
            title="Аукцион Gagarinsquare" 
            description="Организация торгов. Помощь в подготовке и продвижении вашей коллекции на международной площадке."
            icon={<Landmark size={40} />}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;