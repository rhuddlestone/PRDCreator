import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { userId: clerkUserId } = await auth();

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

    const prds = await db.pRD.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(prds);
  } catch (error) {
    console.error("[PRDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const POST = async (req: Request) => {
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

    const prd = await db.pRD.create({
      data: {
        userId: user.id,
        appName: body.appName,
        appDescription: body.appDescription,
        progLanguage: body.progLanguage,
        framework: body.framework,
        styling: body.styling,
        backend: body.backend,
        auth: body.auth,
        payments: body.payments,
        otherPackages: body.otherPackages,
      }
    });

    return NextResponse.json(prd);
  } catch (error) {
    console.error("[PRDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
