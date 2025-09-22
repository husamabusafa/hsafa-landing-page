import React, { type ReactNode } from 'react'
import { CodeBlock } from '@/app/docs/_components/code-block'

type MDXComponents = {
  [key: string]: (props: any) => React.ReactElement
}
 
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-3xl font-bold tracking-tight mb-4">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">{children}</h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-base leading-7 mb-4 text-foreground/90">{children}</p>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="text-base leading-7 text-foreground/90">{children}</li>
    ),
    code: ({ children, className }: { children?: ReactNode; className?: string }) => {
      // If it's inside a pre (code block), don't add inline styling
      if (className?.includes('language-')) {
        return <code className={className}>{children}</code>
      }
      // Inline code
      return (
        <code className="bg-muted/80 px-1.5 py-0.5 rounded-md text-sm font-mono border border-border/50">
          {children}
        </code>
      )
    },
    pre: ({ children }: { children?: ReactNode }) => {
      // Extract the code element and its props
      const codeElement = React.Children.only(children) as React.ReactElement<{
        children: string;
        className?: string;
      }>;
      const { children: code, className } = codeElement.props;
      
      return (
        <CodeBlock className={className}>
          {code}
        </CodeBlock>
      );
    },
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 border-blue-500/50 bg-muted/30 pl-4 py-2 italic text-muted-foreground mb-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    ...components,
  }
}
