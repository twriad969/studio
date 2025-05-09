import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Lightbulb, BarChart3, BookOpen } from "lucide-react";

const contentSections = [
  {
    id: "how-it-works",
    title: "How Prompthancer Works",
    icon: Lightbulb,
    items: [
      "Enter your basic prompt into the input field.",
      "Our advanced AI analyzes your prompt's intent and context.",
      "We generate an enhanced version with improved structure, clarity, and specificity.",
      "Use your new, powerful prompt with any AI system for significantly better results!",
    ],
    description: "Prompthancer simplifies prompt engineering. We use AI to refine your ideas into instructions that AI models understand best, unlocking their full potential."
  },
  {
    id: "benefits",
    title: "Benefits of Better Prompts",
    icon: CheckCircle,
    items: [
      "Get more accurate and relevant AI responses.",
      "Save time by reducing trial-and-error with prompts.",
      "Unlock more creative and complex outputs from AI models.",
      "Improve communication clarity with AI systems.",
      "Achieve your desired outcomes faster and more efficiently.",
    ],
    description: "Well-crafted prompts are the key to unlocking the true power of AI. Better inputs lead to better outputs, saving you time and effort while delivering superior results."
  },
  {
    id: "enhancement-details",
    title: "How We Enhance Your Prompts",
    icon: BarChart3,
    items: [
      "Adding necessary context and background information.",
      "Improving clarity, conciseness, and specificity.",
      "Structuring information logically for AI comprehension.",
      "Eliminating ambiguity and potential misinterpretations.",
      "Suggesting relevant parameters or constraints.",
      "Formatting for optimal AI understanding and performance.",
    ],
    description: "Our AI doesn't just rephrase; it strategically refines your prompt based on proven prompt engineering principles to maximize its effectiveness."
  },
  {
    id: "tips",
    title: "Tips for Crafting Great Prompts",
    icon: BookOpen,
    items: [
      "Be specific: Clearly define what you want the AI to do.",
      "Provide context: Give background information if necessary.",
      "Define the desired format: Specify if you want a list, paragraph, code, etc.",
      "Set constraints: Include length, style, or tone requirements.",
      "Iterate: Start simple and refine your prompt based on AI responses.",
    ],
    description: "While Prompthancer does the heavy lifting, understanding these core principles can help you provide better initial prompts for even more outstanding enhancements."
  }
];

export default function EducationalContent() {
  return (
    <section className="mt-16 sm:mt-24 space-y-12 py-12 border-t border-border/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Unlock the Power of AI with Better Prompts</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how Prompthancer helps you communicate more effectively with AI systems.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-6">
        {contentSections.map((section, index) => (
          <AccordionItem value={`item-${index}`} key={section.id} className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:bg-muted/50 transition-colors duration-200 text-card-foreground">
              <div className="flex items-center">
                <section.icon className="h-6 w-6 mr-3 text-primary" aria-hidden="true" />
                {section.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0 text-muted-foreground">
              <p className="mb-4">{section.description}</p>
              <ul className="space-y-2 list-inside">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className="mt-12 bg-gradient-to-br from-primary/90 via-primary to-accent/90 text-primary-foreground shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">Ready to Elevate Your AI Interactions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg sm:text-xl">
            Try Prompthancer today and experience the difference a well-crafted prompt can make. It's free, fast, and no sign-up is required!
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
