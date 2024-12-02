'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Greeting } from "@/components/ui/greeting";
import { getPRDs } from "./actions";

interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type LLMResponse = {
  intro?: string;
  analysis?: string;
  [key: string]: unknown;
} | string | null;

interface PRD {
  id: string;
  appName: string;
  appDescription: string;
  progLanguage: string;
  framework: string;
  styling: string;
  backend: string;
  auth: string;
  payments: string;
  otherPackages: string;
  llmProcessed: boolean;
  llmResponse?: LLMResponse;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<{ prds: PRD[]; user: User } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getPRDs();
      if (result) {
        // Transform the data to match our PRD interface
        const transformedPRDs = result.prds.map(prd => ({
          ...prd,
          llmResponse: prd.llmResponse as LLMResponse,
          createdAt: new Date(prd.createdAt),
          updatedAt: new Date(prd.updatedAt)
        }));
        setData({ prds: transformedPRDs, user: result.user });
      } else {
        setData(null);
      }
    };
    loadData();
  }, []);

  if (!data) return null;

  const { prds, user } = data;

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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={async () => {
                      const confirmed = window.confirm('Are you sure you want to delete this PRD?');
                      if (confirmed) {
                        try {
                          const response = await fetch(`/api/prds/${prd.id}`, {
                            method: 'DELETE',
                          });
                          
                          if (response.ok) {
                            // Instead of reloading, update the state
                            const result = await getPRDs();
                            if (result) {
                              const transformedPRDs = result.prds.map(prd => ({
                                ...prd,
                                llmResponse: prd.llmResponse as LLMResponse,
                                createdAt: new Date(prd.createdAt),
                                updatedAt: new Date(prd.updatedAt)
                              }));
                              setData({ prds: transformedPRDs, user: result.user });
                            } else {
                              setData(null);
                            }
                          } else {
                            const error = await response.text();
                            console.error('Failed to delete PRD:', error);
                            alert('Failed to delete PRD. Please try again.');
                          }
                        } catch (error) {
                          console.error('Error deleting PRD:', error);
                          alert('An error occurred while deleting the PRD. Please try again.');
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
