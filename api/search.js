import { extractPreferences } from './utils/gemini.js';
import { rankRecipes } from './utils/ranking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'recipes_subset.json'), 'utf8'));

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

    // 1. Extract preferences from query via Gemini
    const preferences = await extractPreferences(query);

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
      preferences,
      count: topResults.length,
      recipes: topResults
    });
  } catch (error) {
    console.error("Search API error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
