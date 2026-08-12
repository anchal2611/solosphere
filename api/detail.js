import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'recipes_subset.json'), 'utf8'));

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  const recipe = recipes.find(r => String(r.id) === String(id));
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  return res.status(200).json(recipe);
}
