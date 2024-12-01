'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import convert from 'html-to-md';
import { EditLLMResponse } from '@/components/forms/edit-llm-response';

interface LLMResponse {
  text?: string;
  finishReason: string;
  intro?: string;
  metadata?: {
    cacheReadInputTokens: number;
    cacheCreationInputTokens: number;
  };
  generatedAt?: string;
}

interface Page {
  id: string;
  pageName: string;
  pageDescription: string;
  orderIndex: number;
  status: string;
  llmResponse?: LLMResponse | string;
}

interface ImplementationLLMResponse extends LLMResponse {
  analysis?: string;
  plan?: string;
}

interface Implementation {
  id: string;
  setupSteps: Record<string, unknown>;
  fileStructure: Record<string, unknown>;
  dependencies: Record<string, unknown>;
  deploymentGuide: Record<string, unknown>;
  llmResponse?: ImplementationLLMResponse;
}

interface PRD {
  id: string;
  appName: string;
  appDescription: string;
  progLanguage: string;
  framework: string;
  styling: string;
  backend: string;
  auth: string;
  otherPackages: string;
  pages: Page[];
  implementation?: Implementation;
  llmResponse?: LLMResponse | string;
  llmProcessed: boolean;
}

const getLLMResponseContent = (llmResponse: LLMResponse | string | undefined): string => {
  if (!llmResponse) return '';
  
  if (typeof llmResponse === 'string') {
    // If it's a string that looks like JSON, try to parse it
    if (llmResponse.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(llmResponse);
        return parsed.text || parsed.intro || llmResponse;
      } catch {
        return llmResponse;
      }
    }
    return llmResponse;
  }
  
  // If it's an LLMResponse object
  return llmResponse.intro || llmResponse.text || '';
};

