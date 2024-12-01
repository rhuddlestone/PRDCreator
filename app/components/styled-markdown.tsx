import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface StyledMarkdownProps {
  content: string;
  className?: string;
}

export function StyledMarkdown({ content, className }: StyledMarkdownProps) {
  return (
    <div className={cn(
      "prose prose-slate max-w-none",
      "prose-headings:font-semibold prose-headings:text-foreground",
      "prose-h1:text-3xl prose-h1:mb-4",
      "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4",
      "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3",
      "prose-p:text-muted-foreground prose-p:leading-7",
      "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
      "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
      "prose-li:my-2",
      "prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5",
      "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4",
      "prose-strong:font-semibold prose-strong:text-foreground",
      "prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:pl-4 prose-blockquote:italic",
      className
    )}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
