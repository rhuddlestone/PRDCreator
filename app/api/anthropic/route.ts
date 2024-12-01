import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { db } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

// Define custom error interface for API errors
interface ApiError extends Error {
  type?: string;
}

// Type guard for ApiError
function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'type' in error;
}

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
      if (attempt === maxRetries || (isApiError(error) && error.type !== 'overloaded_error')) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`[ANTHROPIC_RETRY] Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await wait(delay);
    }
  }
  throw new Error('All retry attempts failed');
}

export async function POST(req: Request) {
  try {
    console.log("[ANTHROPIC_REQUEST_START] Processing new request");
    
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.log("[ANTHROPIC_AUTH_ERROR] No clerk user ID found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      console.log("[ANTHROPIC_AUTH_ERROR] No database user found for clerk ID:", clerkUserId);
      return new NextResponse("User not found", { status: 404 });
    }

    const { prdId } = await req.json();
    console.log("[ANTHROPIC_REQUEST_DATA] PRD ID:", prdId);

    if (!prdId) {
      console.log("[ANTHROPIC_VALIDATION_ERROR] Missing PRD ID");
      return new NextResponse("PRD ID is required", { status: 400 });
    }

    // Fetch PRD data from database
    const prd = await db.pRD.findUnique({
      where: {
        id: prdId,
        userId: user.id,
      },
    });

    if (!prd) {
      console.log("[ANTHROPIC_VALIDATION_ERROR] PRD not found or not owned by user. PRD ID:", prdId, "User ID:", user.id);
      return new NextResponse("PRD not found", { status: 404 });
    }

    console.log("[ANTHROPIC_DATABASE] Retrieved PRD data:", safeStringify(prd));

    // Load prompt template
    const promptPath = path.join(process.cwd(), 'app', 'prompts', 'prd-intro.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');

    // Replace placeholders in the prompt with PRD data
    const filledPrompt = promptTemplate
      .replace("{{APPLICATION_NAME}}", prd.appName)
      .replace("{{APPLICATION_DESCRIPTION}}", prd.appDescription)
      .replace("{{Progamming_Language}}", prd.progLanguage)
      .replace("{{framework}}", prd.framework)
      .replace("{{styling}}", prd.styling)
      .replace("{{backend}}", prd.backend)
      .replace("{{auth}}", prd.auth)
      .replace("{{otherPackages}}", prd.otherPackages || "No additional packages specified");

    console.log("[ANTHROPIC_PROMPT] Sending prompt to API:", filledPrompt);

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
          maxTokens: 1000,
          temperature: 0.2,
        });
      });

      console.log("[ANTHROPIC_RESPONSE] API Response:", {
        text: result.text?.substring(0, 100) + "...", // Log first 100 chars of response
        metadata: result.experimental_providerMetadata?.anthropic,
      });

      // Save the generated content to the database
      await db.pRD.update({
        where: {
          id: prdId,
          userId: user.id,
        },
        data: {
          llmResponse: {
            intro: result.text,
            generatedAt: new Date().toISOString(),
            metadata: result.experimental_providerMetadata?.anthropic
          },
          llmProcessed: true,
        },
      });

      console.log("[ANTHROPIC_SUCCESS] Successfully processed and saved response for PRD:", prdId);
      return NextResponse.json({ content: result.text });
    } catch (error: unknown) {
      console.error("[ANTHROPIC_API_ERROR] Error calling Anthropic API:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        type: isApiError(error) ? error.type : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error: unknown) {
    console.error("[ANTHROPIC_ERROR] Unhandled error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      type: isApiError(error) ? error.type : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
