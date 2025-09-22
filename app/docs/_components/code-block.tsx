"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace(/language-/, '') || 'text';
  
  // Clean up the code content
  const code = String(children).replace(/\n$/, '');
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group mb-6">
      {/* Title bar (if provided) */}
      {title && (
        <div className="flex items-center justify-between bg-muted/80 border border-border/50 border-b-0 rounded-t-xl px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      )}
      
      {/* Code block */}
      <div className="relative rounded-xl bg-muted/80">
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            borderRadius: title ? '0 0 12px 12px' : '12px',
            border: '1px solid hsl(var(--border) / 0.5)',
            background: 'hsl(var(--muted) / 0.6)',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-geist-mono), Consolas, "Courier New", monospace',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
        
        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 hover:bg-background border border-border/50 rounded-md p-2 text-xs"
          title="Copy code"
        >
          {copied ? (
            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
