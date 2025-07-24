import React, { useState } from 'react'
import { Send } from 'lucide-react'

export default function ReplyBox({ onReply }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReply = async () => {
    if (!text.trim()) return
    setLoading(true)
    await onReply(text)
    setText('')
    setLoading(false)
  }

  return (
    <div className="mt-3 bg-[#1b1b1b] border border-[#333] rounded-lg p-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full bg-[#121212] border border-[#2e2e2e] p-2 rounded-md text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#0FA]"
        placeholder="Write your reply here..."
      />
      <button
        onClick={handleReply}
        disabled={loading}
        className="mt-2 bg-[#0FA] text-black font-medium px-4 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-[#0fa]/90 disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? 'Replying...' : 'Reply'}
      </button>
    </div>
  )
}
