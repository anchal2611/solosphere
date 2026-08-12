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

  let limit = parseInt(req.query.limit || "10");
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50;

  // Simple shuffle and slice
  const shuffled = [...recipes].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);

  return res.status(200).json(selected);
}
