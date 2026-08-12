function normaliseText(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function textMatch(recipeValue, expected, weight) {
  if (!expected || !recipeValue) return 0;
  const val = String(recipeValue).toLowerCase();
  const exp = String(expected).toLowerCase();
  return val.includes(exp) ? weight : 0;
}

export function rankRecipes(recipes, preferences) {
  const requestedIngredients = (preferences.ingredients || []).map(normaliseText).filter(Boolean);
  const keywordQuery = [...(preferences.ingredients || []), preferences.taste].map(normaliseText).filter(Boolean);

  const scored = recipes.map(recipe => {
    let score = 0;

    // 1. Ingredients overlap
    if (requestedIngredients.length > 0) {
      const recipeIngredients = new Set((recipe.ingredients_search || []).map(normaliseText).filter(Boolean));
      let intersection = 0;
      for (const ing of requestedIngredients) {
        if (recipeIngredients.has(ing)) {
          intersection++;
        }
      }
      const overlap = intersection / requestedIngredients.length;
      score += overlap * 60;
    }

    // 2. Keyword match
    if (keywordQuery.length > 0) {
      const keywordText = String(recipe.search_text || recipe.name || "").toLowerCase();
      let match = false;
      for (const word of keywordQuery) {
        if (keywordText.includes(word)) {
          match = true;
          break;
        }
      }
      if (match) {
        score += 15;
      }
    }

    // 3. Diet match
    score += textMatch(recipe.diet, preferences.diet, 10);

    // 4. Meal Type (course) match
    score += textMatch(recipe.course || recipe.meal_type, preferences.mealType, 5);

    // 5. Cuisine match
    score += textMatch(recipe.cuisine, preferences.cuisine, 5);

    // 6. Max Time match
    if (preferences.maxTime !== null && preferences.maxTime !== undefined) {
      const totalTime = parseInt(recipe.total_time);
      if (!isNaN(totalTime) && totalTime <= preferences.maxTime) {
        score += 5;
      }
    }

    return { ...recipe, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score);
}
