import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type PageUpdateData = Prisma.PageUpdateInput;

export async function POST(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { pages } = await req.json();

    // Validate pages array
    if (!Array.isArray(pages) || !pages.length) {
      return new NextResponse("Invalid pages data", { status: 400 });
    }

    // Verify PRD ownership
    const prd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id,
      },
    });

    if (!prd) {
      return new NextResponse("PRD not found", { status: 404 });
    }

    // Get the current highest orderIndex
    const highestOrderPage = await db.page.findFirst({
      where: { prdId: params.prdId },
      orderBy: { orderIndex: 'desc' }
    });

    const startingOrderIndex = (highestOrderPage?.orderIndex ?? -1) + 1;

    // Create pages in database
    const savedPages = await Promise.all(
      pages.map(async (page: { 
        id?: string;
        pageName?: string; 
        pageDescription?: string;
        llmResponse?: Prisma.JsonValue;
        orderIndex?: number;
      }, index: number) => {
        if (page.id) {
          // For updates, only update the fields that are provided
          const updateData: PageUpdateData = {
            updatedAt: new Date()
          };
          if (page.pageName) updateData.pageName = page.pageName;
          if (page.pageDescription) updateData.pageDescription = page.pageDescription;
          if (page.llmResponse) {
            updateData.llmResponse = page.llmResponse;
            // Don't mark as unprocessed when manually editing
            updateData.llmProcessed = true;
          }
          if (page.orderIndex !== undefined) updateData.orderIndex = page.orderIndex;

          const updatedPage = await db.page.update({
            where: {
              id: page.id,
              prdId: params.prdId,
            },
            data: updateData,
          });
          return updatedPage;
        }
        
        // Create new page
        const newPage = await db.page.create({
          data: {
            pageName: page.pageName || '',
            pageDescription: page.pageDescription || '',
            orderIndex: startingOrderIndex + index,
            prdId: params.prdId,
            createdAt: new Date(),
            updatedAt: new Date(),
            llmProcessed: false,
          },
        });
        return newPage;
      })
    );

    return NextResponse.json(savedPages);
  } catch (error) {
    console.log("[PAGES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    const { userId } = await auth();
    const { pageId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify PRD ownership
    const prd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id,
      },
    });

    if (!prd) {
      return new NextResponse("PRD not found", { status: 404 });
    }

    // Delete the page
    const deletedPage = await db.page.delete({
      where: {
        id: pageId,
        prdId: params.prdId,
      },
    });

    return NextResponse.json(deletedPage);
  } catch (error) {
    console.log("[PAGES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
