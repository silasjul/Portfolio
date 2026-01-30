import React from "react";

export default function MarkdownParser(text: string): React.ReactNode[] {
  let key = 0;

  // Process inline formatting within a line
  const processInline = (str: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match: **bold**, `code` - we'll handle these with regex
    // Bold must have ** on both sides, code must have ` on both sides
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        nodes.push(str.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold **text**
        nodes.push(<strong key={`b-${key++}`}>{match[2]}</strong>);
      } else if (match[3]) {
        // Inline code `text`
        nodes.push(
          <code key={`c-${key++}`} className="bg-black/10 px-1.5 py-0.5 rounded text-sm font-mono">
            {match[3]}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < str.length) {
      nodes.push(str.slice(lastIndex));
    }

    return nodes.length > 0 ? nodes : [str];
  };

  // Process a single line and return appropriate element
  const processLine = (line: string, idx: number): React.ReactNode => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      return <br key={`br-${key++}`} />;
    }

    // Heading: # ## ###
    if (trimmed.startsWith('### ')) {
      return <h4 key={`h4-${key++}`} className="font-semibold text-base mt-3 mb-1">{processInline(trimmed.slice(4))}</h4>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={`h3-${key++}`} className="font-semibold text-lg mt-4 mb-1">{processInline(trimmed.slice(3))}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={`h2-${key++}`} className="font-bold text-xl mt-4 mb-2">{processInline(trimmed.slice(2))}</h2>;
    }

    // Horizontal rule: --- or ***
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      return <hr key={`hr-${key++}`} className="my-4 border-black/20" />;
    }

    // Bullet point: * or - at start of line (not italic)
    if (/^[\*\-]\s/.test(trimmed)) {
      return (
        <div key={`li-${key++}`} className="flex gap-2 ml-2">
          <span className="text-black text-lg leading-none mt-0.5">•</span>
          <span>{processInline(trimmed.slice(2))}</span>
        </div>
      );
    }

    // Numbered list: 1. 2. etc
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <div key={`ol-${key++}`} className="flex gap-2 ml-2">
          <span className="text-[#0077cc] min-w-[1.5em]">{numberedMatch[1]}.</span>
          <span>{processInline(numberedMatch[2])}</span>
        </div>
      );
    }

    // Regular paragraph
    return <p key={`p-${key++}`} className="mb-1">{processInline(line)}</p>;
  };

  // First, extract and handle code blocks
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const segments: { type: 'text' | 'code'; content: string; language?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', content: match[2].trim(), language: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  // Process each segment
  const result: React.ReactNode[] = [];

  for (const segment of segments) {
    if (segment.type === 'code') {
      result.push(
        <pre key={`code-${key++}`} className="bg-black/10 rounded-lg p-4 my-3 overflow-x-auto">
          <code className="text-sm font-mono whitespace-pre">{segment.content}</code>
        </pre>
      );
    } else {
      // Split text into lines and process each
      const lines = segment.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        result.push(processLine(lines[i], i));
      }
    }
  }

  return result;
}