"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { fetchRecipes, fetchQuotes } from "./lib/helperFunctions";
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
          getQuotes: {
            description: "Get quotes from a query",
            parameters: z.object({
              query: z.string().describe("The query to get quotes"),
            }),
            generate: async function ({ query }: { query: string }) {
              const quotes = await fetchQuotes(query);
              return (
                <div className="text-center bg-slate-900 text-white p-4 rounded-md">
                  <p>{quotes[0]?.quote}</p>
                  <p className="font-bold not-italic">{quotes[0]?.author}</p>
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
