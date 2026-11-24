import React, { useEffect, useState } from 'react';

const mealImageRequests = new Map();

const normalize = (value) => value.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const findMealImage = (title) => {
  const query = normalize(title);
  if (!query) return Promise.resolve(null);
  if (!mealImageRequests.has(query)) {
    const request = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        const meals = data?.meals || [];
        const titleWords = new Set(query.split(' ').filter(word => word.length > 2));
        const bestMatch = meals
          .map(meal => {
            const mealWords = new Set(normalize(meal.strMeal).split(' ').filter(word => word.length > 2));
            const sharedWords = [...titleWords].filter(word => mealWords.has(word)).length;
            return { meal, score: titleWords.size ? sharedWords / titleWords.size : 0 };
          })
          .sort((left, right) => right.score - left.score)[0];
        return bestMatch?.score >= 0.5 ? bestMatch.meal.strMealThumb : null;
      })
      .catch(() => null);
    mealImageRequests.set(query, request);
  }
  return mealImageRequests.get(query);
};

export default function RecipeImage({ recipe, className = '', ...imageProps }) {
  const fallbackImage = `https://loremflickr.com/960/640/${encodeURIComponent(`${recipe.title || 'food'},food`)}?lock=${encodeURIComponent(recipe.id || recipe.title || 'recipe')}`;
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
