"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { fetchRecipes } from "./lib/helperFunctions";
import { Recipe } from "@/components/Recipe";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

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
                <div className="grid grid-cols-3 gap-4">
                  {recipes?.map((recipe: any, index: any) => (
                    <Recipe key={index} recipe={recipe} />
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
