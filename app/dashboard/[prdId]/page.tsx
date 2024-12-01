import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewPRDForm } from "@/components/forms/new-prd-form";

export default async function EditPRDPage({
  params
}: {
  params: { prdId: string }
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const prd = await db.pRD.findUnique({
    where: {
      id: params.prdId,
    },
    include: {
      pages: {
        orderBy: {
          orderIndex: 'asc'
        }
      }
    }
  });

  if (!prd) {
    redirect("/dashboard");
  }

  // Transform pages data to match form structure
  const transformedPrd = {
    ...prd,
    pages: prd.pages.map(page => ({
      id: page.id,
      pageName: page.pageName,
      pageDescription: page.pageDescription
    }))
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit PRD</CardTitle>
          <CardDescription>
            Update your Project Requirement Document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPRDForm initialData={transformedPrd} />
        </CardContent>
      </Card>
    </div>
  );
}
