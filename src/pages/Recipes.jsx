import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Bookmark, 
  Clock, 
  Flame, 
  Sparkles, 
  Eye,
  X,
  UtensilsCrossed,
  HelpCircle
} from 'lucide-react';

export default function Recipes() {
  const { recipes, profile, toggleRecipeSaved } = useContext(AppContext);
  const navigate = useNavigate();

  // Search & Navigation States
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Ingredient Prompt States
  const [promptText, setPromptText] = useState('');
  const [parsedIngredients, setParsedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptResults, setPromptResults] = useState(null); 
  const [hasError, setHasError] = useState(false);

  // Common stop words to filter out when parsing keywords
  const stopWords = new Set([
    'i', 'have', 'some', 'and', 'my', 'fridge', 'in', 'with', 'a', 'an', 'the', 'for', 
    'me', 'to', 'on', 'hand', 'of', 'some', 'any', 'leftover', 'leftovers', 'need', 
    'want', 'cook', 'make', 'recipe', 'recipes', 'using', 'about', 'just'
  ]);

  // Parse text into ingredient keywords
  useEffect(() => {
    if (!promptText.trim()) {
      setParsedIngredients([]);
      return;
    }

    const words = promptText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .split(/\s+/);

    const cleanKeywords = words
      .map(w => w.trim())
      .filter(w => w.length >= 3 && !stopWords.has(w));

    const uniqueKeywords = [...new Set(cleanKeywords)];
    setParsedIngredients(uniqueKeywords);
  }, [promptText]);

  // Remove a parsed ingredient chip
  const handleRemoveChip = (chipToRemove) => {
    const updatedChips = parsedIngredients.filter(c => c !== chipToRemove);
    setParsedIngredients(updatedChips);
    const regex = new RegExp(`\\b${chipToRemove}\\b`, 'gi');
    setPromptText(prev => prev.replace(regex, '').replace(/\s+/g, ' ').trim());
  };

  // Submit Prompt to search (Local simulation)
  const handlePromptSearch = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setPromptResults(null);
    setHasError(false);

    setTimeout(() => {
      setIsLoading(false);
      
      if (promptText.toLowerCase().includes('error')) {
        setHasError(true);
        return;
      }

      if (parsedIngredients.length === 0) {
        setPromptResults([]);
        return;
      }

      const matches = recipes.filter(recipe => {
        return parsedIngredients.some(keyword => {
          return recipe.ingredients.some(ing => ing.toLowerCase().includes(keyword)) ||
                 recipe.title.toLowerCase().includes(keyword);
        });
      });

      setPromptResults(matches);
      setShowOnlySaved(false); // Clear saved filter when showing prompt results to prevent state conflicts
    }, 1200);
  };

  // Category tags
  const categoriesList = ['All', 'Breakfast', 'Lunch', 'Cozy Dinner', 'Dessert'];

  // Base list to show in grid (filters by saved booklet vs prompt index)
  const getBaseRecipes = () => {
    if (showOnlySaved) {
      return recipes.filter(r => profile.savedRecipes.includes(r.id));
    }
    if (promptResults !== null) {
      return promptResults;
    }
    return recipes;
  };

  const filteredRecipes = getBaseRecipes().filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.cuisine.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'Lunch' && recipe.cuisine.includes('Lunch'));
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  const handleClearPromptSearch = () => {
    setPromptText('');
    setPromptResults(null);
    setHasError(false);
  };

  return (
    <div className="space-y-8 animate-slide-up w-full max-w-7xl mx-auto">
      
      {/* Editorial Header Section */}
      <header className="border-b border-brand-text-muted/10 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1 text-left">
            <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark font-serif">Solo Kitchen</h1>
            <p className="font-sans text-brand-text-muted text-sm mt-0.5">
              Nourish yourself with intentional cooking. Sized for single portions.
            </p>
          </div>
          
          {/* Outlined Saved Recipes Toggle Button */}
          <button
            onClick={() => {
              setShowOnlySaved(prev => !prev);
              setPromptResults(null); // Reset ingredient search to clear confusion when filtering saved
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-brand border text-xs font-sans font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0 ${
              showOnlySaved
                ? 'bg-brand-terracotta text-brand-bg-warm border-brand-terracotta shadow-xs font-bold'
                : 'bg-white text-brand-text-muted border-brand-bg-beige hover:text-brand-text-dark hover:border-brand-text-muted/30'
            }`}
          >
            <Bookmark size={14} className={showOnlySaved ? 'fill-brand-bg-warm' : ''} />
            <span>Saved Recipes ({profile.savedRecipes.length})</span>
          </button>
        </div>

        {/* Compact & Slim Catalog Search Bar */}
        <div className="relative max-w-md w-full font-sans text-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search recipe catalog by keyword or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:border-brand-terracotta/40 focus:ring-4 focus:ring-brand-terracotta/5 transition-all duration-300 shadow-xs"
          />
        </div>
      </header>

      {/* 1. VISUALLY DOMINANT INGREDIENT PROMPT CARD (WARM GRADIENT TINT HERO) */}
      <section className="bg-gradient-to-br from-[#FDFBF8] via-[#FAF6EE] to-[#F4EEE6] p-8 md:p-10 rounded-brand shadow-sm border border-brand-gold/30 space-y-6 text-left relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <UtensilsCrossed size={140} className="text-brand-terracotta" />
        </div>

        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] text-brand-terracotta font-sans uppercase tracking-widest font-bold block">Pantry Matcher</span>
          <h2 className="font-serif text-2xl md:text-3.5xl font-bold text-brand-text-dark flex items-center gap-2">
            <Sparkles size={24} className="text-brand-terracotta animate-pulse" />
            What's in your kitchen today?
          </h2>
          <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
            Write down what leftovers or basic ingredients you have lying around. We will parse the text and recommend portion-sized recipes.
          </p>
        </div>

        <form onSubmit={handlePromptSearch} className="space-y-4 w-full font-sans text-xs">
          <div className="relative">
            <textarea
              rows="3"
              disabled={isLoading}
              placeholder="e.g. I have some eggs, baby spinach, and leftover mushrooms in my fridge"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full px-4 py-3.5 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta leading-relaxed text-brand-text-dark placeholder-brand-text-muted/40 disabled:opacity-50 shadow-xs"
            />
          </div>

          {/* Parsed ingredient chips */}
          {parsedIngredients.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-brand-text-muted font-bold block">Parsed keywords:</span>
              <div className="flex flex-wrap gap-2">
                {parsedIngredients.map((ingredient) => (
                  <span 
                    key={ingredient} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-olive/10 text-brand-olive font-semibold rounded-full text-[10px] border border-brand-olive/20 shadow-xs"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveChip(ingredient)}
                      className="hover:text-brand-terracotta text-brand-olive/70 shrink-0"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || !promptText.trim()}
              className="bg-brand-terracotta text-brand-bg-warm px-6 py-3.5 rounded-brand font-semibold hover:bg-brand-cinnamon shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search size={14} />
              Find Recipes
            </button>
            
            {promptResults !== null && (
              <button
                type="button"
                onClick={handleClearPromptSearch}
                className="bg-white text-brand-text-dark border border-brand-bg-beige px-6 py-3.5 rounded-brand font-semibold hover:bg-brand-bg-warm transition-all shadow-xs"
              >
                Clear Search
              </button>
            )}
          </div>
        </form>
      </section>

      {/* CATEGORY CHIPS ROW (Unified styles, Horizontal Scroll) */}
      <div className="border-b border-brand-text-muted/10 pb-3 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center w-full">
        <span className="font-serif text-xl font-bold tracking-tight text-brand-text-dark select-none">
          {showOnlySaved 
            ? `Saved Favorites (${filteredRecipes.length})` 
            : promptResults !== null 
              ? `Matching Pantry Recipes (${filteredRecipes.length})` 
              : 'Browse Catalog'}
        </span>

        {/* Chips index */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-none snap-x font-sans text-xs w-full md:w-auto">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium shrink-0 snap-center ${
                selectedCategory === cat
                  ? 'bg-brand-terracotta text-brand-bg-warm border-brand-terracotta shadow-xs font-semibold'
                  : 'bg-white text-brand-text-muted border-brand-bg-beige hover:text-brand-text-dark hover:border-brand-text-muted/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LOADING STATE (SKELETON CARDS) */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white rounded-brand border border-brand-bg-beige overflow-hidden p-6 space-y-4 animate-pulse w-full">
              <div className="h-44 bg-brand-bg-warm rounded-brand w-full"></div>
              <div className="h-6 bg-brand-bg-warm rounded w-3/4"></div>
              <div className="h-4 bg-brand-bg-warm rounded w-full"></div>
              <div className="flex justify-between pt-4 border-t border-brand-bg-warm">
                <div className="h-4 bg-brand-bg-warm rounded w-1/4"></div>
                <div className="h-4 bg-brand-bg-warm rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ERROR STATE */}
      {hasError && !isLoading && (
        <div className="h-64 flex flex-col justify-center items-center border border-brand-terracotta/20 rounded-brand bg-brand-terracotta/5 p-8 max-w-md mx-auto space-y-4">
          <HelpCircle size={36} className="text-brand-terracotta" />
          <h4 className="font-serif text-base font-bold text-brand-text-dark text-center">API Match Error</h4>
          <p className="text-xxs text-brand-text-muted font-sans text-center leading-relaxed">
            The matching index server failed to respond. Please review your backend MongoDB collection connectivity.
          </p>
          <button 
            type="button" 
            onClick={handleClearPromptSearch}
            className="bg-brand-terracotta text-brand-bg-warm px-4 py-2 rounded-brand font-sans text-xxs font-semibold"
          >
            Reset Search
          </button>
        </div>
      )}

      {/* 4. TRUE MASONRY GRID (Using full content width) */}
      {!isLoading && !hasError && (
        <div className="w-full">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredRecipes.map((recipe) => {
                const isSaved = profile.savedRecipes.includes(recipe.id);
                return (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-brand border border-brand-bg-beige overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer flex flex-col relative w-full h-full"
                  >
                    
                    {/* Hover Actions Bar Overlay */}
                    <div className="absolute top-3 right-3 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecipeSaved(recipe.id);
                        }}
                        className="p-2 bg-brand-bg-warm/95 hover:bg-white rounded-full text-brand-text-dark hover:scale-105 active:scale-95 duration-200 shadow-sm"
                        title={isSaved ? "Saved" : "Save Recipe"}
                      >
                        <Bookmark size={13} className={isSaved ? 'text-brand-terracotta fill-brand-terracotta' : 'text-brand-text-muted'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(recipe.id);
                        }}
                        className="p-2 bg-brand-bg-warm/95 hover:bg-white rounded-full text-brand-text-dark hover:scale-105 active:scale-95 duration-200 shadow-sm"
                        title="View recipe details"
                      >
                        <Eye size={13} className="text-brand-text-muted hover:text-brand-text-dark" />
                      </button>
                    </div>

                    {/* Recipe Image */}
                    <div className="overflow-hidden h-44 sm:h-52 relative" onClick={() => handleCardClick(recipe.id)}>
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 bg-brand-bg-warm/90 px-2 py-0.5 rounded-full text-xxs font-semibold text-brand-text-dark">
                        {recipe.cuisine}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between" onClick={() => handleCardClick(recipe.id)}>
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-base font-bold text-brand-text-dark group-hover:text-brand-terracotta transition-colors leading-snug">
                          {recipe.title}
                        </h4>
                        <p className="text-xxs text-brand-text-muted font-sans line-clamp-3 leading-relaxed">
                          {recipe.description}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="pt-3 border-t border-brand-text-muted/10 flex items-center justify-between font-sans text-[10px] text-brand-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {recipe.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={10} />
                          {recipe.calories}
                        </span>
                        <span className="font-medium text-brand-olive px-1.5 py-0.5 bg-brand-olive/5 rounded-brand-sm">
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            // 5. EMPTY STATE
            <div className="h-64 flex flex-col justify-center items-center border border-dashed border-brand-bg-beige rounded-brand bg-white p-6 w-full">
              <UtensilsCrossed size={32} className="text-brand-text-muted opacity-40 mb-3" />
              <h4 className="font-serif text-sm font-bold text-brand-text-dark">No matches found</h4>
              <p className="text-xxs text-brand-text-muted font-sans text-center mt-1 max-w-xs leading-relaxed">
                {showOnlySaved 
                  ? "Your saved favorites list is currently empty. Bookmark some recipes from the catalog to see them here!" 
                  : promptResults !== null 
                    ? "No recipes match your pantry ingredients. Try adjusting your search description or clearing the search." 
                    : "No recipes found matching your search parameters."}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
