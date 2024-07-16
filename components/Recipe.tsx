'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const Recipe = ({ recipe }: { recipe: any }) => {
  const { dietLabels, label, image, url, ingredients } = recipe.recipe;
  const [showIngredients, setShowIngredients] = useState(false);

  const toggleIngredients = () => {
    setShowIngredients((prevState) => !prevState);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="relative">
        <div className="flex flex-col space-y-3">
          <div className="relative">
            <img
              src={image}
              alt={label}
              width={640}
              height={480}
              className="object-cover w-full h-64 rounded-lg pt-5"
            />
          </div>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">{label}</h2>
            <div className="flex flex-wrap gap-2">
              {dietLabels.map((label: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-muted rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
            <div
              className="flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out border p-1"
              onClick={toggleIngredients}
            >
              <h3 className="text-sm font-medium">Ingredients</h3>
              <ChevronDownIcon
                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ease-in-out ${
                  showIngredients ? 'transform rotate-180' : ''
                }`}
              />
            </div>
            {showIngredients && (
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {ingredients.map((ingredient: any, index: number) => (
                  <li key={index}>{ingredient.text}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-center p-1 bg-muted rounded-lg my-3 w-[150px] text-center hover:bg-muted/50 transition-all duration-300 ease-in-out">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-xs uppercase font-bold"
              >
                View full recipe
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
