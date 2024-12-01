'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Edit2, X, Check } from 'lucide-react';
import { StyledMarkdown } from '@/app/components/styled-markdown';

interface EditLLMResponseProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
}

export function EditLLMResponse({ content, onSave }: EditLLMResponseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(editedContent);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update content",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="relative group">
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="prose max-w-none">
          <StyledMarkdown content={content} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={10}
        className="w-full font-mono text-sm"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditedContent(content);
            setIsEditing(false);
          }}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={loading}
        >
          <Check className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}
