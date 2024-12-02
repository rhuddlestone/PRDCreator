import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the database user first
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const prd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id, // Use the database user ID instead of Clerk ID
      },
      include: {
        pages: true,
        implementation: true,
      }
    });

    if (!prd) {
      return new NextResponse("PRD not found", { status: 404 });
    }

    return NextResponse.json(prd);
  } catch (error) {
    console.error("[PRD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify PRD ownership
    const existingPrd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id,
      },
    });

    if (!existingPrd) {
      return new NextResponse("PRD not found", { status: 404 });
    }

    // Create update data without the 'pages' property
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => key !== 'pages')
    );

    // If llmResponse is being updated directly, keep llmProcessed as true
    if (updateData.llmResponse) {
      updateData.llmProcessed = true;
    }

    const prd = await db.pRD.update({
      where: {
        id: params.prdId,
        userId: user.id,
      },
      data: updateData,
    });

    return NextResponse.json(prd);
  } catch (error) {
    console.error("[PRD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { prdId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the database user first
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify PRD exists and belongs to user before deleting
    const prd = await db.pRD.findUnique({
      where: {
        id: params.prdId,
        userId: user.id,
      },
    });

    if (!prd) {
      return new NextResponse("PRD not found", { status: 404 });
    }

    // Delete the PRD
    await db.pRD.delete({
      where: {
        id: params.prdId,
        userId: user.id,
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
