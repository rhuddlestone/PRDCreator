import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { db } from "@/lib/db";
import { promises as fs } from 'fs';
import path from 'path';
import { JsonValue } from "@prisma/client/runtime/library";

// Helper function to safely stringify objects for logging
const safeStringify = (obj: unknown) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return `[Error stringifying object: ${error}]`;
  }
};

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const typedError = error as { type?: string };
      if (attempt === maxRetries || typedError.type !== 'overloaded_error') {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`[IMPLEMENTATION_RETRY] Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await wait(delay);
    }
  }
  throw new Error('All retry attempts failed');
}

export async function POST(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    console.log("[IMPLEMENTATION_REQUEST_START] Processing new request");
    
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.log("[IMPLEMENTATION_AUTH_ERROR] No clerk user ID found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      console.log("[IMPLEMENTATION_AUTH_ERROR] No database user found for clerk ID:", clerkUserId);
      return new NextResponse("User not found", { status: 404 });
    }

    // Fetch PRD data from database with pages
    const prd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id,
      },
      include: {
        pages: true,
      }
    });

    if (!prd) {
      console.log("[IMPLEMENTATION_VALIDATION_ERROR] PRD not found or not owned by user. PRD ID:", params.prdId, "User ID:", user.id);
      return new NextResponse("PRD not found", { status: 404 });
    }

    console.log("[IMPLEMENTATION_DATABASE] Retrieved PRD data:", safeStringify(prd));

    // Load prompt template
    const promptPath = path.join(process.cwd(), 'prompt3.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');

    interface LLMResponse {
      intro: string;
      [key: string]: unknown;
    }

    interface PRDPage {
      id: string;
      pageName: string;
      pageDescription: string;
      llmResponse: JsonValue;
      llmProcessed: boolean;
      createdAt: Date;
      updatedAt: Date;
      orderIndex: number;
      status: string;
      lastProcessed: Date | null;
      prdId: string;
    }

    // Prepare the PRD body by combining intro and pages
    const prdBody = `
# ${prd.appName}

## Overview
${typeof prd.llmResponse === 'object' && prd.llmResponse !== null && 'intro' in prd.llmResponse 
  ? (prd.llmResponse as LLMResponse).intro 
  : prd.appDescription}

## Technical Stack
- Programming Language: ${prd.progLanguage}
- Framework: ${prd.framework}
- Styling: ${prd.styling}
- Backend: ${prd.backend}
- Authentication: ${prd.auth}
- Additional Packages: ${prd.otherPackages}

## Pages
${prd.pages.map((page: PRDPage, index: number) => `
### ${index + 1}. ${page.pageName}
${page.pageDescription}
${page.llmResponse ? '\\nDetails:\\n' + String(page.llmResponse) : ''}
`).join('\\n')}
`;

    // Replace placeholders in the prompt
    const filledPrompt = promptTemplate.replace("{{PRD_BODY}}", prdBody);

    console.log("[IMPLEMENTATION_PROMPT] Sending prompt to API:", filledPrompt);

    try {
      const result = await withRetry(async () => {
        return generateText({
          model: anthropic('claude-3-5-sonnet-latest', {
            cacheControl: true,
          }),
          messages: [
            {
              role: 'user',
              content: [
                { 
                  type: 'text', 
                  text: filledPrompt,
                }
              ],
            },
          ],
          maxTokens: 4000,
          temperature: 0.2,
        });
      });

      console.log("[IMPLEMENTATION_RESPONSE] API Response:", {
        text: result.text?.substring(0, 100) + "...", // Log first 100 chars of response
        metadata: result.experimental_providerMetadata?.anthropic,
      });

      // Parse the implementation sections from the response
      const sections = {
        analysis: result.text.match(/## Implementation Analysis([\s\S]*?)(?=## Staged Implementation Plan)/)?.[1]?.trim() || '',
        plan: result.text.match(/## Staged Implementation Plan([\s\S]*?)$/)?.[1]?.trim() || result.text,
      };

      // Save the implementation to the database
      await db.implementation.upsert({
        where: {
          prdId: params.prdId,
        },
        create: {
          prdId: params.prdId,
          setupSteps: {},
          fileStructure: {},
          dependencies: {},
          deploymentGuide: {},
          llmResponse: {
            analysis: sections.analysis,
            plan: sections.plan,
            generatedAt: new Date().toISOString(),
            metadata: result.experimental_providerMetadata?.anthropic
          },
          llmProcessed: true,
        },
        update: {
          llmResponse: {
            analysis: sections.analysis,
            plan: sections.plan,
            generatedAt: new Date().toISOString(),
            metadata: result.experimental_providerMetadata?.anthropic
          },
          llmProcessed: true,
        },
      });

      console.log("[IMPLEMENTATION_SUCCESS] Successfully processed and saved implementation for PRD:", params.prdId);
      return NextResponse.json({ 
        content: result.text,
        sections 
      });
    } catch (apiError: unknown) {
      const error = apiError as Error;
      console.error("[IMPLEMENTATION_API_ERROR] Error calling Anthropic API:", {
        error,
        message: error.message,
        type: (error as { type?: string }).type,
        stack: error.stack,
      });
      throw apiError; // Re-throw to be caught by outer try-catch
    }
  } catch (error: unknown) {
    const typedError = error as Error;
    console.error("[IMPLEMENTATION_ERROR] Unhandled error:", {
      error,
      message: typedError.message,
      type: (error as { type?: string }).type,
      stack: typedError.stack,
    });
    return new NextResponse(`Internal Error: ${typedError.message}`, { status: 500 });
  }
}
