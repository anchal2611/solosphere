import { extractPreferences } from './utils/gemini.js';
import { rankRecipes } from './utils/ranking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'recipes_subset.json'), 'utf8'));
const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const ingredientVocabulary = [...new Set(recipes.flatMap(recipe => recipe.ingredients_search || []).map(normalize).filter(Boolean))]
  .sort((left, right) => right.length - left.length);
const stopWords = new Set([
  'i', 'have', 'some', 'and', 'my', 'fridge', 'in', 'with', 'a', 'an', 'the', 'for',
  'me', 'to', 'on', 'hand', 'of', 'any', 'leftover', 'leftovers', 'need', 'want',
  'cook', 'make', 'recipe', 'recipes', 'using', 'about', 'just', 'find', 'show',
  'suggest', 'recommend', 'please', 'can', 'you', 'what', 'is', 'there', 'are',
  'quick', 'easy', 'fast', 'minutes', 'minute', 'under'
]);

function extractLocalPreferences(query) {
  const normalizedQuery = normalize(query);
  const paddedQuery = ` ${normalizedQuery} `;
  const ingredients = ingredientVocabulary.filter(ingredient => paddedQuery.includes(` ${ingredient} `));
  const queryTerms = normalizedQuery.split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word))
    .map(word => word.endsWith('ies') ? `${word.slice(0, -3)}y` : word.endsWith('s') ? word.slice(0, -1) : word);
  const fallbackKeywords = [...new Set([...ingredients, ...queryTerms])];
  const includes = value => value && paddedQuery.includes(` ${normalize(value)} `);
  const valuesFor = field => [...new Set(recipes.map(recipe => recipe[field]).filter(Boolean))];
  const requestedMeal = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'].find(includes);
  const mealType = requestedMeal === 'dinner' || requestedMeal === 'lunch'
    ? valuesFor('course').find(value => normalize(value) === 'main course') || requestedMeal
    : valuesFor('course').find(includes) || requestedMeal || '';
  const matchValue = values => values.find(includes) || '';
  const timeMatch = normalizedQuery.match(/\b(\d{1,3})\s*(?:m|min|mins|minute|minutes)\b/);

  return {
    ingredients: fallbackKeywords,
    diet: matchValue(valuesFor('diet')),
    mealType,
    taste: ['spicy', 'sweet', 'savory', 'savoury', 'creamy', 'crunchy', 'mild'].find(includes) || '',
    maxTime: timeMatch ? Number(timeMatch[1]) : null,
    cuisine: matchValue(valuesFor('cuisine')),
    course: matchValue(valuesFor('course'))
  };
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: "Query is required and must be a non-empty string" });
    }

    // Prefer Gemini extraction, then fall back to recipe vocabulary and query terms.
    let preferences;
    let searchMode = 'gemini';
    try {
      preferences = await extractPreferences(query);
    } catch (error) {
      searchMode = 'local';
      preferences = extractLocalPreferences(query);
      console.warn('Gemini preference extraction failed; using local recipe search.', error.message);
    }

    // 2. Rank recipes
    let results = rankRecipes(recipes, preferences);

    // If ingredients were requested, require that there's at least some overlap score
    if (preferences.ingredients && preferences.ingredients.length > 0) {
      results = results.filter(r => r._score > 0);
    }

    // Take top 10
    const topResults = results.slice(0, 10);

    return res.status(200).json({
      success: true,
      searchMode,
      preferences,
      count: topResults.length,
      recipes: topResults
    });
  } catch (error) {
    console.error("Search API error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
