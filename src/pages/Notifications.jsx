import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Bell, 
  Clock, 
  Trash2, 
  Bookmark, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Info 
} from 'lucide-react';

export default function Notifications() {
  const { notifications, clearNotifications } = useContext(AppContext);

  // Group notifications
  const groups = ['Today', 'Yesterday', 'Earlier'];

  const getIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <AlertTriangle size={15} className="text-brand-orange" />;
      case 'warning':
        return <AlertTriangle size={15} className="text-brand-terracotta" />;
      case 'save':
        return <Bookmark size={15} className="text-brand-gold fill-brand-gold/10" />;
      case 'expense':
        return <DollarSign size={15} className="text-brand-terracotta" />;
      case 'info':
        return <CheckCircle2 size={15} className="text-brand-olive" />;
      default:
        return <Info size={15} className="text-brand-text-muted" />;
    }
  };

  const getBulletBg = (type) => {
    switch (type) {
      case 'reminder': return 'bg-brand-orange/10 border-brand-orange/20';
      case 'warning': return 'bg-brand-terracotta/10 border-brand-terracotta/20';
      case 'save': return 'bg-brand-gold/10 border-brand-gold/20';
      case 'expense': return 'bg-brand-terracotta/10 border-brand-terracotta/20';
      case 'info': return 'bg-brand-olive/10 border-brand-olive/20';
      default: return 'bg-brand-bg-beige border-brand-text-muted/10';
    }
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-3xl mx-auto">
      
      {/* Editorial Header */}
      <header className="flex justify-between items-baseline border-b border-brand-text-muted/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark">Inbox & Alerts</h1>
          <p className="font-sans text-brand-text-muted text-sm">
            Keep track of your reminders, budget thresholds, and kitchen saves.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="font-sans text-xs text-brand-text-muted hover:text-brand-terracotta font-medium flex items-center gap-1 py-1 px-3.5 hover:bg-brand-bg-beige rounded-brand transition-all"
          >
            <Trash2 size={12} />
            Clear All
          </button>
        )}
      </header>

      {/* Notifications Grouped List */}
      {notifications.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => {
            const groupNotifs = notifications.filter(n => n.group === group);
            if (groupNotifs.length === 0) return null;

            return (
              <div key={group} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-brand-text-dark border-b border-brand-bg-beige pb-1 w-fit">
                  {group}
                </h3>
                
                <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-bg-beige">
                  {groupNotifs.map((notif) => (
                    <div 
                      key={notif.id}
                      className="bg-white p-4 rounded-brand border border-brand-bg-beige shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 relative pl-12 group"
                    >
                      {/* Icon Circle */}
                      <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${getBulletBg(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="font-sans text-xs text-brand-text-dark font-medium leading-relaxed">
                          {notif.text}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-brand-text-muted font-sans">
                          <Clock size={10} />
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex flex-col justify-center items-center border border-dashed border-brand-bg-beige rounded-brand bg-white">
          <Bell size={32} className="text-brand-text-muted opacity-40 mb-3" />
          <p className="text-sm text-brand-text-muted font-sans">All caught up!</p>
          <p className="text-xxs text-brand-text-muted font-sans mt-1">There are no notifications in your inbox.</p>
        </div>
      )}

    </div>
  );
}
