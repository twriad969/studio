
'use server';

/**
 * @fileOverview Enhances user-provided prompts using the Gemini API to improve clarity, specificity, and context.
 * This file exports functions and types for prompt enhancement.
 * - enhancePrompt: Takes an original prompt and returns an enhanced version with analysis.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { EnhancePromptInputSchema, EnhancePromptOutputSchema, type EnhancePromptInput, type EnhancePromptOutput, type PromptAnalysis } from '@/ai/types';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limiter';


const GEMINI_API_KEY = "AIzaSyA32RUaXxcownuEjUFkOMXitSo9saPTj_I";


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

function simplifiedParseEnhancePromptResponse(responseText: string, originalUserPrompt: string): EnhancePromptOutput {
  let extractedEnhancedPrompt = "";
  let analysis: Partial<PromptAnalysis> = {};
  let explanation = "";

  const markers = {
    original: "ORIGINAL PROMPT:",
    analysis: "PROMPT ANALYSIS:",
    enhanced: "ENHANCED PROMPT:",
    explanation: "ENHANCEMENT EXPLANATION:",
  };

  const enhancedPromptStartIndex = responseText.indexOf(markers.enhanced);
  const analysisStartIndex = responseText.indexOf(markers.analysis);
  const explanationStartIndex = responseText.indexOf(markers.explanation);

  if (enhancedPromptStartIndex !== -1) {
    const textAfterEnhancedMarker = responseText.substring(enhancedPromptStartIndex + markers.enhanced.length);
    let endOfEnhancedPromptIndex = textAfterEnhancedMarker.indexOf(markers.explanation);
    if (endOfEnhancedPromptIndex === -1) {
        endOfEnhancedPromptIndex = textAfterEnhancedMarker.indexOf(markers.analysis);
    }
    if (endOfEnhancedPromptIndex === -1) {
        endOfEnhancedPromptIndex = textAfterEnhancedMarker.indexOf(markers.original);
    }
    if (endOfEnhancedPromptIndex === -1) {
        endOfEnhancedPromptIndex = textAfterEnhancedMarker.length;
    }
    extractedEnhancedPrompt = textAfterEnhancedMarker.substring(0, endOfEnhancedPromptIndex).trim();
  } else {
    // If no "ENHANCED PROMPT:" marker, assume the entire response might be the enhanced prompt,
    // unless other markers are present suggesting a malformed structured response.
    if (analysisStartIndex === -1 && explanationStartIndex === -1 && originalUserPrompt !== responseText) {
        extractedEnhancedPrompt = responseText.trim();
    }
  }

  if (analysisStartIndex !== -1) {
    const textAfterAnalysisMarker = responseText.substring(analysisStartIndex + markers.analysis.length);
    let endOfAnalysisIndex = textAfterAnalysisMarker.indexOf(markers.enhanced);
     if (endOfAnalysisIndex === -1) {
        endOfAnalysisIndex = textAfterAnalysisMarker.indexOf(markers.explanation);
    }
    if (endOfAnalysisIndex === -1) {
        endOfAnalysisIndex = textAfterAnalysisMarker.indexOf(markers.original);
    }
    if (endOfAnalysisIndex === -1) {
        endOfAnalysisIndex = textAfterAnalysisMarker.length;
    }
    const analysisText = textAfterAnalysisMarker.substring(0, endOfAnalysisIndex).trim();
    
    const primaryCategoryMatch = analysisText.match(/Primary Category:\s*([^\n]*)/);
    analysis.primaryCategory = primaryCategoryMatch && primaryCategoryMatch[1] ? primaryCategoryMatch[1].trim() : "General";
    
    const secondaryCategoriesMatch = analysisText.match(/Secondary Categories:\s*([^\n]*)/);
     if (secondaryCategoriesMatch && secondaryCategoriesMatch[1]) {
      const categoriesStr = secondaryCategoriesMatch[1].trim();
      if (categoriesStr.toLowerCase() !== "none" && categoriesStr !== "") {
        analysis.secondaryCategories = categoriesStr.split(/,|;|\n/).map(s => s.trim().replace(/^- /, '')).filter(s => s);
      } else {
        analysis.secondaryCategories = [];
      }
    } else {
        analysis.secondaryCategories = [];
    }

    const intentMatch = analysisText.match(/Intent Recognition:\s*([^\n]*)/);
    analysis.intentRecognition = intentMatch && intentMatch[1] ? intentMatch[1].trim() : "Not specified by AI";
    
    // Use the rest of the analysis block for enhancementOpportunities
    const opportunitiesHeader = "Enhancement Opportunities:";
    const opportunitiesIndex = analysisText.indexOf(opportunitiesHeader);
    if (opportunitiesIndex !== -1) {
        analysis.enhancementOpportunities = analysisText.substring(opportunitiesIndex + opportunitiesHeader.length).trim();
    } else if (analysisText) {
         analysis.enhancementOpportunities = analysisText; // if no specific header, take the whole block
    } else {
        analysis.enhancementOpportunities = "No specific opportunities listed by AI.";
    }
  }

  if (explanationStartIndex !== -1) {
    explanation = responseText.substring(explanationStartIndex + markers.explanation.length).trim();
  }
  
  // Fallback if enhanced prompt is still empty
  if (!extractedEnhancedPrompt && responseText.trim() && responseText.trim() !== originalUserPrompt) {
    if (!responseText.includes(markers.analysis) && !responseText.includes(markers.explanation) && !responseText.includes(markers.original)) {
         extractedEnhancedPrompt = responseText.trim();
         explanation = explanation || "AI provided a direct response without structured analysis.";
         analysis = analysis.primaryCategory ? analysis : { // don't overwrite if partially parsed
            primaryCategory: "General",
            secondaryCategories: [],
            intentRecognition: "Assumed direct enhancement",
            enhancementOpportunities: "No structured analysis provided by AI."
         };
    } else {
        // If markers were present but enhanced prompt couldn't be extracted.
        extractedEnhancedPrompt = "Error: Could not extract enhanced prompt from AI's structured response.";
    }
  }


  return EnhancePromptOutputSchema.parse({
    originalPrompt: originalUserPrompt,
    promptAnalysis: analysis.primaryCategory ? analysis : undefined, // Let zod handle default if analysis is empty
    enhancedPrompt: extractedEnhancedPrompt || "Error: AI failed to generate an enhanced prompt.",
    enhancementExplanation: explanation || undefined, // Let zod handle default
  });
}


export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0] || headers().get('x-real-ip') || 'unknown-ip';
  const rateLimitResult = await checkRateLimit(ip);

  if (rateLimitResult.limited) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return EnhancePromptOutputSchema.parse({
        originalPrompt: input.originalPrompt,
        enhancedPrompt: `Error: Rate limit exceeded. ${rateLimitResult.message || "Please try again later."}`,
        promptAnalysis: {
            primaryCategory: "Rate Limit Error",
            intentRecognition: "Request blocked",
            enhancementOpportunities: rateLimitResult.message || "Too many requests."
        },
        enhancementExplanation: rateLimitResult.message || "The request was blocked due to rate limiting."
    });
  }

  const validatedInput = EnhancePromptInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const zodError = validatedInput.error;
    console.error("Invalid input for enhancePrompt:", zodError.flatten());
    return EnhancePromptOutputSchema.parse({
        originalPrompt: input.originalPrompt || "Invalid input provided",
        enhancedPrompt: "Error: Invalid input provided to the enhancement function.",
        promptAnalysis: {
            primaryCategory: "Input Error",
            intentRecognition: "Invalid Input",
            enhancementOpportunities: `Input validation failed: ${zodError.flatten().fieldErrors.originalPrompt?.join(', ') || 'General input error.'}`
        },
        enhancementExplanation: `The input did not meet the required format. ${zodError.flatten().fieldErrors.originalPrompt?.join(', ') || ''}`
    });
  }


  if (!GEMINI_API_KEY) {
     return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        enhancedPrompt: "Error: Application configuration issue. API key not found.",
        promptAnalysis: {
            primaryCategory: "Configuration Error",
            intentRecognition: "API Key Missing",
            enhancementOpportunities: "GEMINI_API_KEY is not set."
        },
        enhancementExplanation: "The GEMINI_API_KEY must be configured for the application to function."
    });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
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
    const userMessage = `ORIGINAL PROMPT:\n${validatedInput.data.originalPrompt}`; // Pass original prompt explicitly in user message too
    
    const result = await model.generateContent(userMessage);
    const response = result.response;
    
    if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0 || !response.candidates[0].content.parts[0].text) {
      if (response?.promptFeedback?.blockReason) {
        const blockReason = response.promptFeedback.blockReason;
        const safetyRatings = response.promptFeedback.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ') || "No detailed safety ratings.";
        return EnhancePromptOutputSchema.parse({
            originalPrompt: validatedInput.data.originalPrompt,
            enhancedPrompt: `Error: AI response blocked due to content policy (${blockReason}). Please revise your prompt.`,
            promptAnalysis: {
                primaryCategory: "API Error - Content Moderation",
                intentRecognition: "Blocked by Safety Filter",
                enhancementOpportunities: `The AI response was blocked due to: ${blockReason}. Safety ratings: ${safetyRatings}`
            },
            enhancementExplanation: `The AI service blocked the response. Reason: ${blockReason}. Consider rephrasing or removing potentially sensitive content from your prompt. Details: ${safetyRatings}`
        });
      }
      return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        enhancedPrompt: "Error: AI returned an unusable response. Please try again or rephrase your prompt.",
        promptAnalysis: {
            primaryCategory: "API Error",
            intentRecognition: "Malformed/Empty Response",
            enhancementOpportunities: "The AI returned an empty or malformed response."
        },
        enhancementExplanation: "The AI service did not provide valid content. This could be a temporary issue or the prompt might be too problematic."
      });
    }
    
    const text = response.candidates[0].content.parts[0].text;

    if (!text || text.trim() === "") {
      return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        enhancedPrompt: "Error: AI returned an empty text response. Please try again or rephrase your prompt.",
        promptAnalysis: {
            primaryCategory: "API Error",
            intentRecognition: "Empty Response Text",
            enhancementOpportunities: "The AI returned an empty text response."
        },
        enhancementExplanation: "The AI service did not provide any text content for the prompt."
      });
    }
    
    return simplifiedParseEnhancePromptResponse(text, validatedInput.data.originalPrompt);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown API error occurred.";
    let detailedApiError = errorMessage;
     if (error && typeof error === 'object' && 'message' in error && (error as any).constructor?.name?.includes('Google')) { // More specific check for Google errors
        detailedApiError = `Gemini API Error: ${(error as any).message}`;
    }

    return EnhancePromptOutputSchema.parse({
        originalPrompt: validatedInput.data.originalPrompt,
        enhancedPrompt: `Error: Could not enhance prompt due to an API error. ${detailedApiError}`,
        promptAnalysis: {
            primaryCategory: "API Error",
            intentRecognition: "API Call Failed",
            enhancementOpportunities: `Failed to get response from AI: ${detailedApiError}`
        },
        enhancementExplanation: `The AI service encountered an error: ${detailedApiError}`
    });
  }
}

