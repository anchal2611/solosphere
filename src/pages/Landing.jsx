import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  BookOpen, 
  DollarSign, 
  FileText, 
  ArrowRight, 
  Heart, 
  Compass, 
  Sun,
  Coffee,
  Clock,
  Flame
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Budgeting Journal',
      desc: 'Frame your personal expenses as a mindful reflection, not accounting software. Monitor monthly limits, categorize dining, groceries, or self-care, and map your financial peace.',
      icon: DollarSign,
      color: 'text-brand-terracotta bg-brand-terracotta/5'
    },
    {
      title: 'Digital Planner & Habits',
      desc: 'A daily notebook for priority checklists, weekly grids, and monthly aspirations. Track healthy habits without pressure, celebrate consistency, and jot notes on loose-leaf sheets.',
      icon: Calendar,
      color: 'text-brand-olive bg-brand-olive/5'
    },
    {
      title: 'Solo Kitchen',
      desc: 'Explore and curate culinary ideas sized specifically for single servings. Type whatever you have in your pantry and generate similar recipe ideas with a single tap.',
      icon: BookOpen,
      color: 'text-brand-gold bg-brand-gold/5'
    },
    {
      title: 'Journal Reflections',
      desc: 'Browse essays, reflections, and lifestyle guides written to help you thrive in your solo space. Cultivate a slower, more intentional daily life.',
      icon: FileText,
      color: 'text-brand-dusty bg-brand-dusty/5'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg-warm text-brand-text-dark font-sans flex flex-col justify-between selection:bg-brand-gold/30">
      
      {/* PUBLIC HEADER */}
      <header className="px-6 md:px-12 py-6 flex justify-between items-center bg-transparent max-w-7xl w-full mx-auto animate-fade-in">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <Compass className="text-brand-terracotta transition-transform hover:rotate-12 duration-300" size={24} />
          <span className="font-serif font-bold text-xl tracking-wide text-brand-text-dark">SoloSphere</span>
        </div>
        
        <div className="flex items-center gap-6 font-sans text-xs font-semibold">
          <button 
            onClick={() => navigate('/signin')}
            className="text-brand-text-muted hover:text-brand-text-dark transition-colors duration-200 underline-slide"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-brand-terracotta text-brand-bg-warm px-4.5 py-2.5 rounded-brand hover:bg-brand-cinnamon shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 hover:scale-[1.02] active:translate-y-0"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-6 md:px-12 py-10 md:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Column - Tightened rhythm and staggered loading animations */}
        <div className="lg:col-span-7 space-y-6 text-left my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-olive/10 text-brand-olive rounded-full text-xs font-semibold opacity-0 animate-fade-in-up delay-75">
            <Heart size={12} className="fill-brand-olive" />
            <span>A daily companion for living alone</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight tracking-tight text-brand-text-dark opacity-0 animate-fade-in-up delay-150">
            Create a calm, <br />
            <span className="text-brand-terracotta italic font-normal">intentional space</span> <br />
            for your solo life.
          </h1>

          <p className="font-sans text-xs md:text-sm text-brand-text-muted leading-relaxed max-w-xl opacity-0 animate-fade-in-up delay-300">
            SoloSphere isn’t a high-pressure productivity app or a corporate spreadsheet tool. It is a warm, thoughtfully designed digital journal to help you cook beautiful meals, cultivate daily habits, and manage your budgeting without the stress.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 font-sans text-xs font-semibold opacity-0 animate-fade-in-up delay-400">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-brand-terracotta text-brand-bg-warm px-6 py-3.5 rounded-brand hover:bg-brand-cinnamon shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 hover:scale-[1.02] active:translate-y-0 flex items-center gap-2"
            >
              Begin Your Journey
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => navigate('/signin')}
              className="bg-white text-brand-text-dark border border-brand-bg-beige px-6 py-3.5 rounded-brand hover:border-brand-text-muted/30 shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 hover:scale-[1.02] active:translate-y-0"
            >
              Sign In to Your Space
            </button>
          </div>
        </div>

        {/* Right Column - Layered card composition */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-6 opacity-0 animate-slide-in-right delay-400">
          <div className="w-full max-w-md relative group select-none">
            
            {/* Background supporting card (Offset peeking recipe card) */}
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-brand-lg border border-brand-bg-beige shadow-xs transform translate-x-6 translate-y-6 rotate-3 opacity-40 group-hover:opacity-60 group-hover:translate-x-8 group-hover:translate-y-8 group-hover:rotate-4 transition-all duration-500 ease-out flex flex-col justify-between p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-serif italic text-xs text-brand-olive font-medium">Nourishment</span>
                  <BookOpen size={16} className="text-brand-olive" />
                </div>
                <h4 className="font-serif text-base font-bold text-brand-text-dark line-clamp-1">Warm Fig & Honey Oatmeal</h4>
                <div className="w-full h-24 bg-brand-bg-warm rounded-brand overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=400" 
                    alt="Oatmeal preview" 
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
              </div>
              <div className="flex justify-between text-xxs font-sans text-brand-text-muted pt-4 border-t border-brand-bg-warm">
                <span className="flex items-center gap-1"><Clock size={11} /> 15m</span>
                <span className="flex items-center gap-1"><Flame size={11} /> 320 kcal</span>
              </div>
            </div>

            {/* Foreground main card (Quote reflection) */}
            <div className="w-full bg-white rounded-brand-lg p-8 relative flex flex-col justify-between shadow-sm border border-brand-bg-warm/50 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 ease-out z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent pointer-events-none rounded-brand-lg"></div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-serif italic text-xs text-brand-cinnamon font-medium">Solo Reflection</span>
                  <Coffee size={18} className="text-brand-gold" />
                </div>
                <p className="font-serif text-lg md:text-xl italic text-brand-text-dark leading-relaxed">
                  "Thriving alone is the gentle art of celebrating your own rhythms, cooking foods you love, and nourishing your physical space."
                </p>
              </div>

              <div className="pt-6 border-t border-brand-text-dark/5 flex items-center justify-between font-sans text-[10px] text-brand-text-muted mt-8">
                <span className="flex items-center gap-1">
                  <Sun size={12} className="text-brand-gold animate-spin" style={{ animationDuration: '25s' }} />
                  Morning check-in completed
                </span>
                <span className="font-semibold text-brand-terracotta">SoloSphere</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-brand-bg-beige/40 border-t border-b border-brand-text-muted/5">
        <div className="max-w-7xl w-full mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-4.5xl font-bold text-brand-text-dark">
              Every detail built for solo living
            </h2>
            <p className="font-sans text-xs md:text-sm text-brand-text-muted leading-relaxed">
              We design components that bring joy and warmth back into your daily routine. Here is what you can nurture within SoloSphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-8 rounded-brand border border-brand-bg-beige shadow-xs hover:shadow-md transition-shadow duration-300 flex gap-6 items-start text-left"
                >
                  <div className={`p-4 rounded-brand shrink-0 ${feat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-bold text-brand-text-dark">{feat.title}</h3>
                    <p className="font-sans text-xs text-brand-text-muted leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="px-6 md:px-12 py-8 bg-transparent border-t border-brand-text-muted/10">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-sans text-brand-text-muted font-medium">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 SoloSphere. All rights reserved. Cultivating slow spaces.</p>
            <p className="text-[9px] uppercase tracking-widest text-brand-text-muted/40 font-semibold">
              Made with care by Anshika & Anchal
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="#concept" className="hover:text-brand-text-dark transition-colors duration-200 underline-slide">Concept</a>
            <a href="#privacy" className="hover:text-brand-text-dark transition-colors duration-200 underline-slide">Privacy</a>
            <a href="#terms" className="hover:text-brand-text-dark transition-colors duration-200 underline-slide">Terms</a>
            <a href="#journal" className="hover:text-brand-text-dark transition-colors duration-200 underline-slide">Journal</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
