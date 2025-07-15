import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import clsx from 'clsx'
import { Check, Copy, Hand } from 'lucide-react'

export default function ChatMessageBubble({
  msg,
  isLatestModelMessage,
  isFirstMessage,
}) {
  const [copied, setCopied] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bubbleRef = useRef(null)

  const MAX_TYPING_LENGTH = 3000

  useEffect(() => {
    if (!isLatestModelMessage || !msg?.content) {
      setDisplayedText(msg?.content || '')
      return
    }

    const content = msg.content
    if (content.length > MAX_TYPING_LENGTH) {
      setDisplayedText(content)
      setIsTyping(false)
      return
    }

    setDisplayedText('') // ✅ Reset
    setIsTyping(true)

    let index = 0
    let tempText = ''

    const interval = setInterval(() => {
      tempText += content.charAt(index) // ✅ build manually to avoid closure bugs
      setDisplayedText(tempText) // ✅ update state each tick
      index++
      if (index >= content.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [isLatestModelMessage, msg?.content])

  useEffect(() => {
    if (!isTyping) {
      bubbleRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isTyping])

  if (!msg || typeof msg.content !== 'string') return null

  const renderers = {
    code({ inline, children }) {
      const codeString = String(children).trim()

      const handleCopy = () => {
        navigator.clipboard.writeText(codeString)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }

      return inline ? (
        <code className="bg-[#222] px-1 py-0.5 rounded text-[#0FA]">
          {codeString}
        </code>
      ) : (
        <div className="relative my-2 bg-[#0d0d0d] border border-[#333] rounded-lg overflow-auto">
          <pre className="text-sm p-3 text-white font-mono whitespace-pre-wrap">
            {codeString}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs flex items-center gap-1 text-[#0FA] bg-black/40 px-2 py-1 rounded-md transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>
      )
    },
    paragraph({ children }) {
      return <p className="text-white leading-relaxed mb-2">{children}</p>
    },
  }

  return (
    <div
      ref={bubbleRef}
      className={clsx(
        'px-4 py-2 rounded-md max-w-[85%] whitespace-pre-wrap relative',
        msg.role === 'user'
          ? 'bg-[#183c3c] self-end ml-auto'
          : 'bg-[#102828] self-start'
      )}
    >
      {msg.role === 'model' && isFirstMessage && (
        <div className="flex items-center gap-2 text-[#0FA] mb-2">
          <Hand className="w-5 h-5" />
          <span className="font-semibold">Hi! I'm Herby 👩‍💻</span>
        </div>
      )}

      <ReactMarkdown
        children={displayedText + (isTyping ? '▍' : '')}
        remarkPlugins={[remarkGfm]}
        components={renderers}
      />
    </div>
  )
}
