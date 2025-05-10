import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Lightbulb, BarChart3, BookOpen, Award } from "lucide-react"; // Added Award icon
import { cn } from "@/lib/utils";

const contentSections = [
  {
    id: "how-it-works",
    title: "How Prompthancer Works",
    icon: Lightbulb,
    items: [
      "Input your initial idea or basic prompt.",
      "Our AI analyzes context, clarity, and intent.",
      "We generate an enhanced version: structured, specific, and potent.",
      "Copy your new prompt and use it with any AI for superior results!",
    ],
    description: "Prompthancer demystifies prompt engineering. We use AI to translate your concepts into instructions that AI models understand best, unlocking their true capabilities."
  },
  {
    id: "benefits",
    title: "Why Better Prompts Matter",
    icon: Award, // Changed icon
    items: [
      "Achieve more accurate and relevant AI responses.",
      "Minimize trial-and-error, saving valuable time.",
      "Unlock creative and complex outputs from AI models.",
      "Improve clarity in your communication with AI systems.",
      "Realize your desired outcomes faster and more efficiently.",
    ],
    description: "Expertly crafted prompts are your key to the full power of AI. Superior inputs lead to superior outputs, streamlining your workflow and delivering exceptional results."
  },
  {
    id: "enhancement-details",
    title: "The Enhancement Process",
    icon: BarChart3,
    items: [
      "Injecting essential context and background nuances.",
      "Boosting clarity, conciseness, and specificity.",
      "Structuring information logically for optimal AI comprehension.",
      "Removing ambiguities and potential misinterpretations.",
      "Suggesting pertinent parameters, constraints, or output formats.",
      "Formatting for peak AI understanding and performance.",
    ],
    description: "Our AI doesn't just reword; it strategically rebuilds your prompt using proven engineering principles to maximize its impact and effectiveness."
  },
  {
    id: "tips",
    title: "Quick Tips for Great Prompts",
    icon: BookOpen,
    items: [
      "Be Specific: Clearly articulate your desired outcome.",
      "Add Context: Provide necessary background details.",
      "Define Format: Specify list, paragraph, code, style, etc.",
      "Set Constraints: Include length, tone, or other requirements.",
      "Iterate & Refine: Start simple, then build upon AI responses.",
    ],
    description: "While Prompthancer handles the complexity, these core principles can help you provide stronger initial prompts for even more remarkable enhancements."
  }
];

export default function EducationalContent() {
  return (
    <section className="mt-20 sm:mt-28 space-y-12 py-16 border-t border-border/50">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Master Your AI Interactions
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how Prompthancer empowers you to communicate more effectively with any AI.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-5">
        {contentSections.map((section, index) => (
          <AccordionItem 
            value={`item-${index}`} 
            key={section.id} 
            className={cn(
              "border border-border/60 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
              "bg-card/70 backdrop-blur-md hover:bg-muted/40 dark:bg-card/50 dark:hover:bg-muted/30"
            )}
          >
            <AccordionTrigger className="px-6 py-5 text-left text-lg font-medium hover:no-underline group text-card-foreground">
              <div className="flex items-center">
                <section.icon className="h-6 w-6 mr-3.5 text-primary transition-colors duration-300 group-hover:text-primary/80" aria-hidden="true" />
                {section.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0 text-muted-foreground text-sm leading-relaxed">
              <p className="mb-4">{section.description}</p>
              <ul className="space-y-2.5 list-inside">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2.5 mt-0.5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className={cn(
        "mt-16 max-w-2xl mx-auto text-center p-6 md:p-8 rounded-xl shadow-2xl",
        "bg-gradient-to-br from-card via-muted/30 to-card dark:from-card dark:via-muted/20 dark:to-card border-primary/30"
        )}>
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-primary">Ready to Elevate Your AI Interactions?</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardDescription className="text-md sm:text-lg text-muted-foreground mb-6">
            Try Prompthancer today and experience the difference a well-crafted prompt can make. It's free, fast, and no sign-up is required!
          </CardDescription>
          {/* Optional: Add a subtle call to action button if desired here */}
        </CardContent>
      </Card>
    </section>
  );
}
