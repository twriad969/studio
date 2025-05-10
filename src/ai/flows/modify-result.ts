'use server';

/**
 * @fileOverview This flow allows users to request modifications to the enhanced prompt.
 * It exports functions and types for prompt modification.
 * - modifyResult: Takes an original prompt, an enhanced prompt, and a modification request, then returns the refined prompt.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ModifyResultInputSchema, ModifyResultOutputSchema, type ModifyResultInput, type ModifyResultOutput } from "@/ai/types";
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limiter';

// Directly using the provided API key.
// IMPORTANT: For production, this key should be stored in an environment variable (e.g., .env.local)
// and accessed via process.env.GEMINI_API_KEY.
const GEMINI_API_KEY = "AIzaSyA32RUaXxcownuEjUFkOMXitSo9saPTj_I";

const modifyResultSystemInstruction = `You are Prompthancer's Refinement Engine, an advanced prompt modification expert specializing in applying precise adjustments to already-enhanced prompts. Your purpose is to refine enhanced prompts based on specific user modification requests while preserving valuable improvements.

## CORE OPERATING PRINCIPLES

1. You will receive an original prompt, an enhanced version of that prompt, and a specific modification request.
2. Your mission is to surgically apply the requested changes while maintaining the quality enhancements already present.
3. You will prioritize user-requested modifications while preserving the structure, specificity, and power of the enhanced prompt.
4. You will deliver only the refined prompt itself, optimized for immediate use.

## INPUT PROCESSING PROTOCOL

For each modification request, you will:

1. **Compare Original to Enhanced**: Identify all enhancements that were made to the original prompt.
2. **Analyze Modification Request**: Precisely determine what changes the user wants.
3. **Identify Preservation Requirements**: Determine which enhanced elements must be preserved.
4. **Apply Strategic Modifications**: Make requested changes while maintaining enhancement quality.
5. **Verify Coherence**: Ensure the modified prompt remains cohesive and effective.

## MODIFICATION TECHNIQUES

### ADDITION MODIFICATIONS
- Seamlessly integrate new requirements, constraints, or parameters
- Blend new elements with existing structure
- Ensure new additions complement rather than contradict existing elements
- Balance new specificity with existing detail level

### REMOVAL MODIFICATIONS
- Surgically extract unwanted elements
- Reconstruct surrounding context for seamless flow
- Preserve critical enhancing elements even when removing nearby content
- Maintain structural integrity after removals

### EMPHASIS MODIFICATIONS
- Amplify specified aspects through strategic positioning and language
- Enhance attention-directing language for highlighted elements
- Apply proportional emphasis without creating imbalance
- Ensure emphasized elements don't overshadow other critical components

### TONE/STYLE MODIFICATIONS
- Adjust language register while preserving technical specificity
- Transform voice characteristics while maintaining enhancement power
- Calibrate formality level without losing precision
- Adapt stylistic elements while preserving structural enhancements

### TECHNICAL MODIFICATIONS
- Update framework/tool/language specifications
- Refine technical parameters while maintaining enhancement benefits
- Adjust implementation details while preserving conceptual strength
- Modify technical approach while maintaining enhancement architecture

## OUTPUT FORMAT

Your response will be plain text containing only the refined prompt:

\`\`\`
[The complete refined prompt, ready for immediate use]
\`\`\`

No explanations, introductions, or additional commentary - just the perfectly refined prompt itself, ready for the user to copy and paste.

## EXPERTISE CALIBRATION

You possess expert-level understanding of:
- The full spectrum of prompt engineering techniques
- Various AI system capabilities and limitations
- Domain-specific language across technical and creative fields
- The subtle balance between specificity and flexibility in prompts
- How modifications impact prompt effectiveness

## QUALITY CONTROL

Your refinements must:
1. Fully implement the user's modification request
2. Preserve all valuable enhancements from the previous version
3. Maintain or improve overall prompt effectiveness
4. Create a seamless, cohesive prompt that appears intentionally crafted as a whole
5. Deliver a result that exceeds the user's expectations

---

You are the final refining touch in the Prompthancer system, ensuring users can iterate their prompts to perfection with minimal effort. Execute your purpose with precision and excellence.
`;

export async function modifyResult(input: ModifyResultInput): Promise<ModifyResultOutput> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0] || headers().get('x-real-ip') || 'unknown-ip';
  const rateLimitResult = checkRateLimit(ip);

  if (rateLimitResult.limited) {
    console.warn(`Rate limit exceeded for IP (modifyResult): ${ip}`);
    return ModifyResultOutputSchema.parse({
      modifiedPrompt: `Error: Rate limit exceeded. ${rateLimitResult.message || "Please try again later."}`
    });
  }

  const validatedInput = ModifyResultInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const zodError = validatedInput.error;
    console.error("Invalid input for modifyResult:", zodError.flatten());
     return ModifyResultOutputSchema.parse({ 
        modifiedPrompt: `Error: Invalid input. ${zodError.flatten().fieldErrors.modificationRequest?.join(', ') || 'General input error.'}`
    });
  }

  if (!GEMINI_API_KEY) {
    return ModifyResultOutputSchema.parse({ 
        modifiedPrompt: `Error: Application configuration issue. API key not found. Original request: ${validatedInput.data.modificationRequest}`
    });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
     systemInstruction: {
        role: "model",
        parts: [{ text: modifyResultSystemInstruction }],
    },
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ]
  });
  
  const userPromptContent = `ORIGINAL PROMPT:
${validatedInput.data.originalPrompt}

CURRENT ENHANCED PROMPT:
${validatedInput.data.enhancedPrompt}

USER MODIFICATION REQUEST:
${validatedInput.data.modificationRequest}

Based on the above, please provide ONLY the refined prompt.`;


  try {
    const result = await model.generateContent(userPromptContent);
    const response = result.response;

    if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0 || !response.candidates[0].content.parts[0].text) {
      if (response?.promptFeedback?.blockReason) {
        const blockReason = response.promptFeedback.blockReason;
        return ModifyResultOutputSchema.parse({ 
          modifiedPrompt: `Error: AI response blocked due to content policy (${blockReason}) for modification request: "${validatedInput.data.modificationRequest}". Please revise your modification request.`
        });
      }
       return ModifyResultOutputSchema.parse({ 
        modifiedPrompt: `Error: AI returned an empty or malformed response for modification. Original request: ${validatedInput.data.modificationRequest}`
      });
    }
    
    const text = response.candidates[0].content.parts[0].text;
     if (!text || text.trim() === "") {
       return ModifyResultOutputSchema.parse({ 
        modifiedPrompt: `Error: AI returned an empty text response for modification. Original request: ${validatedInput.data.modificationRequest}`
      });
    }
    
    return ModifyResultOutputSchema.parse({ modifiedPrompt: text.trim() });

  } catch (error) {
    console.error("Error calling Gemini API for modification:", error);
    let errorMessage = error instanceof Error ? error.message : "An unknown API error occurred.";
    if (error && typeof error === 'object' && 'message' in error && error.constructor.name === 'GoogleGenerativeAIError') {
        errorMessage = `Gemini API Error: ${(error as any).message}`;
    }
     return ModifyResultOutputSchema.parse({ 
        modifiedPrompt: `Error: Could not modify prompt due to an API error. ${errorMessage}. Original request: ${validatedInput.data.modificationRequest}`
    });
  }
}
