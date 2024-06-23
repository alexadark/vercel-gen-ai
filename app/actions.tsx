//@ts-nocheck
"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_API_KEY;

const fetchRecipes = async (query: string) => {
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&type=public`
  );
  const data = await response.json();
  return data.hits;
};

export const AI = createAI({
  actions: {
    continueConversation: async (input: string) => {
      const history = getMutableAIState();
      const result = await streamUI({
        model: openai("gpt-3.5-turbo"),
        messages: [...history.get(), { role: "user", content: input }],
        text: ({ done, content }) => {
          if (done) {
            history.done([...history.get(), { role: "assistant", content }]);
          }
          return <div>{content}</div>;
        },
        tools: {
          getRecipes: {
            description: "Get recipes by query",
            parameters: z.object({
              query: z.string().describe("The query to get recipes"),
            }),
            generate: async function ({ query }: { query: string }) {
              const recipes = await fetchRecipes(query);
              return (
                <div>
                  {" "}
                  {recipes?.map((recipe, index) => (
                    <div key={index}>
                      <h3>{recipe.recipe.label}</h3>
                      <img
                        src={recipe.recipe.image}
                        alt={recipe.recipe.label}
                      />
                      <h3>Ingredients</h3>
                      <ul>
                        {recipe.recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient.text}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            },
          },
        },
      });

      return {
        id: generateId(),
        role: "assistant",
        display: result.value,
      };
    },
  },
  initialAIState: [],
  initialUIState: [],
});
