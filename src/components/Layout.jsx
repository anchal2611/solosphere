import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Home, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  FileText, 
  Bell, 
  User, 
  Menu, 
  X,
  Compass,
  LogOut
} from 'lucide-react';

export default function Layout({ children, currentTab, setCurrentTab }) {
  const { notifications, profile, setProfile } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Count unread notifications (simple mock: count today's notifications)
  const unreadCount = notifications.filter(n => n.group === 'Today').length;

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'expenses', label: 'Expense Tracker', icon: DollarSign },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Return to Landing Page and clear auth simulation
    setCurrentTab('landing');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg-warm selection:bg-brand-gold/30 selection:text-brand-text-dark relative">
      
      {/* MOBILE TOP BAR (Fixed on mobile viewport) */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-brand-bg-beige border-b border-brand-text-muted/10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2" onClick={() => setCurrentTab('dashboard')}>
          <Compass className="text-brand-terracotta" size={20} />
          <span className="font-serif font-bold text-lg tracking-wide text-brand-text-dark cursor-pointer">SoloSphere</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-brand-text-dark hover:bg-brand-bg-warm rounded-brand transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* MOBILE NAV DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-brand-text-dark/40 z-50 transition-opacity duration-300 md:hidden">
          {/* Drawer container */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-xs bg-brand-bg-beige p-6 shadow-2xl flex flex-col animate-slide-right">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Compass className="text-brand-terracotta" size={20} />
                <span className="font-serif font-bold text-lg text-brand-text-dark">SoloSphere</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-brand-text-dark hover:bg-brand-bg-warm rounded-brand transition-colors"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id || (item.id === 'recipes' && currentTab === 'recipe-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-brand text-left font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-brand-terracotta text-brand-bg-warm shadow-md' 
                        : 'text-brand-text-muted hover:bg-brand-bg-warm hover:text-brand-text-dark'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-brand-bg-warm' : 'text-brand-text-muted'} />
                    <span className="font-sans">{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-brand-bg-warm text-brand-terracotta' : 'bg-brand-terracotta text-brand-bg-warm'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Logout Option */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-brand text-left font-medium text-brand-text-muted hover:bg-brand-bg-warm hover:text-brand-terracotta transition-colors mt-2"
            >
              <LogOut size={20} className="text-brand-text-muted" />
              <span className="font-sans">Exit Space</span>
            </button>

            {/* Mobile Footer */}
            <div className="mt-auto pt-6 border-t border-brand-text-muted/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center font-semibold shadow-xs">
                <User size={18} />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-brand-text-dark">{profile.name}</p>
                <p className="font-sans text-xs text-brand-text-muted">Companion Space</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP / TABLET STICKY SIDEBAR (Never moves or scrolls) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-brand-bg-beige border-r border-brand-text-muted/10 h-screen sticky top-0 self-start px-4 py-8 z-30 transition-all duration-300 shadow-sm justify-between shrink-0">
        
        <div className="flex flex-col">
          {/* Logo / Header */}
          <div 
            className="flex items-center gap-3 px-3 mb-10 justify-center lg:justify-start cursor-pointer"
            onClick={() => setCurrentTab('dashboard')}
          >
            <Compass className="text-brand-terracotta animate-pulse" size={24} />
            <span className="hidden lg:inline font-serif font-bold text-xl tracking-wide text-brand-text-dark">
              SoloSphere
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'recipes' && currentTab === 'recipe-detail');
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full relative group flex items-center gap-4 px-3.5 py-3 rounded-brand transition-all duration-300 justify-center lg:justify-start ${
                    isActive 
                      ? 'bg-brand-terracotta text-brand-bg-warm shadow-md' 
                      : 'text-brand-text-muted hover:bg-brand-bg-warm hover:text-brand-text-dark'
                  }`}
                  title={item.label}
                >
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-300 group-hover:scale-105 ${
                      isActive ? 'text-brand-bg-warm' : 'text-brand-text-muted group-hover:text-brand-text-dark'
                    }`} 
                  />
                  <span className="hidden lg:inline font-sans font-medium text-sm">
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge > 0 && (
                    <span className={`absolute lg:static top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full text-xxs lg:text-xs px-1 font-bold ${
                      isActive ? 'bg-brand-bg-warm text-brand-terracotta' : 'bg-brand-terracotta text-brand-bg-warm'
                    } lg:ml-auto`}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Tooltip for tablet view */}
                  <span className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-brand-text-dark text-brand-bg-warm text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Profile Info & Logout */}
        <div className="flex flex-col gap-4 border-t border-brand-text-muted/10 pt-6">
          <div className="flex items-center gap-3 px-2 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center font-semibold shadow-xs">
              <User size={18} />
            </div>
            <div className="hidden lg:block">
              <p className="font-sans text-sm font-semibold text-brand-text-dark leading-tight">{profile.name}</p>
              <p className="font-sans text-xs text-brand-text-muted mt-0.5">Companion Mode</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3.5 py-3 rounded-brand text-brand-text-muted hover:bg-brand-bg-warm hover:text-brand-terracotta transition-colors justify-center lg:justify-start font-sans text-xs font-semibold"
            title="Exit Space"
          >
            <LogOut size={18} className="text-brand-text-muted group-hover:text-brand-terracotta" />
            <span className="hidden lg:inline">Exit Space</span>
          </button>
        </div>

      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="flex-1 px-4 sm:px-8 py-8 md:py-10 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>

    </div>
  );
}
