import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Bookmark, 
  Clock, 
  Flame, 
  Sparkles, 
  Heart,
  Eye,
  X,
  Compass,
  FolderOpen,
  UtensilsCrossed,
  HelpCircle
} from 'lucide-react';

export default function Recipes({ setCurrentTab, setSelectedRecipeId, onSearchIngredients }) {
  const { recipes, profile, toggleRecipeSaved } = useContext(AppContext);

  // Search & Navigation States
  const [activeFolderTab, setActiveFolderTab] = useState('all'); // 'all' or 'saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Ingredient Prompt States
  const [promptText, setPromptText] = useState('');
  const [parsedIngredients, setParsedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptResults, setPromptResults] = useState(null); // null = not searched, [] = empty, [...] = results
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

    // Split by spaces, commas, semicolons, and remove punctuation
    const words = promptText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .split(/\s+/);

    const cleanKeywords = words
      .map(w => w.trim())
      .filter(w => w.length >= 3 && !stopWords.has(w));

    // Deduplicate
    const uniqueKeywords = [...new Set(cleanKeywords)];
    setParsedIngredients(uniqueKeywords);
  }, [promptText]);

  // Remove a parsed ingredient chip (removes it from prompt text)
  const handleRemoveChip = (chipToRemove) => {
    // Remove from parsed list
    const updatedChips = parsedIngredients.filter(c => c !== chipToRemove);
    setParsedIngredients(updatedChips);
    
    // Regulate prompt text slightly by removing that word
    const regex = new RegExp(`\\b${chipToRemove}\\b`, 'gi');
    setPromptText(prev => prev.replace(regex, '').replace(/\s+/g, ' ').trim());
  };

  // Submit Prompt to search
  const handlePromptSearch = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setPromptResults(null);
    setHasError(false);

    // Call external REST integration prop if defined
    if (onSearchIngredients) {
      try {
        const results = await onSearchIngredients(promptText);
        setPromptResults(results);
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Simulated local mock-REST call for preview functionality
    setTimeout(() => {
      setIsLoading(false);
      
      // If prompt has 'error', trigger simulated REST error
      if (promptText.toLowerCase().includes('error')) {
        setHasError(true);
        return;
      }

      // Check if any of the parsed keywords match ingredients in the recipes DB
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
    }, 1500);
  };

  // Regular catalog catalog filter
  const categoriesList = ['All', 'Breakfast', 'Lunch', 'Cozy Dinner', 'Dessert'];

  // Base list to show in grid
  const getBaseRecipes = () => {
    // If we have searched by ingredients prompt, prioritize those results
    if (promptResults !== null) {
      return promptResults;
    }
    
    // Otherwise, filter saved vs all
    if (activeFolderTab === 'saved') {
      return recipes.filter(r => profile.savedRecipes.includes(r.id));
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
    setSelectedRecipeId(id);
    setCurrentTab('recipe-detail');
  };

  const handleClearPromptSearch = () => {
    setPromptText('');
    setPromptResults(null);
    setHasError(false);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Editorial Header */}
      <header className="border-b border-brand-text-muted/10 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-brand-text-dark font-serif">Solo Kitchen</h1>
        <p className="font-sans text-brand-text-muted text-sm mt-1">
          Nourish yourself with intentional cooking. Sized for single portions.
        </p>
      </header>

      {/* 1. PRIMARY INGREDIENT PROMPT CARD (HERO ELEMENT) */}
      <section className="bg-white p-6 md:p-8 rounded-brand shadow-sm border border-brand-bg-beige space-y-5 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <UtensilsCrossed size={120} className="text-brand-terracotta" />
        </div>

        <div className="space-y-1.5 max-w-xl">
          <h3 className="font-serif text-lg md:text-xl font-bold text-brand-text-dark flex items-center gap-2">
            <Sparkles size={18} className="text-brand-terracotta" />
            What's in your pantry?
          </h3>
          <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
            Describe what you have on hand in normal language. We'll parse your ingredients and search matching dishes.
          </p>
        </div>

        <form onSubmit={handlePromptSearch} className="space-y-4 max-w-2xl font-sans text-xs">
          <div className="relative">
            <textarea
              rows="3"
              disabled={isLoading}
              placeholder="e.g. I have some eggs, baby spinach, and leftover mushrooms in my fridge"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full px-4 py-3 rounded-brand border border-brand-bg-beige bg-brand-bg-warm/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta leading-relaxed text-brand-text-dark placeholder-brand-text-muted/50 disabled:opacity-50"
            />
          </div>

          {/* Parsed ingredient chips */}
          {parsedIngredients.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-brand-text-muted font-semibold block">Detected Ingredients:</span>
              <div className="flex flex-wrap gap-2">
                {parsedIngredients.map((ingredient) => (
                  <span 
                    key={ingredient} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-olive/10 text-brand-olive font-medium rounded-full text-[10px] border border-brand-olive/20"
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !promptText.trim()}
              className="bg-brand-terracotta text-brand-bg-warm px-6 py-3 rounded-brand font-semibold hover:bg-brand-cinnamon shadow-sm transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search size={14} />
              Find Recipes
            </button>
            
            {promptResults !== null && (
              <button
                type="button"
                onClick={handleClearPromptSearch}
                className="bg-brand-bg-warm text-brand-text-dark border border-brand-bg-beige px-6 py-3 rounded-brand font-semibold hover:bg-brand-bg-beige transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TAB SHELF SWITCHER (All Recipes vs Saved Folder) */}
      <div className="flex justify-between items-center border-b border-brand-text-muted/10 pb-1">
        <div className="flex gap-6 font-serif text-lg font-bold">
          <button
            onClick={() => {
              setActiveFolderTab('all');
              setPromptResults(null);
            }}
            className={`pb-2 transition-all relative ${
              activeFolderTab === 'all' && promptResults === null
                ? 'text-brand-text-dark border-b-2 border-brand-terracotta'
                : 'text-brand-text-muted hover:text-brand-text-dark border-b-2 border-transparent'
            }`}
          >
            All Recipes
          </button>
          
          <button
            onClick={() => {
              setActiveFolderTab('saved');
              setPromptResults(null);
            }}
            className={`pb-2 transition-all relative flex items-center gap-1.5 ${
              activeFolderTab === 'saved' && promptResults === null
                ? 'text-brand-text-dark border-b-2 border-brand-terracotta'
                : 'text-brand-text-muted hover:text-brand-text-dark border-b-2 border-transparent'
            }`}
          >
            <FolderOpen size={16} />
            My Saved Folder
          </button>

          {promptResults !== null && (
            <span className="pb-2 text-brand-terracotta border-b-2 border-brand-terracotta">
              Pantry Results ({filteredRecipes.length})
            </span>
          )}
        </div>
      </div>

      {/* CATALOG BROWSING CONTROLS (Only visible if not viewing active prompt search) */}
      {promptResults === null && (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Traditional Search */}
          <div className="relative max-w-xs w-full font-sans text-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search recipe index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-brand border border-brand-bg-beige bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta transition-all shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none font-sans text-xxs">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full border transition-all duration-300 font-medium shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-olive text-brand-bg-warm border-brand-olive shadow-xs'
                    : 'bg-white text-brand-text-muted border-brand-bg-beige hover:text-brand-text-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. LOADING STATE (SKELETON CARDS) */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white rounded-brand border border-brand-bg-beige overflow-hidden p-6 space-y-4 animate-pulse">
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

      {/* 3. ERROR / LOCKOUT STATE */}
      {hasError && !isLoading && (
        <div className="h-64 flex flex-col justify-center items-center border border-brand-terracotta/20 rounded-brand bg-brand-terracotta/5 p-8 max-w-md mx-auto space-y-4">
          <HelpCircle size={36} className="text-brand-terracotta" />
          <h4 className="font-serif text-base font-bold text-brand-text-dark text-center">Simulated REST API Error</h4>
          <p className="text-xxs text-brand-text-muted font-sans text-center leading-relaxed">
            The endpoint failed to respond. Please review your backend MongoDB collection connectivity.
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

      {/* 4. TRUE MASONRY GRID (CSS Multi-column with break-inside: avoid) */}
      {!isLoading && !hasError && (
        <>
          {filteredRecipes.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredRecipes.map((recipe) => {
                const isSaved = profile.savedRecipes.includes(recipe.id);
                return (
                  <div
                    key={recipe.id}
                    className="break-inside-avoid bg-white rounded-brand border border-brand-bg-beige overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer flex flex-col relative"
                  >
                    
                    {/* Hover Actions Bar Overlay (LUCIDE ICONS, NO EMOJIS) */}
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
            <div className="h-64 flex flex-col justify-center items-center border border-dashed border-brand-bg-beige rounded-brand bg-white p-6">
              <UtensilsCrossed size={32} className="text-brand-text-muted opacity-40 mb-3" />
              <h4 className="font-serif text-sm font-bold text-brand-text-dark">No matches found</h4>
              <p className="text-xxs text-brand-text-muted font-sans text-center mt-1 max-w-xs leading-relaxed">
                {promptResults !== null 
                  ? "No recipes match your ingredients. Try removing some keywords from your prompt." 
                  : activeFolderTab === 'saved' 
                    ? "Your saved folder is empty. Browse recipes to save your favorites!" 
                    : "No matches match your current filter criteria."}
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
}
