"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  appDescription: z.string().min(1, "App description is required"),
  progLanguage: z.string().min(1, "Programming language is required"),
  framework: z.string().min(1, "Framework is required"),
  styling: z.string().min(1, "Styling solution is required"),
  backend: z.string().min(1, "Backend solution is required"),
  auth: z.string().min(1, "Authentication solution is required"),
  payments: z.string(),
  otherPackages: z.string(),
  pages: z.array(z.object({
    id: z.string().optional(),
    pageName: z.string().min(1, "Page name is required"),
    pageDescription: z.string().min(1, "Page description is required"),
  })),
});

type FormValues = z.infer<typeof formSchema>;

interface PageData {
  id?: string;
  pageName: string;
  pageDescription: string;
}

interface SavedPage extends PageData {
  llmProcessed?: boolean;
}

interface PRDData extends Omit<FormValues, 'pages'> {
  id?: string;
  pages?: SavedPage[];
}

interface NewPRDFormProps {
  initialData?: PRDData;
}

export function NewPRDForm({ initialData }: NewPRDFormProps) {
  console.log("[NewPRDForm] Initial Data:", initialData);
  console.log("[NewPRDForm] Initial Pages:", initialData?.pages);

  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<'details' | 'pages'>('details');
  const [prdId, setPrdId] = useState<string | null>(initialData?.id || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [pagesChanged, setPagesChanged] = useState(false);

  // Helper function to determine if there are any pending changes
  const hasPendingChanges = () => {
    if (currentStage === 'details') {
      return formChanged;
    }
    return pagesChanged;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: initialData?.appName || "",
      appDescription: initialData?.appDescription || "",
      progLanguage: initialData?.progLanguage || "",
      framework: initialData?.framework || "",
      styling: initialData?.styling || "",
      backend: initialData?.backend || "",
      auth: initialData?.auth || "",
      payments: initialData?.payments || "",
      otherPackages: initialData?.otherPackages || "",
      pages: initialData?.pages?.map((page) => ({
        id: page.id,
        pageName: page.pageName,
        pageDescription: page.pageDescription,
      })) || [],
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      const currentValues = form.getValues();
      
      // Check if we're in details stage
      if (currentStage === 'details') {
        const hasChanges = Object.keys(currentValues).some(key => {
          if (key === 'pages') {
            return false;
          }
          return currentValues[key as keyof Omit<FormValues, 'pages'>] !== (initialData?.[key as keyof Omit<PRDData, 'pages' | 'id'>] || "");
        });
        setFormChanged(hasChanges);
      } 
      // Check pages changes
      else {
        const currentPages = currentValues.pages || [];
        const initialPages = initialData?.pages || [];
        
        // Compare current pages with initial pages
        const hasPageChanges = currentPages.length !== initialPages.length ||
          currentPages.some((page, index) => {
            const initialPage = initialPages[index];
            return !initialPage ||
              page.pageName !== initialPage.pageName ||
              page.pageDescription !== initialPage.pageDescription;
          });
        
        setPagesChanged(hasPageChanges);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, initialData, currentStage]);

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);

      const response = await fetch(prdId ? `/api/prds/${prdId}` : "/api/prds", {
        method: prdId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(prdId ? "Failed to update PRD" : "Something went wrong");
      }

      const prd = await response.json();

      // Generate PRD content using Anthropic
      try {
        const aiResponse = await fetch("/api/anthropic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prdId: prd.id,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error("Failed to generate PRD content");
        }

        // After generating PRD content, call the implementation endpoint
        const implementationResponse = await fetch(`/api/prds/${prd.id}/implementation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!implementationResponse.ok) {
          throw new Error("Failed to generate implementation details");
        }

        toast({
          title: "Success",
          description: "PRD and implementation details generated successfully",
        });
      } catch (err) {
        console.error("[PRD_ERROR] Error generating content:", err);
        toast({
          title: "Warning",
          description: "PRD saved but there was an error generating the content",
          variant: "destructive",
        });
      }

      router.push(`/dashboard/${prd.id}`);
    } catch (err) {
      console.error("[PRD_ERROR] Error submitting form:", err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function saveInitialPRD() {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to create a PRD",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      const values = form.getValues();
      
      // First, save/update the PRD
      const response = await fetch(prdId ? `/api/prds/${prdId}` : "/api/prds", {
        method: prdId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          pages: [] // We'll add pages later
        }),
      });

      if (!response.ok) {
        throw new Error(prdId ? "Failed to update PRD" : "Failed to save PRD");
      }

      const prd = await response.json();
      setPrdId(prd.id);

      // Now generate the PRD content using Anthropic
      try {
        const aiResponse = await fetch("/api/anthropic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prdId: prd.id,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error("Failed to generate PRD content");
        }

        const { content } = await aiResponse.json();
        console.log("[PRD_CONTENT] Generated content:", content?.substring(0, 100) + "...");
        
        // After generating PRD content, call the implementation endpoint
        const implementationResponse = await fetch(`/api/prds/${prd.id}/implementation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!implementationResponse.ok) {
          throw new Error("Failed to generate implementation details");
        }

        toast({
          title: "Success",
          description: "PRD content generated successfully",
        });
      } catch (err) {
        console.error("[PRD_ERROR] Error generating PRD:", err);
        toast({
          title: "Warning",
          description: "PRD saved but there was an error generating the content",
          variant: "destructive",
        });
      }
      
      toast({
        title: "Success",
        description: prdId ? "PRD updated successfully" : "PRD details saved successfully",
      });

      setCurrentStage('pages');
      return true;
    } catch (err) {
      console.error("[PRD_ERROR] Error saving PRD:", err);
      toast({
        title: "Error",
        description: prdId ? "Failed to update PRD details" : "Failed to save PRD details",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const validateFirstStage = () => {
    const fields: (keyof Omit<FormValues, 'pages'>)[] = [
      'appName',
      'appDescription',
      'progLanguage',
      'framework',
      'styling',
      'backend',
      'auth',
      'payments',
      'otherPackages'
    ];
    
    let isValid = true;
    
    fields.forEach(field => {
      const value = form.getValues(field);
      if (!value) {
        form.setError(field, {
          type: 'required',
          message: `${field} is required`,
        });
        isValid = false;
      }
    });

    return isValid;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentStage === 'details' ? (
          <>
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of your application"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="progLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programming Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Javascript, Typescript, Python etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Framework</FormLabel>
                    <FormControl>
                      <Input placeholder="React, NextJs etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="styling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Styling</FormLabel>
                    <FormControl>
                      <Input placeholder="Tailwind, Shadcn etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back End</FormLabel>
                    <FormControl>
                      <Input placeholder="Postgres, Firebase etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="auth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authentication</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JWT, OAuth, Firebase Auth" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Integration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Stripe, PayPal, Square" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="otherPackages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Packages</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UX Pilot AI, React-Query etc"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4 w-full">
              <Button
                type="button"
                className="flex-1"
                disabled={isLoading || !formChanged}
                onClick={async () => {
                  if (validateFirstStage()) {
                    const saved = await saveInitialPRD();
                    if (saved) {
                      setCurrentStage('pages');
                      // Initialize with one empty page when transitioning
                      const currentPages = form.getValues("pages");
                      if (currentPages.length === 0) {
                        form.setValue("pages", [{ pageName: "", pageDescription: "" }]);
                      }
                    }
                  }
                }}
              >
                {isLoading ? "Saving..." : "Build PRD Intro and Add Pages"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  if (validateFirstStage()) {
                    setCurrentStage('pages');
                    // Only initialize with empty page if there are no existing pages
                    const currentPages = form.getValues("pages");
                    if (!currentPages || currentPages.length === 0) {
                      form.setValue("pages", [{ pageName: "", pageDescription: "" }]);
                    }
                  }
                }}
              >
                Skip to Add Pages
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStage('details')}
              >
                Back to Details
              </Button>
              <h2 className="text-lg font-medium">Add Pages</h2>
            </div>

            <div className="space-y-4">
              {form.watch("pages").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`pages.${index}.pageName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Page Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`pages.${index}.pageDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Page Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={async () => {
                        const currentPages = form.getValues("pages");
                        const pageToRemove = currentPages[index];
                        
                        // If we have a prdId and the page has an id (exists in DB)
                        if (prdId && pageToRemove.id) {
                          try {
                            const response = await fetch(`/api/prds/${prdId}/pages`, {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                pageId: pageToRemove.id,
                              }),
                            });

                            if (!response.ok) {
                              throw new Error("Failed to delete page from database");
                            }

                            toast({
                              title: "Success",
                              description: "Page deleted successfully",
                            });
                          } catch (err) {
                            console.error("[PAGE_DELETE_ERROR]", err);
                            toast({
                              title: "Error",
                              description: "Failed to delete page",
                              variant: "destructive",
                            });
                            return;
                          }
                        }

                        // Remove page from form state
                        const updatedPages = currentPages.filter((_, i) => i !== index);
                        form.setValue("pages", updatedPages);
                      }}
                    >
                      Remove Page
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={async () => {
                  const currentPages = form.getValues("pages");
                  form.setValue("pages", [...currentPages, { pageName: "", pageDescription: "" }]);
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Page
              </Button>
            </div>

            <Button 
              type="button" 
              className="w-full" 
              disabled={isGenerating || !pagesChanged}
              onClick={async () => {
                try {
                  const pages = form.getValues("pages");
                  if (!pages.length) {
                    toast({
                      title: "Error",
                      description: "Please add at least one page",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (!prdId) {
                    toast({
                      title: "Error",
                      description: "PRD ID not found",
                      variant: "destructive",
                    });
                    return;
                  }

                  setIsGenerating(true);

                  // Save pages to database
                  const response = await fetch(`/api/prds/${prdId}/pages`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pages }),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to save pages");
                  }

                  const savedPages = await response.json();

                  // Only generate requirements for new pages (pages without llmProcessed flag)
                  const newPages = savedPages.filter((page: SavedPage) => !page.llmProcessed);
                  
                  if (newPages.length > 0) {
                    for (const page of newPages) {
                      const reqResponse = await fetch("/api/anthropic/page-requirements", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          prdId,
                          pageId: page.id,
                        }),
                      });

                      if (!reqResponse.ok) {
                        throw new Error(`Failed to generate requirements for page ${page.pageName}`);
                      }
                    }

                    toast({
                      title: "Success",
                      description: `Requirements generated for ${newPages.length} new page(s)`,
                    });
                  } else {
                    toast({
                      title: "Success",
                      description: "Pages saved successfully",
                    });
                  }

                  router.push(`/dashboard/${prdId}`);
                } catch (err) {
                  console.error("[PAGE_SAVE_ERROR]", err);
                  const error = err as Error;
                  toast({
                    title: "Error",
                    description: error.message || "Something went wrong",
                    variant: "destructive",
                  });
                } finally {
                  setIsGenerating(false);
                }
              }}
            >
              {isGenerating ? "Generating Requirements..." : "Save Pages and Generate Requirements"}
            </Button>

            <Button 
              type="submit"
              className="w-full mt-4"
              disabled={isLoading}
              onClick={async (e) => {
                // If no pending changes and we have a prdId, navigate to PRD view
                if (!hasPendingChanges() && prdId) {
                  e.preventDefault();
                  router.push(`/dashboard/${prdId}/view`);
                  return;
                }
              }}
            >
              {isLoading ? (
                "Saving..."
              ) : !hasPendingChanges() && prdId ? (
                "Open PRD"
              ) : (
                "Create PRD"
              )}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
