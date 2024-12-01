'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function Editor({ initialContent = '', onChange, placeholder }: EditorProps) {
  const [content, setContent] = useState('');

  const sanitizeContent = useCallback((htmlContent: string): string => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    // Find all images and ensure they have alt attributes
    const images = temp.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
      }
    }

    return temp.innerHTML;
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    const sanitizedContent = sanitizeContent(newContent);
    setContent(sanitizedContent);
    onChange?.(sanitizedContent);
  }, [onChange, sanitizeContent]);

  // Update content when initialContent prop changes
  useEffect(() => {
    if (initialContent) {
      handleContentChange(initialContent);
    }
  }, [initialContent, handleContentChange]);

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter image description (alt text):', '') || '';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        range.deleteContents();
        range.insertNode(img);
        handleContentChange(document.querySelector('[contenteditable]')?.innerHTML || '');
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={insertLink}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertImage}
          title="Insert Image"
        >
          <Image className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <div
        className="p-4 min-h-[200px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        contentEditable
        onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
        style={{ outline: 'none' }}
      />
    </div>
  );
}
