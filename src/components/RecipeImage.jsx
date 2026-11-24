import React, { useEffect, useState } from 'react';

const mealImageRequests = new Map();

const normalize = (value) => value.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const findMealImage = (title) => {
  const query = normalize(title);
  if (!query) return Promise.resolve(null);
  if (!mealImageRequests.has(query)) {
    const request = (async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const data = response.ok ? await response.json() : null;
        const meals = data?.meals || [];
        const titleWords = new Set(query.split(' ').filter(word => word.length > 2));
        const bestMatch = meals
          .map(meal => {
            const mealWords = new Set(normalize(meal.strMeal).split(' ').filter(word => word.length > 2));
            const sharedWords = [...titleWords].filter(word => mealWords.has(word)).length;
            return { meal, score: titleWords.size ? sharedWords / titleWords.size : 0 };
          })
          .sort((left, right) => right.score - left.score)[0];
        if (bestMatch?.score >= 0.5 && bestMatch.meal.strMealThumb) return bestMatch.meal.strMealThumb;
      } catch {
        // Fall through to a random catalog image, then keep the source image.
      }

      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = response.ok ? await response.json() : null;
        return data?.meals?.[0]?.strMealThumb || null;
      } catch {
        return null;
      }
    })();
    mealImageRequests.set(query, request);
  }
  return mealImageRequests.get(query);
};

export default function RecipeImage({ recipe, className = '', ...imageProps }) {
  const fallbackImage = recipe.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800';
  const [image, setImage] = useState(fallbackImage);

  useEffect(() => {
    let active = true;
    setImage(fallbackImage);
    findMealImage(recipe.title || '').then(mealImage => {
      if (active && mealImage) setImage(mealImage);
    });
    return () => { active = false; };
  }, [recipe.title, fallbackImage]);

  return (
    <img
      {...imageProps}
      src={image}
      alt={imageProps.alt || recipe.title}
      className={className}
      onError={(event) => {
        if (event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage;
      }}
    />
  );
}