export default function PRDPage() {
  const params = useParams();
  const [prdData, setPrdData] = useState<PRD | null>(null);
  const [loading, setLoading] = useState(true);

  const updateLLMResponse = async (newContent: string) => {
    if (!prdData) return;

    try {
      const response = await fetch(`/api/prds/${params.prdId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          llmResponse: {
            intro: newContent,
            finishReason: 'stop',
            generatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update LLM response');
      }

      // Update local state
      setPrdData({
        ...prdData,
        llmResponse: {
          ...(typeof prdData.llmResponse === 'object' ? prdData.llmResponse : {}),
          intro: newContent,
          finishReason: 'stop',
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error updating LLM response:', error);
      throw error;
    }
  };

  const updatePageLLMResponse = async (pageId: string, newContent: string) => {
    if (!prdData) return;

    try {
      const response = await fetch(`/api/prds/${params.prdId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pages: [{
            id: pageId,
            llmResponse: {
              text: newContent,
              finishReason: 'stop',
              generatedAt: new Date().toISOString(),
            },
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update page LLM response');
      }

      // Update local state
      setPrdData({
        ...prdData,
        pages: prdData.pages.map(page =>
          page.id === pageId
            ? {
                ...page,
                llmResponse: {
                  text: newContent,
                  finishReason: 'stop',
                  generatedAt: new Date().toISOString(),
                },
              }
            : page
        ),
      });
    } catch (error) {
      console.error('Error updating page LLM response:', error);
      throw error;
    }
  };

  const updateImplementationSection = async (section: 'analysis' | 'plan', newContent: string) => {
    if (!prdData || !prdData.implementation) return;

    try {
      const currentResponse = typeof prdData.implementation.llmResponse === 'object' 
        ? prdData.implementation.llmResponse 
        : { finishReason: 'stop' };

      const response = await fetch(`/api/prds/${params.prdId}/implementation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          implementation: {
            llmResponse: {
              ...currentResponse,
              [section]: newContent,
              finishReason: 'stop',
              generatedAt: new Date().toISOString(),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update implementation section');
      }

      // Update local state
      setPrdData({
        ...prdData,
        implementation: {
          ...prdData.implementation,
          llmResponse: {
            ...currentResponse,
            [section]: newContent,
            finishReason: 'stop',
            generatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Error updating implementation section:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await fetch(`/api/prds/${params.prdId}`);
        const data = await response.json();
        if (!data) {
          throw new Error('PRD not found');
        }
        console.log('Fetched PRD data:', JSON.stringify(data, null, 2));
        console.log('llmResponse:', data.llmResponse);
        setPrdData(data);
      } catch (error) {
        console.error('Error fetching PRD:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.prdId) {
      fetchPRD();
    }
  }, [params.prdId]);

  const handleExportPDF = async () => {
    if (!prdData) return;

    const doc = new jsPDF();
    const content = document.getElementById('prd-content');
    if (!content) return;

    // Set title
    doc.setFontSize(20);
    doc.text(prdData.appName, 20, 20);
    let yPosition = 40;

    // Add initial LLM response if exists
    if (prdData.llmResponse) {
      doc.setFontSize(12);
      const llmContent = getLLMResponseContent(prdData.llmResponse);
      const splitText = doc.splitTextToSize(llmContent, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += (splitText.length * 7) + 15;
    }

    // Add tech stack
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.text('Tech Stack:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(`Language: ${prdData.progLanguage}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Framework: ${prdData.framework}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Styling: ${prdData.styling}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Backend: ${prdData.backend}`, 30, yPosition);
    yPosition += 7;
    doc.text(`Auth: ${prdData.auth}`, 30, yPosition);
    yPosition += 15;

    // Add pages with their LLM responses
    prdData.pages.sort((a, b) => a.orderIndex - b.orderIndex).forEach((page) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(`Status: ${page.status}`, 20, yPosition);
      yPosition += 10;

      if (page.llmResponse) {
        doc.setFontSize(10);
        const llmContent = getLLMResponseContent(page.llmResponse);
        const splitText = doc.splitTextToSize(llmContent, 170);
        doc.text(splitText, 20, yPosition);
        yPosition += (splitText.length * 7) + 15;
      }
    });

    // Add implementation details if they exist
    if (prdData.implementation?.llmResponse) {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Implementation', 20, yPosition);
      yPosition += 10;

      if (typeof prdData.implementation.llmResponse === 'object') {
        if (prdData.implementation.llmResponse.analysis) {
          doc.setFontSize(12);
          doc.text('Analysis:', 20, yPosition);
          yPosition += 7;
          doc.setFontSize(10);
          const analysisText = doc.splitTextToSize(prdData.implementation.llmResponse.analysis, 170);
          doc.text(analysisText, 20, yPosition);
          yPosition += (analysisText.length * 7) + 10;
        }

        if (prdData.implementation.llmResponse.plan) {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.text('Implementation Plan:', 20, yPosition);
          yPosition += 7;
          doc.setFontSize(10);
          const planText = doc.splitTextToSize(prdData.implementation.llmResponse.plan, 170);
          doc.text(planText, 20, yPosition);
        }
      }
    }

    doc.save(`${prdData.appName.replace(/\s+/g, '_')}_PRD.pdf`);
  };

  const handleExportMarkdown = () => {
    if (!prdData) return;

    const content = document.getElementById('prd-content');
    if (!content) return;

    const markdown = convert(content.innerHTML);
    
    // Create a blob with the markdown content
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prdData.appName.replace(/\s+/g, '_')}_PRD.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!prdData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">PRD Not Found</h1>
        <Link href="/dashboard">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{prdData.appName}</h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleExportPDF}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button
              onClick={handleExportMarkdown}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export as Markdown
            </Button>
          </div>
        </div>

        <div id="prd-content" className="space-y-8">
          {prdData?.llmResponse && (
            <section className="bg-white rounded-lg shadow p-6">
              <EditLLMResponse
                content={getLLMResponseContent(prdData.llmResponse)}
                onSave={updateLLMResponse}
              />
            </section>
          )}

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Programming Language:</p>
                <p className="text-gray-600">{prdData.progLanguage}</p>
              </div>
              <div>
                <p className="font-medium">Framework:</p>
                <p className="text-gray-600">{prdData.framework}</p>
              </div>
              <div>
                <p className="font-medium">Styling:</p>
                <p className="text-gray-600">{prdData.styling}</p>
              </div>
              <div>
                <p className="font-medium">Backend:</p>
                <p className="text-gray-600">{prdData.backend}</p>
              </div>
              <div>
                <p className="font-medium">Authentication:</p>
                <p className="text-gray-600">{prdData.auth}</p>
              </div>
              <div>
                <p className="font-medium">Other Packages:</p>
                <p className="text-gray-600">{prdData.otherPackages}</p>
              </div>
            </div>
          </section>

          {prdData.pages.sort((a, b) => a.orderIndex - b.orderIndex).map((page) => (
            <section key={page.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-end mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {page.status}
                </span>
              </div>
              {page.llmResponse && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <EditLLMResponse
                    content={getLLMResponseContent(page.llmResponse)}
                    onSave={(newContent) => updatePageLLMResponse(page.id, newContent)}
                  />
                </div>
              )}
            </section>
          ))}

          {prdData.implementation && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Implementation</h2>
              {prdData.implementation.llmResponse && typeof prdData.implementation.llmResponse === 'object' && (
                <>
                  {prdData.implementation.llmResponse.analysis && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Analysis</h3>
                      <EditLLMResponse
                        content={prdData.implementation.llmResponse.analysis}
                        onSave={(newContent) => updateImplementationSection('analysis', newContent)}
                      />
                    </div>
                  )}
                  {prdData.implementation.llmResponse.plan && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Implementation Plan</h3>
                      <EditLLMResponse
                        content={prdData.implementation.llmResponse.plan}
                        onSave={(newContent) => updateImplementationSection('plan', newContent)}
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
