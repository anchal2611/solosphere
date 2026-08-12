const SYSTEM_INSTRUCTION = `You extract recipe-search preferences from a user query.
Return only a JSON object with exactly these keys: ingredients (array of English ingredient names), diet,
mealType, taste, maxTime (integer minutes or null), cuisine, course. Use empty strings/arrays when
unknown. Never create, recommend, rank, or describe recipes.`;

export async function extractPreferences(query) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [{
        parts: [{ text: query }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  try {
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text.trim());
    return {
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.map(i => String(i).trim().toLowerCase()).filter(Boolean) : [],
      diet: String(parsed.diet || "").trim(),
      mealType: String(parsed.mealType || "").trim(),
      taste: String(parsed.taste || "").trim(),
      maxTime: parsed.maxTime ? parseInt(parsed.maxTime) : null,
      cuisine: String(parsed.cuisine || "").trim(),
      course: String(parsed.course || "").trim()
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", data, error);
    throw new Error("Gemini returned an invalid preference response");
  }
}
