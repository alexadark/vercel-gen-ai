const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_API_KEY;
const NINJAS_API_KEY = process.env.NINJAS_API_KEY;

export const fetchRecipes = async (query: string) => {
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&type=public`
  );
  const data = await response.json();
  return data.hits;
};
export const fetchQuotes = async (category: string) => {
  if (!NINJAS_API_KEY) {
    console.error("NINJAS_API_KEY is not defined");
    return [];
  }

  const response = await fetch(
    `https://api.api-ninjas.com/v1/quotes?category=${category}`,
    {
      headers: {
        "X-Api-Key": NINJAS_API_KEY,
      },
    }
  );

  const data = await response.json();

  return data;
};
