import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewPRDForm } from "@/components/forms/new-prd-form";

export default async function NewPRDPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New PRD</CardTitle>
          <CardDescription>
            Fill out the form below to create a new Project Requirement Document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPRDForm />
        </CardContent>
      </Card>
    </div>
  );
}
