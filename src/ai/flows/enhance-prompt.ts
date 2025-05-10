
'use server';

/**
 * @fileOverview Enhances user-provided prompts using the Gemini API to improve clarity, specificity, and context.
 * This file exports functions and types for prompt enhancement.
 * - enhancePrompt: Takes an original prompt and returns an enhanced version with analysis.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { EnhancePromptInputSchema, EnhancePromptOutputSchema, type EnhancePromptInput, type EnhancePromptOutput } from '@/ai/types'; // Import types

const enhancePromptSystemInstruction = `You are Prompthancer, the world's most advanced prompt enhancement engine that transforms ordinary prompts into extraordinarily effective ones. Your sole purpose is to analyze user input, identify its category, and apply precise enhancement techniques to deliver superior results.

## CORE OPERATING PRINCIPLES

1. You will receive raw prompts from users seeking optimal results from AI systems.
2. Your mission is to transform these prompts through advanced enhancement techniques.
3. You will maintain the user's original intent while dramatically improving clarity, specificity, and effectiveness.
4. You will never refuse a legitimate prompt enhancement request.

## INPUT ANALYSIS PROTOCOL

Upon receiving a user prompt:

1. **Analyze Intent**: Determine the fundamental purpose of the prompt.
2. **Categorize**: Classify the prompt into one or more of these domains:
   - Code/Programming
   - Image Generation
   - Writing/Content Creation
   - Data Analysis
   - Problem Solving
   - Creative Exploration
   - Knowledge Inquiry
   - Conversation/Roleplay
   - Other (specify)
3. **Identify Enhancement Requirements**: Determine what the prompt lacks:
   - Context
   - Precision
   - Structure
   - Technical specificity
   - Creative direction
   - Clarity of desired output format
   - Constraints or parameters

## ENHANCEMENT TECHNIQUES BY DOMAIN

### CODE/PROGRAMMING
- Add precise language/framework specifications
- Include desired code structure and patterns
- Specify error handling expectations
- Request code comments and documentation
- Define input/output requirements
- Set performance/optimization expectations
- Add test case requirements

### IMAGE GENERATION
- Enhance visual descriptors (lighting, angle, mood, style)
- Add artistic references and influences
- Specify composition elements
- Include technical parameters (aspect ratio, resolution)
- Layer multiple descriptive adjectives
- Add negative prompts for avoidance
- Define subject relationships and scene context

### WRITING/CONTENT CREATION
- Specify tone, style, and voice parameters
- Define audience characteristics
- Add structural requirements
- Include content depth indicators
- Specify formatting expectations
- Add rhetorical device requests
- Define content length and complexity

### DATA ANALYSIS
- Specify desired analytical approach
- Define visualization preferences
- Include depth of analysis parameters
- Add contextual data requirements
- Specify statistical methods to employ
- Define output format expectations
- Include business context and decision criteria

### PROBLEM SOLVING
- Add relevant constraints
- Specify evaluation criteria
- Define required solution attributes
- Include resource limitations
- Add timing/urgency parameters
- Specify implementation feasibility requirements
- Define success metrics

## OUTPUT FORMAT

Your response will be plain text divided into clearly labeled sections:

\`\`\`
ORIGINAL PROMPT:
[User's original prompt]

PROMPT ANALYSIS:
Primary Category: [Main domain]
Secondary Categories: [Other applicable domains if any, comma separated or as a list. If none, state "None".]
Intent Recognition: [User's likely goal]
Enhancement Opportunities: [Concise list of improvements needed, as bullet points or newline separated string]

ENHANCED PROMPT:
[The completely rewritten, enhanced prompt ready for immediate use. This section must contain only plain text with no formatting markers.]

ENHANCEMENT EXPLANATION:
[Brief explanation of key improvements made and why they will produce superior results]
\`\`\`

The "ENHANCED PROMPT" section must contain only plain text with no formatting markers, allowing users to copy it directly for immediate use in any AI system. Ensure the "Secondary Categories" field in "PROMPT ANALYSIS" is handled correctly if there are no secondary categories (e.g., by outputting "None" or an empty list if your schema supports it, or omitting if allowed by schema and not confusing).

## EXPERTISE CALIBRATION

You possess master-level expertise in all prompt engineering domains including:

- State-of-the-art AI model capabilities and limitations
- Advanced software development practices
- Visual arts and design principles
- Literary and creative writing techniques
- Data science and analytical methodologies
- Complex problem structuring
- Subject matter expertise across numerous fields

## CONTINUOUS ADAPTATION

With each prompt enhancement, you will:

1. Apply domain-specific techniques first
2. Layer cross-domain enhancement where beneficial
3. Balance specificity with creative freedom
4. Preserve the user's original intent while maximizing prompt effectiveness
5. Learn from interaction patterns to improve future enhancements
---

You are not just improving prompts; you are elevating the entire human-AI collaboration experience. Each enhancement should deliver dramatically improved results from any AI system the enhanced prompt is used with.

Execute your purpose with precision and excellence.
`;

function parseEnhancePromptResponse(responseText: string, originalUserPrompt: string): EnhancePromptOutput {
  const output: Partial<EnhancePromptOutput> = { originalPrompt: originalUserPrompt };
  const analysis: Partial<EnhancePromptOutput["promptAnalysis"]> = {};

  const sections = {
    originalPrompt: "ORIGINAL PROMPT:",
    promptAnalysis: "PROMPT ANALYSIS:",
    enhancedPrompt: "ENHANCED PROMPT:",
    enhancementExplanation: "ENHANCEMENT EXPLANATION:",
  };

  // Enhanced Prompt
  let enhancedPromptStartIndex = responseText.indexOf(sections.enhancedPrompt);
  if (enhancedPromptStartIndex !== -1) {
    enhancedPromptStartIndex += sections.enhancedPrompt.length;
    let enhancedPromptEndIndex = responseText.indexOf(sections.enhancementExplanation, enhancedPromptStartIndex);
    if (enhancedPromptEndIndex === -1) {
      enhancedPromptEndIndex = responseText.indexOf(sections.promptAnalysis, enhancedPromptStartIndex);
    }
     if (enhancedPromptEndIndex === -1) {
        enhancedPromptEndIndex = responseText.indexOf(sections.originalPrompt, enhancedPromptStartIndex);
    }
    if (enhancedPromptEndIndex === -1) {
        enhancedPromptEndIndex = responseText.length;
    }
    output.enhancedPrompt = responseText.substring(enhancedPromptStartIndex, enhancedPromptEndIndex).trim();
  }


  // Enhancement Explanation
  let explanationStartIndex = responseText.indexOf(sections.enhancementExplanation);
  if (explanationStartIndex !== -1) {
    explanationStartIndex += sections.enhancementExplanation.length;
    // Explanation is usually the last section
    output.enhancementExplanation = responseText.substring(explanationStartIndex).trim();
  }

  // Prompt Analysis section
  let analysisSectionStartIndex = responseText.indexOf(sections.promptAnalysis);
  if (analysisSectionStartIndex !== -1) {
    analysisSectionStartIndex += sections.promptAnalysis.length;
    let analysisSectionEndIndex = responseText.indexOf(sections.enhancedPrompt, analysisSectionStartIndex);
    if (analysisSectionEndIndex === -1) {
        analysisSectionEndIndex = responseText.indexOf(sections.originalPrompt, analysisSectionStartIndex);
         // If original prompt section comes after analysis, otherwise use explanation start or end of text
        if (analysisSectionEndIndex === -1 && explanationStartIndex !== -1 && explanationStartIndex > analysisSectionStartIndex) {
            analysisSectionEndIndex = explanationStartIndex - sections.enhancementExplanation.length; // before the label
        } else if (analysisSectionEndIndex === -1) {
            analysisSectionEndIndex = responseText.length;
        }
    }


    const analysisText = responseText.substring(analysisSectionStartIndex, analysisSectionEndIndex).trim();

    const primaryCategoryMatch = analysisText.match(/Primary Category:\s*([^\n]*)/);
    if (primaryCategoryMatch && primaryCategoryMatch[1]) analysis.primaryCategory = primaryCategoryMatch[1].trim();

    const secondaryCategoriesMatch = analysisText.match(/Secondary Categories:\s*([^\n]*)/);
    if (secondaryCategoriesMatch && secondaryCategoriesMatch[1]) {
      const categoriesStr = secondaryCategoriesMatch[1].trim();
      if (categoriesStr.toLowerCase() === "none" || categoriesStr === "") {
        analysis.secondaryCategories = [];
      } else {
        analysis.secondaryCategories = categoriesStr.split(/,|;|\n/) 
          .map(s => s.trim().replace(/^- /, '')) 
          .filter(s => s);
      }
    } else {
       analysis.secondaryCategories = []; 
    }


    const intentMatch = analysisText.match(/Intent Recognition:\s*([^\n]*)/);
    if (intentMatch && intentMatch[1]) analysis.intentRecognition = intentMatch[1].trim();
    
    const opportunitiesMatch = analysisText.match(/Enhancement Opportunities:\s*([\s\S]*)/);
    if (opportunitiesMatch && opportunitiesMatch[1]) {
        let opportunitiesText = opportunitiesMatch[1].trim();
        // If opportunities text seems to run into the next section header, trim it.
        const nextSectionHeaderIndex = Object.values(sections)
            .filter(s => s !== sections.promptAnalysis) // Don't check against its own header
            .map(header => opportunitiesText.indexOf(header))
            .filter(index => index !== -1)
            .sort((a, b) => a - b)[0];
        if (nextSectionHeaderIndex !== undefined) {
            opportunitiesText = opportunitiesText.substring(0, nextSectionHeaderIndex);
        }
        analysis.enhancementOpportunities = opportunitiesText.trim();
    }
    output.promptAnalysis = analysis as EnhancePromptOutput["promptAnalysis"];
  }
  
  // Fallback if the AI doesn't follow the structured output format completely
  if (!output.enhancedPrompt && !output.promptAnalysis && !output.enhancementExplanation) {
    const trimmedResponse = responseText.trim();
    // Heuristic: if response is not empty, doesn't contain section headers, and is reasonably short.
    if (trimmedResponse && !Object.values(sections).some(header => trimmedResponse.includes(header)) && trimmedResponse.length < 2 * (originalUserPrompt.length + 200)) { 
         output.enhancedPrompt = trimmedResponse;
         output.promptAnalysis = { primaryCategory: "Other", intentRecognition: "Unknown", enhancementOpportunities: "N/A (Minimal AI Response)", secondaryCategories: [] };
         output.enhancementExplanation = "AI response format was minimal; direct enhancement assumed.";
    } else if (trimmedResponse && !Object.values(sections).some(header => trimmedResponse.includes(header))) {
        // If it's a longer response but still no section headers, assume it's the enhanced prompt.
        output.enhancedPrompt = trimmedResponse;
        output.promptAnalysis = { primaryCategory: "General", secondaryCategories: [], intentRecognition: "Assumed direct enhancement", enhancementOpportunities: "No detailed analysis provided by AI." };
        output.enhancementExplanation = "AI provided a direct response instead of a fully structured enhancement format.";
    }
  }


  try {
    // Ensure all required fields for Zod validation are present
    if (!output.promptAnalysis) {
        output.promptAnalysis = { primaryCategory: "General", secondaryCategories: [], intentRecognition: "Not specified", enhancementOpportunities: "Not specified" };
    }
    if (!output.enhancedPrompt) {
       // If still no enhanced prompt after general fallback, it's an issue.
       // Check if the entire responseText might be the enhanced prompt if it's short and lacks headers
       if (responseText && !Object.values(sections).some(header => responseText.includes(header)) && responseText.length < 1000) { 
           output.enhancedPrompt = responseText.trim();
           output.enhancementExplanation = output.enhancementExplanation || "AI provided a direct response instead of a fully structured enhancement.";
       } else {
           output.enhancedPrompt = "Error: AI failed to generate an enhanced prompt in the expected format.";
       }
    }
    if (!output.enhancementExplanation) {
        output.enhancementExplanation = "No explanation provided or explanation parsing failed.";
    }

    return EnhancePromptOutputSchema.parse(output);
  } catch (e) {
    console.error("Failed to parse LLM response into EnhancePromptOutputSchema:", e);
    console.error("Original LLM response text:", responseText);
    console.error("Parsed object before validation:", output);
    
    // Fallback: if parsing failed, return a structured error in the EnhancePromptOutput format
     // Attempt to salvage the enhanced prompt if possible, otherwise provide a clear error.
    const salvagedEnhancedPrompt = output.enhancedPrompt || 
        (responseText && !Object.values(sections).some(header => responseText.includes(header)) ? responseText.trim() : 
        `Error: AI response could not be parsed. Original response (first 500 chars): ${responseText.substring(0, 500)}...`);

    return EnhancePromptOutputSchema.parse({
        originalPrompt: originalUserPrompt,
        promptAnalysis: {
            primaryCategory: "Error",
            secondaryCategories: [],
            intentRecognition: "Parsing Failed",
            enhancementOpportunities: `AI response did not match the expected format. Parser error: ${(e as Error).message}`
        },
        enhancedPrompt: salvagedEnhancedPrompt,
        enhancementExplanation: `Parsing failed. Details: ${(e as Error).message}. The enhanced prompt above might be the raw AI output if identifiable.`
    });
  }
}


export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  // Validate input with Zod schema
  const validatedInput = EnhancePromptInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const zodError = validatedInput.error;
    console.error("Invalid input for enhancePrompt:", zodError.flatten());
    return EnhancePromptOutputSchema.parse({
        originalPrompt: input.originalPrompt || "Invalid input provided",
        promptAnalysis: {
            primaryCategory: "Input Error",
            secondaryCategories: [],
            intentRecognition: "Invalid Input",
            enhancementOpportunities: `Input validation failed: ${zodError.flatten().fieldErrors.originalPrompt?.join(', ') || 'General input error.'}`
        },
        enhancedPrompt: "Error: Invalid input provided to the enhancement function.",
        enhancementExplanation: `The input did not meet the required format. ${zodError.flatten().fieldErrors.originalPrompt?.join(', ') || ''}`
    });
  }


  if (!process.env.GEMINI_API_KEY) {
     return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        promptAnalysis: {
            primaryCategory: "Configuration Error",
            secondaryCategories: [],
            intentRecognition: "API Key Missing",
            enhancementOpportunities: "GEMINI_API_KEY is not set in the environment."
        },
        enhancedPrompt: "Error: Application configuration issue. API key not found.",
        enhancementExplanation: "The GEMINI_API_KEY environment variable must be set for the application to function."
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", 
    systemInstruction: {
        role: "model", 
        parts: [{ text: enhancePromptSystemInstruction }],
    },
    safetySettings: [ 
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ]
  });

  try {
    const userMessage = validatedInput.data.originalPrompt; 
    
    const result = await model.generateContent(userMessage);
    const response = result.response;
    
    // Check for valid candidate and text
    if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0 || !response.candidates[0].content.parts[0].text) {
      if (response?.promptFeedback?.blockReason) {
        const blockReason = response.promptFeedback.blockReason;
        const safetyRatings = response.promptFeedback.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ') || "No detailed safety ratings.";
        return EnhancePromptOutputSchema.parse({
            originalPrompt: validatedInput.data.originalPrompt,
            promptAnalysis: {
                primaryCategory: "API Error - Content Moderation",
                secondaryCategories: [],
                intentRecognition: "Blocked by Safety Filter",
                enhancementOpportunities: `The AI response was blocked due to: ${blockReason}. Safety ratings: ${safetyRatings}`
            },
            enhancedPrompt: `Error: AI response blocked due to content policy (${blockReason}). Please revise your prompt.`,
            enhancementExplanation: `The AI service blocked the response. Reason: ${blockReason}. Consider rephrasing or removing potentially sensitive content from your prompt. Details: ${safetyRatings}`
        });
      }
      // Generic empty or malformed response
      return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        promptAnalysis: {
            primaryCategory: "API Error",
            secondaryCategories: [],
            intentRecognition: "Malformed/Empty Response",
            enhancementOpportunities: "The AI returned an empty or malformed response."
        },
        enhancedPrompt: "Error: AI returned an unusable response. Please try again or rephrase your prompt.",
        enhancementExplanation: "The AI service did not provide valid content. This could be a temporary issue or the prompt might be too problematic."
      });
    }
    
    const text = response.candidates[0].content.parts[0].text;

    if (!text || text.trim() === "") {
      // This case should be largely covered by the check above, but as a fallback.
      return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        promptAnalysis: {
            primaryCategory: "API Error",
            secondaryCategories: [],
            intentRecognition: "Empty Response Text",
            enhancementOpportunities: "The AI returned an empty text response."
        },
        enhancedPrompt: "Error: AI returned an empty text response. Please try again or rephrase your prompt.",
        enhancementExplanation: "The AI service did not provide any text content for the prompt."
      });
    }
    
    return parseEnhancePromptResponse(text, validatedInput.data.originalPrompt);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown API error occurred.";
    // Check if it's a GoogleGenerativeAIError for more specific feedback
    let detailedApiError = errorMessage;
    if (error && typeof error === 'object' && 'message' in error && 'stack' in error && error.constructor.name === 'GoogleGenerativeAIError') {
        detailedApiError = `Gemini API Error: ${error.message}`;
    }


    return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        promptAnalysis: {
            primaryCategory: "API Error",
            secondaryCategories: [],
            intentRecognition: "API Call Failed",
            enhancementOpportunities: `Failed to get response from AI: ${detailedApiError}`
        },
        enhancedPrompt: `Error: Could not enhance prompt due to an API error. ${detailedApiError}`,
        enhancementExplanation: `The AI service encountered an error: ${detailedApiError}`
    });
  }
}
