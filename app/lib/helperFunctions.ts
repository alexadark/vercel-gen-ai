const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_API_KEY;

export const fetchRecipes = async (query: string) => {
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&type=public`
  );
  const data = await response.json();
  return data.hits;
};
