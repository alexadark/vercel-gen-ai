'use client';
import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';

export const ChatForm = () => {
  const { continueConversation } = useActions(); //we get the continueConversation from the server
  const [, setConversation] = useUIState();
  const [input, setInput] = useState('');

  return (
    <form
      // updates the conversation state by appending a new message object.
      // The message object includes a unique ID, specifies the role as 'user', and uses the current input value for display.
      action={async () => {
        setConversation((currentConversation: any[]) => [
          ...currentConversation,
          { id: generateId(), role: 'user', display: input },
        ]);
        setInput('');
        // calls the continueConversation function with the current input value.
        // This function is responsible for continuing the conversation by processing the user's input and generating a response.
        const message = await continueConversation(input);

        // updates the conversation state by appending the new message object.
        setConversation((currentConversation: any[]) => [
          ...currentConversation,
          message,
        ]);
      }}
      className="p-4 flex items-center gap-4"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 w-full bg-muted/50 border-primary text-foreground ring-primary ring-offset-2 ring-offset-muted placeholder-foreground/50"
        type="text"
        placeholder="Ask me about recipes, quotes, or anything else..."
      />
      <button
        className="px-6 h-10 text-slate-900 uppercase font-bold  focus:outline-none focus:ring-2 rounded-sm focus:ring-black focus:ring-offset-2 bg-gradient-to-l from-orange-500 to-yellow-500 cursor-pointer hover:-translate-y-1 transition-all duration-300 ease-in-out"
        type="submit"
      >
        submit
      </button>
    </form>
  );
};
