"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateId } from "ai";
import { fetchRecipes, fetchQuotes } from "./lib/helperFunctions";
import { Recipe } from "@/components/Recipe";

// Initializes and exports an AI instance using the createAI function
export const AI = createAI({
  actions: {
    //An object that defines the actions or methods available to the AI. Each action is an async function that can interact with the AI state, stream UI updates, and utilize tools.

    // Handles the continuation of a conversation by processing user input and generating a response
    continueConversation: async (input: string) => {
      // Retrieve the current mutable state of the AI to track and update the conversation history.
      const history = getMutableAIState();

      // Stream the user interface with the given parameters and model
      const result = await streamUI({
        model: openai("gpt-3.5-turbo"),
        // Append the new user message to the existing conversation history.
        messages: [...history.get(), { role: "user", content: input }],
        text: ({ done, content }) => {
          // Check if the conversation is marked as done
          if (done) {
            // If done, update the history to include this final assistant message
            history.done([...history.get(), { role: "assistant", content }]);
          }
          // Render the content in a div element
          return <div>{content}</div>;
        },
        // Define the tools available to the AI
        tools: {
          // Define a tool for retrieving recipes based on a query
          getRecipes: {
            description: "Get recipes by query",
            parameters: z.object({
              query: z.string().describe("The query to get recipes"),
            }),
            generate: async function ({ query }: { query: string }) {
              // Call the fetchRecipes function with the provided query to retrieve recipes
              const recipes = await fetchRecipes(query);
              // Render the fetched recipes using the Recipe component in a grid layout
              return (
                <div className="grid grid-cols-3 gap-4">
                  {recipes?.map((recipe: any, index: any) => (
                    <Recipe key={index} recipe={recipe} />
                  ))}
                </div>
              );
            },
          },
          // Define a tool for retrieving quotes based on a query
          getQuotes: {
            description: "Get quotes from a query",
            parameters: z.object({
              query: z.string().describe("The query to get quotes"),
            }),
            generate: async function ({ query }: { query: string }) {
              // Call the fetchQuotes function with the provided query to retrieve quotes
              const quotes = await fetchQuotes(query);
              // Render the first quote and author in a styled div element
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

      // Return the result of the conversation as an assistant message
      return {
        id: generateId(),
        role: "assistant",
        display: result.value,
      };
    },
  },
  // Initialize the initial state for the AI
  initialAIState: [],
  // Initialize the initial state for the UI
  initialUIState: [],
});
