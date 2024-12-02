import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { db } from "@/lib/db";
import { promises as fs } from 'fs';
import path from 'path';

// Define a custom error type
type ApiError = {
  message: string;
  type?: string;
  status?: number;
};

// Type guard for ApiError
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

// Helper function to safely stringify objects for logging
const safeStringify = <T extends object>(obj: T): string => {
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
      if (isApiError(error)) {
        if (attempt === maxRetries || error.type !== 'overloaded_error') {
          throw error;
        }
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`[ANTHROPIC_RETRY] Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await wait(delay);
      } else {
        throw error;
      }
    }
  }
  throw new Error('All retry attempts failed');
}

export async function POST(req: Request) {
  try {
    console.log("[ANTHROPIC_PAGE_REQUEST_START] Processing new page requirements request");
    
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

    const { prdId, pageId } = await req.json();
    console.log("[ANTHROPIC_REQUEST_DATA] PRD ID:", prdId, "Page ID:", pageId);

    if (!prdId || !pageId) {
      console.log("[ANTHROPIC_VALIDATION_ERROR] Missing PRD ID or Page ID");
      return new NextResponse("PRD ID and Page ID are required", { status: 400 });
    }

    // Fetch PRD and page data from database
    const prd = await db.pRD.findUnique({
      where: {
        id: prdId,
        userId: user.id,
      },
      include: {
        pages: {
          where: {
            id: pageId
          }
        }
      }
    });

    if (!prd || !prd.pages[0]) {
      console.log("[ANTHROPIC_VALIDATION_ERROR] PRD or Page not found or not owned by user");
      return new NextResponse("PRD or Page not found", { status: 404 });
    }

    const page = prd.pages[0];
    console.log("[ANTHROPIC_DATABASE] Retrieved PRD and Page data:", safeStringify({ prd, page }));

    // Load prompt template
    const promptPath = path.join(process.cwd(), 'app', 'prompts', 'page-requirements.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');

    // Create app background string
    const appBackground = `
Application Name: ${prd.appName}
Description: ${prd.appDescription}
Tech Stack:
- Programming Language: ${prd.progLanguage}
- Framework: ${prd.framework}
- Styling: ${prd.styling}
- Backend: ${prd.backend}
- Authentication: ${prd.auth}
${prd.otherPackages ? `- Other Packages: ${prd.otherPackages}` : ''}
    `.trim();

    // Replace placeholders in the prompt with PRD and page data
    const filledPrompt = promptTemplate
      .replace("{{APP_BACKGROUND}}", appBackground)
      .replace("{{PAGE_NAME}}", page.pageName)
      .replace("{{PAGE_DESCRIPTION}}", page.pageDescription);

    console.log("[ANTHROPIC_PROMPT] Sending prompt to API:", filledPrompt);

    // Generate requirements using Anthropic
    try {
      const result = await withRetry(async () => {
        return await generateText({
          model: anthropic('claude-3-5-sonnet-latest'),
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
          temperature: 0.7,
        });
      });

      console.log("[ANTHROPIC_RESPONSE] Received response from API:", safeStringify(result));

      // Extract text content and convert to a JSON-friendly format
      const textResult = result.text;
      const jsonResult = { 
        text: textResult,
        // Add any other relevant fields from the result
        finishReason: result.finishReason 
      };

      // Update the page in the database with the requirements
      await db.page.update({
        where: {
          id: pageId
        },
        data: {
          llmResponse: JSON.stringify(jsonResult), // Ensure it's a string
          llmProcessed: true,
          lastProcessed: new Date()
        }
      });

      return NextResponse.json({
        requirements: jsonResult
      });
    } catch (error: unknown) {
      console.error("[ANTHROPIC_ERROR]", error);
      const errorMessage = isApiError(error) ? error.message : 'An unknown error occurred';
      return new NextResponse(
        `Error generating page requirements: ${errorMessage}`,
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("[ANTHROPIC_ERROR]", error);
    const errorMessage = isApiError(error) ? error.message : 'An unknown error occurred';
    return new NextResponse(
      `Error generating page requirements: ${errorMessage}`,
      { status: 500 }
    );
  }
}
