"use client";
import { useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";

export const ChatForm = () => {
  const { continueConversation } = useActions();
  const [, setConversation] = useUIState();
  const [input, setInput] = useState("");

  return (
    <form
      action={async () => {
        setConversation((c: any[]) => [
          ...c,
          { id: generateId(), role: "user", display: input },
        ]);
        setInput("");
        const message = await continueConversation(input);

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
        className="p-2 border rounded w-full text-black"
        type="text"
        placeholder="Ask me anything..."
      />
      <button
        className="px-6 h-12 text-slate-900 uppercase font-bold transition-colors duration-300 hover:bg-purple-600 focus:outline-none focus:ring-2 rounded-sm focus:ring-black focus:ring-offset-2 bg-gradient-to-l from-purple-500 to-pink-600 cursor-pointer hover:-translate-y-1"
        type="submit"
      >
        submit
      </button>
    </form>
  );
};
