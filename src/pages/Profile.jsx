import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  User, 
  Heart, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  Save, 
  CheckCircle2, 
  Coffee,
  Sun,
  Moon,
  ArrowRight,
  House,
  Leaf,
  Wheat,
  CupSoda
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile, recipes, expenses, categories } = useContext(AppContext);
  
  // Local edit states
  const [userName, setUserName] = useState(profile.name);
  const [userAvatar, setUserAvatar] = useState(profile.avatar);
  const [userBudget, setUserBudget] = useState(profile.monthlyBudget);
  const [userGoal, setUserGoal] = useState(profile.wellnessGoal);
  
  // Custom companion preferences
  const [coffeeLimit, setCoffeeLimit] = useState(2);
  const [wakeTime, setWakeTime] = useState('07:30');
  const [quietHour, setQuietHour] = useState('21:00');

  const [saveStatus, setSaveStatus] = useState('Saved');
  const avatarOptions = [
    { id: 'sun', Icon: Sun }, { id: 'leaf', Icon: Leaf }, { id: 'bread', Icon: Wheat },
    { id: 'tea', Icon: CupSoda }, { id: 'coffee', Icon: Coffee }, { id: 'home', Icon: House }
  ];
  const ActiveAvatar = avatarOptions.find(({ id }) => id === userAvatar)?.Icon || User;

  // 1. Math calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savedRecipesList = recipes.filter(r => profile.savedRecipes.includes(r.id));

  // Save changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        name: userName,
        avatar: userAvatar,
        monthlyBudget: parseFloat(userBudget),
        wellnessGoal: userGoal
      }));
      setSaveStatus('Saved');
    }, 600);
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Editorial Header */}
      <header className="border-b border-brand-text-muted/10 pb-6 space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark">Personal Space</h1>
        <p className="font-sans text-brand-text-muted text-sm">
          Customize your profile, review your monthly habits, and manage your companion settings.
        </p>
      </header>

      {/* Profile Overview (Avatar, Streaks, Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Main details & Edit */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <form onSubmit={handleSaveProfile} className="space-y-5 font-sans text-xs">
            <div className="flex flex-col items-center py-4 border-b border-brand-bg-warm space-y-3">
              <span className="p-4 bg-brand-bg-warm rounded-full hover:scale-105 transition-transform cursor-pointer select-none text-brand-terracotta">
                <ActiveAvatar size={38} aria-label="Selected profile icon" />
              </span>
              
              {/* Profile icon picker */}
              <div className="flex gap-1.5 justify-center py-1">
                {avatarOptions.map(({ id, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUserAvatar(id)}
                    aria-label={`Use ${id} profile icon`}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-all ${
                      userAvatar === id ? 'bg-brand-terracotta text-brand-bg-warm scale-110' : 'bg-brand-bg-warm hover:bg-brand-bg-beige text-brand-text-muted'
                    }`}
                  >
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-brand-text-muted font-semibold">Display Name</label>
              <input 
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-brand-text-muted font-semibold">Monthly Allowance Limit (₹)</label>
              <input 
                type="number"
                value={userBudget}
                onChange={(e) => setUserBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-brand-text-muted font-semibold">Daily Intention / Wellness Goal</label>
              <textarea 
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 focus:bg-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-terracotta text-brand-bg-warm py-2.5 rounded-brand font-semibold hover:bg-brand-cinnamon transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
            >
              <Save size={14} />
              {saveStatus === 'Saving...' ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Middle Card: Preferences Settings (Cozy elements) */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-6">
            <div className="border-b border-brand-bg-warm pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Companion Habits</h3>
              <p className="font-sans text-xxs text-brand-text-muted">Customize thresholds that trigger warnings or cozy notes.</p>
            </div>

            <div className="space-y-5 font-sans text-xs">
              
              {/* Daily Coffee Intake threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-brand-text-dark font-medium flex items-center gap-1.5">
                    <Coffee size={14} className="text-brand-cinnamon" />
                    Daily Coffee Limit
                  </label>
                  <span className="text-brand-text-muted">{coffeeLimit} cups</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="6"
                  value={coffeeLimit}
                  onChange={(e) => setCoffeeLimit(parseInt(e.target.value))}
                  className="w-full accent-brand-terracotta cursor-pointer"
                />
              </div>

              {/* Wake-up time picker */}
              <div className="flex items-center justify-between py-1">
                <label className="text-brand-text-dark font-medium flex items-center gap-1.5">
                  <Sun size={14} className="text-brand-gold" />
                  Target Wake-Up Time
                </label>
                <input 
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="px-2 py-1 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 text-brand-text-dark text-xs focus:outline-none cursor-pointer"
                />
              </div>

              {/* Quiet Hour / Night Wind down picker */}
              <div className="flex items-center justify-between py-1">
                <label className="text-brand-text-dark font-medium flex items-center gap-1.5">
                  <Moon size={14} className="text-brand-dusty" />
                  Quiet Hour Wind-Down
                </label>
                <input 
                  type="time"
                  value={quietHour}
                  onChange={(e) => setQuietHour(e.target.value)}
                  className="px-2 py-1 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/40 text-brand-text-dark text-xs focus:outline-none cursor-pointer"
                />
              </div>

            </div>
          </div>

          <div className="bg-brand-bg-warm/30 p-4 rounded-brand border border-brand-bg-beige/40 space-y-2 mt-6">
            <h4 className="font-serif font-bold text-xs text-brand-text-dark">Wellness Streak</h4>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-olive shrink-0" />
              <p className="font-sans text-xxs text-brand-text-muted">
                You've completed your daily reflections and habits for <strong>{profile.streak} days</strong> in a row!
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: Statistics & Budget Warnings */}
        <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-6">
            <div className="border-b border-brand-bg-warm pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Companion Analytics</h3>
              <p className="font-sans text-xxs text-brand-text-muted">High-level overview of your space activity.</p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center py-2 border-b border-brand-bg-warm/50">
                <span className="text-brand-text-muted">Bookmarked Recipes</span>
                <span className="font-serif font-bold text-brand-text-dark text-sm">{profile.savedRecipes.length} recipes</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-brand-bg-warm/50">
                <span className="text-brand-text-muted">Recorded Expenses</span>
                <span className="font-serif font-bold text-brand-text-dark text-sm">{expenses.length} logs</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-brand-text-muted">Budget Outlay</span>
                <div className="text-right">
                  <span className="font-serif font-bold text-brand-text-dark text-sm">
                    ₹{totalSpent.toFixed(2)}
                  </span>
                  <span className="text-xxs text-brand-text-muted block mt-0.5">out of ₹{profile.monthlyBudget}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Warning Check */}
          <div className="mt-6 border-t border-brand-text-muted/10 pt-4 space-y-3 font-sans text-xxs">
            <h4 className="font-bold text-brand-text-dark text-xxs uppercase tracking-wider">Aspirations Status</h4>
            {categories.map(cat => {
              const spent = expenses.filter(e => e.category.toLowerCase() === cat.name.toLowerCase()).reduce((s, e) => s + e.amount, 0);
              const warning = spent > cat.limit * 0.85;
              return (
                <div key={cat.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-brand-text-muted">{cat.name}</span>
                  </div>
                  {warning ? (
                    <span className="text-brand-terracotta font-semibold">Threshold Alarm!</span>
                  ) : (
                    <span className="text-brand-olive">Stable</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* BOOKMARKED RECIPES GRID LIST */}
      <section className="bg-white p-6 md:p-8 rounded-brand shadow-sm border border-brand-bg-beige hover:shadow-md transition-shadow duration-300 space-y-6">
        <div className="border-b border-brand-bg-warm pb-3 flex justify-between items-baseline">
          <div className="space-y-0.5">
            <h3 className="font-serif text-xl font-bold text-brand-text-dark">Saved Recipe Booklet</h3>
            <p className="font-sans text-xxs text-brand-text-muted">Dishes bookmarked for solo cook days.</p>
          </div>
          <button 
            onClick={() => navigate('/recipes')}
            className="text-xxs font-sans text-brand-terracotta hover:underline font-semibold flex items-center gap-0.5 group/btn"
          >
            Find more recipes
            <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {savedRecipesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipesList.map(recipe => (
              <div 
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.id)}
                className="rounded-brand border border-brand-bg-beige bg-brand-bg-warm/30 hover:bg-white overflow-hidden shadow-xs hover:shadow-sm hover:-translate-y-0.5 cursor-pointer transition-all duration-300 flex items-center gap-4 p-3 group"
              >
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-16 h-16 rounded object-cover shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-brand-text-dark leading-tight group-hover:text-brand-terracotta truncate transition-colors">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xxs text-brand-text-muted font-sans">
                    <span>{recipe.cuisine}</span>
                    <span>•</span>
                    <span>{recipe.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-brand-bg-warm/10 rounded border border-dashed border-brand-bg-beige">
            <p className="font-sans text-xs text-brand-text-muted">No saved recipes in your book.</p>
          </div>
        )}
      </section>

    </div>
  );
}
