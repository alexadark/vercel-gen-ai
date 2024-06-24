import React from "react";

export const Recipe = ({ recipe }: { recipe: any }) => {
  return (
    <div className="prose">
      <a href={recipe.recipe.url} target="_blank">
        <h3>{recipe.recipe.label}</h3>
        <img src={recipe.recipe.image} alt={recipe.recipe.label} />
      </a>
      <h3>Ingredients</h3>
      <ul>
        {recipe.recipe.ingredients.map((ingredient: any, index: any) => (
          <li key={index}>{ingredient.text}</li>
        ))}
      </ul>
    </div>
  );
};
