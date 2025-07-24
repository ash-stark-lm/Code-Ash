import React, { useState, useEffect } from 'react'
import axiosClient from '../utils/axiosClient'
import { useParams } from 'react-router'

import ReplyBox from './ReplyBox'
import { ThumbsUp, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import { renderContentWithCode } from './RenderContentWithCode'

export default function Editorial() {
  const { id } = useParams()
  const [editorials, setEditorials] = useState([])
  const [explanation, setExplanation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openReplies, setOpenReplies] = useState({})

  useEffect(() => {
    fetchEditorials()
  }, [id])

  const fetchEditorials = async () => {
    try {
      const res = await axiosClient.get(`/editorial/${id}`)
      setEditorials(res.data)
    } catch (err) {
      console.error('Error loading editorials:', err)
    }
  }

  const handleSubmit = async () => {
    if (!explanation.trim()) return
    try {
      setIsSubmitting(true)
      await axiosClient.post(`/editorial/${id}`, { content: explanation })
      setExplanation('')
      fetchEditorials()
    } catch (err) {
      console.error('Error submitting editorial:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplySubmit = async (editorialId, replyText) => {
    if (!replyText?.trim()) return
    try {
      await axiosClient.post(`/editorial/reply/${editorialId}`, {
        content: replyText,
      })
      fetchEditorials()
    } catch (err) {
      console.error('Reply failed:', err)
    }
  }

  const toggleUpvote = async (editorialId) => {
    try {
      const res = await axiosClient.post(`/editorial/upvote/${editorialId}`)
      const updated = res.data

      setEditorials((prev) =>
        prev.map((e) =>
          e._id === editorialId
            ? {
                ...e,
                upvotes: updated.upvoted
                  ? [...e.upvotes, updated.userId]
                  : e.upvotes.filter((id) => id !== updated.userId),
              }
            : e
        )
      )
    } catch (err) {
      console.error('Upvote failed:', err)
    }
  }

  const toggleRepliesView = (editorialId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [editorialId]: !prev[editorialId],
    }))
  }

  const applyMarkdown = (syntax) => {
    const textarea = document.getElementById('editorial-explanation')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = explanation.slice(start, end)

    let newText
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`
        break
      case 'italic':
        newText = `_${selectedText || 'italic text'}_`
        break
      case 'inline-code':
        newText = `\`${selectedText || 'code'}\``
        break
      case 'code-block':
        newText = `\`\`\`\n${selectedText || 'your code here'}\n\`\`\``
        break
      default:
        return
    }

    const before = explanation.slice(0, start)
    const after = explanation.slice(end)
    const updatedValue = `${before}${newText}${after}`
    setExplanation(updatedValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        before.length + newText.length,
        before.length + newText.length
      )
    }, 0)
  }

  return (
    <div className="flex w-full min-h-screen text-white">
      {/* LEFT SIDE - WRITE POST */}
      <div className="w-1/2 p-8 border-r border-[#333] space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => applyMarkdown('bold')}
            className="px-2 py-1 border border-gray-500 text-sm rounded hover:bg-gray-700"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => applyMarkdown('italic')}
            className="px-2 py-1 border border-gray-500 text-sm rounded hover:bg-gray-700"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => applyMarkdown('inline-code')}
            className="px-2 py-1 border border-gray-500 text-sm rounded hover:bg-gray-700"
          >
            {'<>'}
          </button>
          <button
            onClick={() => applyMarkdown('code-block')}
            className="px-2 py-1 border border-gray-500 text-sm rounded hover:bg-gray-700"
          >
            Code Block
          </button>
        </div>

        <textarea
          id="editorial-explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full bg-[#1F2123] border border-[#333] p-4 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0FA]"
          placeholder="Write your explanation here. Use the buttons above to format code and text."
          rows={14}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#0FA] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#0FA]/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Post'}
        </button>
      </div>

      {/* RIGHT SIDE - VIEW POSTS */}
      <div className="w-1/2 p-8 space-y-6 overflow-y-auto">
        {editorials.length === 0 ? (
          <p className="text-gray-400 italic text-center">No posts yet.</p>
        ) : (
          editorials.map((e) => {
            const hasUpvoted = e.upvotes.includes(e?.currentUserId)

            return (
              <div
                key={e._id}
                className="bg-[#1f1f1f] border border-[#333] p-5 rounded-xl shadow-lg transition hover:border-[#0FA]/40"
              >
                <div className="text-base leading-relaxed">
                  {e.content ? (
                    renderContentWithCode(e.content)
                  ) : (
                    <p className="text-gray-400 italic">No content</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Posted by {e.author?.firstName ?? 'Anonymous'}
                </p>

                <div className="flex items-center space-x-6 mt-3 text-sm">
                  <button
                    onClick={() => toggleUpvote(e._id)}
                    className="flex items-center gap-1 text-gray-300 hover:text-[#0FA] transition cursor-pointer"
                  >
                    <ThumbsUp
                      size={18}
                      className={hasUpvoted ? 'fill-[#0FA] text-[#0FA]' : ''}
                    />
                    <span>{e.upvotes.length}</span>
                  </button>

                  <button
                    onClick={() => toggleRepliesView(e._id)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    {openReplies[e._id] ? (
                      <>
                        <ChevronUp size={18} /> Hide Replies
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} /> View Replies (
                        {e.replies?.length || 0})
                      </>
                    )}
                  </button>
                </div>

                {openReplies[e._id] && (
                  <div className="mt-4 pl-4 border-l-2 border-[#333] space-y-4">
                    {e.replies?.map((r) => (
                      <div
                        key={r._id}
                        className="bg-[#2a2a2a] p-3 rounded-lg shadow-sm"
                      >
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">
                          {r.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 italic">
                          – {r.author?.firstName ?? 'Anonymous'}
                        </p>
                      </div>
                    ))}

                    <ReplyBox
                      onReply={(replyText) =>
                        handleReplySubmit(e._id, replyText)
                      }
                    />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
