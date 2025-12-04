'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/Button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AnswerDisplayProps {
  answer: string;
  isLoading?: boolean;
  className?: string;
}

export function AnswerDisplay({ answer, isLoading = false, className }: AnswerDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Answer</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="prose prose-gray max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                return !inline && language ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={cn('px-1 py-0.5 rounded bg-gray-100 text-sm', className)} {...props}>
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-4 last:mb-0 text-gray-700 leading-relaxed">{children}</p>;
              },
              h1({ children }) {
                return <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="text-xl font-bold mb-3 text-gray-900">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-lg font-semibold mb-2 text-gray-900">{children}</h3>;
              },
              ul({ children }) {
                return <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
                    {children}
                  </blockquote>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
