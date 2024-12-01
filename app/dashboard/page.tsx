import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { Greeting } from "@/components/ui/greeting";

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  // Get the database user first
  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUserId
    }
  });

  if (!user) {
    return null;
  }

  const prds = await db.pRD.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <Greeting name={user.name || 'there'} />
          <p className="text-sm text-muted-foreground">
            Manage your Project Requirement Documents
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard/new">
            <Button>
              <span className="mr-2">+</span>
              Create New PRD
            </Button>
          </Link>
          <Link href="/dashboard/templates">
            <Button variant="secondary">
              <span className="mr-2">📁</span>
              Templates
            </Button>
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your PRDs</h2>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-6">NAME</div>
              <div className="col-span-4">LAST MODIFIED</div>
              <div className="col-span-2">ACTIONS</div>
            </div>
            {prds.map((prd) => (
              <div
                key={prd.id}
                className="grid grid-cols-12 p-4 items-center hover:bg-muted/50"
              >
                <div className="col-span-6 font-medium">{prd.appName}</div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  {formatDate(prd.updatedAt)}
                </div>
                <div className="col-span-2 flex gap-2">
                  <Link href={`/dashboard/${prd.id}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/${prd.id}/view`}>
                    <Button variant="ghost" size="sm" className="text-green-600">
                      Open
                    </Button>
                  </Link>
                  <form action={`/api/prds/${prd.id}`} method="DELETE">
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
