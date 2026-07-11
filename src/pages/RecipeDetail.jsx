import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ArrowLeft, 
  Bookmark, 
  Printer, 
  Sparkles, 
  Check, 
  Clock, 
  Flame, 
  Zap,
  Info 
} from 'lucide-react';

export default function RecipeDetail({ recipeId, setCurrentTab }) {
  const { recipes, profile, toggleRecipeSaved, addNotification } = useContext(AppContext);
  
  // Find recipe
  const recipe = recipes.find(r => r.id === recipeId) || recipes[0];
  const isSaved = profile.savedRecipes.includes(recipe.id);

  // States
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuggestion, setGeneratedSuggestion] = useState(null);

  // Toggle ingredient checklist
  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Simulate print command
  const handlePrint = () => {
    window.print();
  };

  // Simulate "Generate Similar Recipe"
  const handleGenerateSimilar = () => {
    setIsGenerating(true);
    setGeneratedSuggestion(null);

    setTimeout(() => {
      setIsGenerating(false);
      
      const suggestions = [
        { title: 'Spiced Baked Apple with Oat Crumble', type: 'Dessert' },
        { title: 'Honey Glazed Roasted Acorn Squash', type: 'Dinner' },
        { title: 'Velvety Mushroom & Wild Rice Soup', type: 'Lunch' },
        { title: 'Cardamom Cinnamon Stewed Plums', type: 'Breakfast' }
      ];
      
      // Select random item
      const randomItem = suggestions[Math.floor(Math.random() * suggestions.length)];
      setGeneratedSuggestion(randomItem);

      // Notification
      addNotification({
        type: 'info',
        text: `Generated similar recipe proposal: ${randomItem.title}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        group: 'Today'
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-4xl mx-auto">
      
      {/* Navigation & Actions Top Bar */}
      <div className="flex justify-between items-center pb-2 border-b border-brand-text-muted/10">
        <button
          onClick={() => setCurrentTab('recipes')}
          className="font-sans text-xs text-brand-text-muted hover:text-brand-text-dark flex items-center gap-1.5 py-2 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Recipes
        </button>

        <div className="flex items-center gap-2">
          {/* Save Recipe */}
          <button
            onClick={() => toggleRecipeSaved(recipe.id)}
            className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
              isSaved
                ? 'bg-brand-terracotta text-brand-bg-warm border-brand-terracotta'
                : 'bg-white text-brand-text-muted border-brand-bg-beige hover:text-brand-text-dark'
            }`}
            title={isSaved ? "Saved" : "Save Recipe"}
          >
            <Bookmark size={15} className={isSaved ? 'fill-brand-bg-warm' : ''} />
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2 bg-white text-brand-text-muted border border-brand-bg-beige hover:text-brand-text-dark hover:border-brand-text-muted/30 rounded-full transition-all"
            title="Print recipe card"
          >
            <Printer size={15} />
          </button>
        </div>
      </div>

      {/* Hero Header Layout */}
      <div className="space-y-4">
        <span className="text-xxs uppercase tracking-widest text-brand-terracotta font-sans font-semibold">
          {recipe.cuisine} • portioned for one
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-brand-text-dark leading-tight">
          {recipe.title}
        </h2>
        <p className="font-sans text-sm text-brand-text-muted leading-relaxed max-w-2xl">
          {recipe.description}
        </p>

        {/* Quick info list */}
        <div className="flex gap-6 pt-2 pb-4 font-sans text-xs text-brand-text-dark flex-wrap">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-terracotta" />
            <span>Time: <strong>{recipe.time}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-brand-gold" />
            <span>Calories: <strong>{recipe.calories}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-brand-olive" />
            <span>Prep: <strong>{recipe.difficulty}</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-64 md:h-[420px] rounded-brand-lg overflow-hidden shadow-sm">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Two Column details: Main steps, Sidebar Nutrition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* main recipe steps & ingredients */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Ingredients list */}
          <section className="bg-white p-6 rounded-brand border border-brand-bg-beige space-y-4 shadow-xs">
            <div className="flex justify-between items-baseline border-b border-brand-bg-warm pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Ingredients</h3>
              <span className="text-xxs text-brand-text-muted font-sans font-normal">Check off as you gather</span>
            </div>
            
            <ul className="space-y-2.5 font-sans text-xs">
              {recipe.ingredients.map((ing, idx) => {
                const checked = checkedIngredients[idx];
                return (
                  <li 
                    key={idx} 
                    onClick={() => toggleIngredient(idx)}
                    className="flex items-center gap-3 cursor-pointer group select-none py-1"
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      checked 
                        ? 'bg-brand-olive border-brand-olive text-brand-bg-warm scale-95' 
                        : 'border-brand-bg-beige group-hover:border-brand-text-muted/40 bg-brand-bg-warm/30'
                    }`}>
                      {checked && <Check size={12} />}
                    </div>
                    <span className={`transition-all ${
                      checked ? 'line-through text-brand-text-muted opacity-60' : 'text-brand-text-dark font-medium'
                    }`}>
                      {ing}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Cooking Instructions */}
          <section className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-text-dark border-b border-brand-text-muted/10 pb-3">
              Instructions
            </h3>
            
            <ol className="space-y-6">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  {/* Step Number Badge */}
                  <span className="w-7 h-7 rounded-full bg-brand-bg-beige flex items-center justify-center font-serif font-semibold text-xs text-brand-text-dark shrink-0 mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <p className="font-sans text-xs text-brand-text-dark leading-relaxed">
                      {step}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

        </div>

        {/* Sidebar: Nutrition Info & AI Actions */}
        <div className="space-y-6">
          
          {/* Nutrition Stats */}
          <div className="bg-brand-bg-beige p-6 rounded-brand shadow-sm border border-brand-text-muted/5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-brand-text-dark/5 pb-3">
              <Info size={16} className="text-brand-olive" />
              <h3 className="font-serif text-base font-bold text-brand-text-dark">Nutrition Facts</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/60 p-3 rounded-brand shadow-xs">
                <span className="block text-xxs text-brand-text-muted font-sans">Carbs</span>
                <span className="font-serif font-bold text-sm text-brand-text-dark">{recipe.nutrition.carbs}</span>
              </div>
              <div className="bg-white/60 p-3 rounded-brand shadow-xs">
                <span className="block text-xxs text-brand-text-muted font-sans">Protein</span>
                <span className="font-serif font-bold text-sm text-brand-text-dark">{recipe.nutrition.protein}</span>
              </div>
              <div className="bg-white/60 p-3 rounded-brand shadow-xs">
                <span className="block text-xxs text-brand-text-muted font-sans">Fat</span>
                <span className="font-serif font-bold text-sm text-brand-text-dark">{recipe.nutrition.fat}</span>
              </div>
              <div className="bg-white/60 p-3 rounded-brand shadow-xs">
                <span className="block text-xxs text-brand-text-muted font-sans">Fiber</span>
                <span className="font-serif font-bold text-sm text-brand-text-dark">{recipe.nutrition.fiber}</span>
              </div>
            </div>
            
            <p className="font-sans text-xxs text-brand-text-muted text-center italic mt-2">
              Estimates computed per single portion.
            </p>
          </div>

          {/* AI Generator action */}
          <div className="bg-white p-6 rounded-brand shadow-sm border border-brand-bg-beige space-y-4">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-brand-text-dark">Solo Kitchen Assistant</h4>
              <p className="font-sans text-xxs text-brand-text-muted">
                Need options? Craft a brand new proposal based on these ingredients.
              </p>
            </div>

            {generatedSuggestion ? (
              <div className="p-3 bg-brand-olive/5 rounded-brand border border-brand-olive/10 space-y-2 animate-fade-in">
                <div className="flex items-center gap-1.5 text-brand-olive text-xxs font-semibold">
                  <Check size={12} />
                  <span>Proposal Generated!</span>
                </div>
                <p className="font-serif text-xs font-bold text-brand-text-dark leading-tight">
                  {generatedSuggestion.title}
                </p>
                <span className="inline-block text-xxs font-sans text-brand-text-muted">
                  Category: {generatedSuggestion.type}
                </span>
                <button
                  onClick={() => setGeneratedSuggestion(null)}
                  className="block text-xxs font-sans text-brand-terracotta hover:underline font-semibold mt-1"
                >
                  Clear suggestion
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerateSimilar}
                disabled={isGenerating}
                className="w-full bg-brand-bg-beige text-brand-text-dark border border-brand-text-muted/10 hover:border-brand-terracotta/30 py-2.5 rounded-brand font-semibold hover:bg-brand-bg-warm transition-all duration-300 font-sans text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} className={isGenerating ? 'animate-spin text-brand-terracotta' : 'text-brand-terracotta'} />
                {isGenerating ? 'Curating ingredients...' : 'Generate Similar Recipe'}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
