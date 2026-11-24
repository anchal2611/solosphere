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
  const { notifications, clearNotifications, markNotificationAsRead, deleteNotification } = useContext(AppContext);

  const getDateKey = (date) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  };
  const todayKey = getDateKey(new Date());
  const [year, month, day] = todayKey.split('-').map(Number);
  const yesterdayKey = getDateKey(new Date(Date.UTC(year, month - 1, day - 1, 12)));
  const getNotificationDate = (notification) => {
    if (notification.createdAt) return new Date(notification.createdAt);
    const legacyIdTimestamp = Number(notification.id);
    return legacyIdTimestamp > 1_000_000_000_000 ? new Date(legacyIdTimestamp) : null;
  };
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = getNotificationDate(notification);
    const dateKey = date ? getDateKey(date) : null;
    const group = dateKey === todayKey ? 'Today' : dateKey === yesterdayKey ? 'Yesterday' : 'Earlier';
    groups[group].push(notification);
    return groups;
  }, { Today: [], Yesterday: [], Earlier: [] });
  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

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
          {groupOrder.map((group) => {
            const groupNotifs = groupedNotifications[group];
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

                       <div className="flex-1 flex justify-between items-start gap-4">
                        <div className="space-y-1 min-w-0">
                          <p className={`font-sans text-xs leading-relaxed ${notif.read ? 'text-brand-text-muted opacity-60 line-through' : 'text-brand-text-dark font-medium'}`}>
                            {notif.text}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-brand-text-muted font-sans">
                            <Clock size={10} />
                            <span>{notif.time || getNotificationDate(notif)?.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) || 'Time unavailable'}</span>
                            {notif.read && <span className="text-brand-olive font-semibold ml-1.5">• Read</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="text-[10px] font-sans font-semibold text-brand-olive hover:text-brand-sage bg-brand-olive/5 hover:bg-brand-olive/10 px-2 py-1 rounded transition-all cursor-pointer"
                              title="Mark as read"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-brand-text-muted hover:text-brand-terracotta p-1 hover:bg-brand-bg-warm rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                            title="Delete notification"
                          >
                            <Trash2 size={12} />
                          </button>
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
