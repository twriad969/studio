import React from "react";
import { Cover } from "@/components/ui/cover";

export default function CoverDemo() {
  return (
    <div className="py-10 md:py-16"> {/* Added padding for better spacing */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold max-w-4xl mx-auto text-center relative z-20 leading-tight">
        Elevate Your AI Prompts <br className="hidden sm:block" /> with <Cover>Prompthancer</Cover>
      </h1>
      <p className="mt-6 max-w-xl mx-auto text-center text-base md:text-lg text-muted-foreground">
        Instantly transform basic ideas into powerful, precise instructions for any AI.
      </p>
    </div>
  );
}
