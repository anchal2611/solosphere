import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Calendar, 
  DollarSign, 
  BookOpen, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Heart,
  CheckCircle2,
  Bookmark,
  Sun,
  Moon
} from 'lucide-react';

export default function Dashboard() {
  const { profile, planner, expenses, recipes, blogPosts, notifications } = useContext(AppContext);
  const navigate = useNavigate();

  // Get current hour to set custom greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: `Good Morning, ${profile.name}`, icon: Sun };
    if (hour < 18) return { text: `Good Afternoon, ${profile.name}`, icon: Sparkles };
    return { text: `Good Evening, ${profile.name}`, icon: Moon };
  };

  const greetingObj = getGreeting();
  const GreetingIcon = greetingObj.icon;

  // 1. Calculate expense summary
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetPercent = Math.min(Math.round((totalSpent / profile.monthlyBudget) * 100), 100);

  // 2. Recipe Recommendation
  const recommendedRecipe = recipes[0];

  // 3. Recent Blog Post
  const featuredBlog = blogPosts.find(post => post.featured) || blogPosts[0];

  // 4. Next planner tasks (first 3 uncompleted)
  const pendingTasks = planner.tasks.filter(t => !t.completed).slice(0, 3);
  const completedCount = planner.tasks.filter(t => t.completed).length;

  const viewRecipeDetail = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Editorial Header */}
      <header className="space-y-3 border-b border-brand-text-muted/10 pb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-text-dark flex items-center gap-3">
          <GreetingIcon className="text-brand-gold shrink-0 animate-pulse" size={32} />
          {greetingObj.text}
        </h1>
        <p className="font-sans text-brand-text-muted text-base max-w-xl">
          Welcome to your quiet corner. Today is a clean slate to nourish yourself, manage your space, and rest.
        </p>
      </header>

      {/* ASYMMETRICAL CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Wellness/Motivational Card (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-brand-bg-beige p-8 rounded-brand shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={120} className="text-brand-terracotta" />
          </div>
          <div className="space-y-4 max-w-lg z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-terracotta/10 text-brand-terracotta rounded-full text-xs font-semibold">
              <Sparkles size={12} />
              <span>Daily Intention</span>
            </div>
            <p className="font-serif text-2xl italic text-brand-text-dark leading-relaxed">
              "Create a space that feels like a warm embrace. Give yourself permission to slow down, cook a beautiful meal for one, and let your mind drift."
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-brand-text-dark/5 flex flex-wrap gap-6 items-center z-10 justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-brand-terracotta fill-brand-terracotta" />
              <span className="font-sans text-sm text-brand-text-muted">Streak: <strong>{profile.streak} days</strong> of mindful habits</span>
            </div>
            <button 
              onClick={() => navigate('/planner')}
              className="font-sans text-sm text-brand-terracotta hover:text-brand-cinnamon font-semibold flex items-center gap-1 group/btn"
            >
              Check Habits
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Expense Card */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Budget Journal</h3>
              <DollarSign size={18} className="text-brand-gold" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-brand-text-muted font-sans">
                <span>Monthly Budget</span>
                <span>₹{profile.monthlyBudget}</span>
              </div>
              <p className="text-3xl font-serif font-bold text-brand-text-dark">
                ₹{totalSpent.toFixed(2)}
                <span className="text-xs text-brand-text-muted font-sans font-normal ml-1">spent so far</span>
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-brand-bg-warm h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-gold h-full rounded-full transition-all duration-500" 
                  style={{ width: `${budgetPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xxs font-sans text-brand-text-muted">
                <span>{budgetPercent}% spent</span>
                <span>₹{(profile.monthlyBudget - totalSpent).toFixed(2)} left</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-text-muted/10 flex items-center justify-between mt-4">
            <span className="text-xs text-brand-text-muted">Recent: Cinnamon Latte & Scone</span>
            <button 
              onClick={() => navigate('/expenses')}
              className="text-xs text-brand-terracotta hover:underline font-semibold"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Recipe Recommendation Card */}
        <div className="bg-white rounded-brand overflow-hidden shadow-sm border border-brand-bg-beige flex flex-col group hover:shadow-md transition-shadow duration-300">
          <div className="h-44 overflow-hidden relative">
            <img 
              src={recommendedRecipe.image} 
              alt={recommendedRecipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 bg-brand-bg-warm/95 px-2 py-0.5 rounded-full text-xxs font-semibold text-brand-text-dark shadow-sm">
              {recommendedRecipe.cuisine}
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xxs text-brand-terracotta font-sans uppercase tracking-widest font-semibold block">Nourishment</span>
              <h3 className="font-serif text-lg font-bold text-brand-text-dark leading-tight line-clamp-1">
                {recommendedRecipe.title}
              </h3>
              <p className="text-xs text-brand-text-muted font-sans line-clamp-2">
                {recommendedRecipe.description}
              </p>
            </div>
            
            <div className="pt-2 border-t border-brand-text-muted/10 flex items-center justify-between">
              <span className="text-xxs text-brand-text-muted font-sans">{recommendedRecipe.time} • {recommendedRecipe.difficulty}</span>
              <button 
                onClick={() => viewRecipeDetail(recommendedRecipe.id)}
                className="text-xs text-brand-terracotta hover:underline font-semibold flex items-center gap-0.5 group/btn"
              >
                Cook This
                <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Today's Priorities (Planner) */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Today's Notebook</h3>
              <Calendar size={18} className="text-brand-olive" />
            </div>
            
            {pendingTasks.length > 0 ? (
              <ul className="space-y-2.5">
                {pendingTasks.map(task => (
                  <li key={task.id} className="flex items-start gap-2.5 text-xs text-brand-text-dark">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-olive mt-1.5 shrink-0"></span>
                    <span className="font-sans line-clamp-2">{task.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 text-center">
                <CheckCircle2 size={24} className="text-brand-olive mx-auto mb-2 opacity-50" />
                <p className="font-sans text-xs text-brand-text-muted">All priority tasks checked off!</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-brand-text-muted/10 flex items-center justify-between mt-4">
            <span className="text-xs text-brand-text-muted">{completedCount} tasks completed today</span>
            <button 
              onClick={() => navigate('/planner')}
              className="text-xs text-brand-terracotta hover:underline font-semibold"
            >
              Open Planner
            </button>
          </div>
        </div>

        {/* Recent Blog Card */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-3">
            <span className="text-xxs text-brand-olive font-sans uppercase tracking-widest font-semibold block">Journal Reflection</span>
            <h3 className="font-serif text-lg font-bold text-brand-text-dark leading-snug line-clamp-2">
              {featuredBlog.title}
            </h3>
            <p className="text-xs text-brand-text-muted font-sans line-clamp-3">
              {featuredBlog.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-brand-text-muted/10 flex items-center justify-between mt-4">
            <span className="text-xxs text-brand-text-muted font-sans">{featuredBlog.readTime}</span>
            <button 
              onClick={() => navigate('/blog')}
              className="text-xs text-brand-terracotta hover:underline font-semibold flex items-center gap-0.5 group/btn"
            >
              Read Article
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cozy Stick-Note Reminder Card */}
        <div className="bg-[#FFFDF4] p-6 rounded-brand shadow-sm border border-[#F5EAD4] flex flex-col justify-between relative overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-300">
          {/* Tape Mock */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-brand-gold/20 shadow-sm rotate-[-2deg]"></div>
          
          <div className="space-y-4 mt-2">
            <span className="font-serif italic text-sm text-brand-cinnamon block border-b border-brand-gold/20 pb-1">Cozy Note</span>
            <p className="font-sans text-xs text-brand-text-dark leading-relaxed italic">
              "{planner.notes}"
            </p>
          </div>
          
          <div className="pt-4 flex justify-between items-center text-xxs font-sans text-brand-text-muted mt-4">
            <span>Written by you</span>
            <button 
              onClick={() => navigate('/planner')}
              className="text-brand-terracotta hover:underline font-semibold"
            >
              Edit Note
            </button>
          </div>
        </div>

        {/* Recent Activity Timeline (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-text-dark">Activity & Alerts</h3>
            
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-bg-beige">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex gap-4 items-start text-xs relative pl-6">
                  {/* Bullet */}
                  <span className={`absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    notif.type === 'reminder' ? 'bg-brand-orange' :
                    notif.type === 'warning' ? 'bg-brand-terracotta' :
                    notif.type === 'save' ? 'bg-brand-gold' : 'bg-brand-olive'
                  }`}></span>
                  <div className="flex-1">
                    <p className="font-sans text-brand-text-dark">{notif.text}</p>
                    <span className="text-xxs text-brand-text-muted block mt-0.5">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-text-muted/10 flex items-center justify-between mt-4">
            <span className="text-xs text-brand-text-muted">Total 5 notifications in inbox</span>
            <button 
              onClick={() => navigate('/notifications')}
              className="text-xs text-brand-terracotta hover:underline font-semibold"
            >
              View All Notifications
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
