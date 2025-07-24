// utils/renderContentWithCode.js
import React from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function renderContentWithCode(content) {
  if (!content || typeof content !== 'string') {
    return <p className="text-sm text-gray-400 italic">No content provided.</p>
  }

  const regex = /```(\w+)?\n([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, language = 'javascript', code] = match
    const index = match.index

    if (index > lastIndex) {
      const textBefore = content.slice(lastIndex, index)
      parts.push(
        <ReactMarkdown
          key={lastIndex}
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {textBefore}
        </ReactMarkdown>
      )
    }

    parts.push(
      <div key={index + '_code'} className="my-4">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{ borderRadius: '10px', fontSize: '0.85rem' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )

    lastIndex = regex.lastIndex
  }

  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex)
    parts.push(
      <ReactMarkdown
        key={lastIndex + '_tail'}
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {remaining}
      </ReactMarkdown>
    )
  }

  return parts
}

const markdownComponents = {
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
  code({ node, inline, className, children, ...props }) {
    return inline ? (
      <code
        className="bg-[#2a2a2a] px-1 py-[2px] rounded text-sm text-[#0FA]"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code {...props}>{children}</code>
    )
  },
  p: ({ children }) => <p className="text-sm text-gray-200 mb-2">{children}</p>,
}
