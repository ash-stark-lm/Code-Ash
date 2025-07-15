// Ensure you keep your imports the same
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Trash2, MessageSquare } from 'lucide-react'
import clsx from 'clsx'
import axiosClient from '../utils/axiosClient'
import ChatMessageBubble from './ChatMessageBubble'
import { toast } from 'sonner'

const welcomeMessages = [
  'Welcome...',
  'Initializing AI...',
  'I am Herby, your DSA assistant 👩‍💻',
]

const CHATS_KEY = 'herby_chats'
const CURRENT_CHAT_ID_KEY = 'herby_current_chat_id'

const ChatWithAI = ({ problem }) => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(CHATS_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [currentChatId, setCurrentChatId] = useState(() => {
    const id = localStorage.getItem(CURRENT_CHAT_ID_KEY)
    return id || Date.now().toString()
  })

  const [messages, setMessages] = useState(() => {
    const current = chats.find((chat) => chat.id === currentChatId)
    return (
      current?.messages || [
        {
          role: 'model',
          parts: [
            {
              text: `Hi! I'm Herby, your AI assistant for solving DSA problems. Ask me anything about the current problem!`,
            },
          ],
        },
      ]
    )
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showCurtain, setShowCurtain] = useState(true)

  const chatEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    localStorage.setItem(CURRENT_CHAT_ID_KEY, currentChatId)
  }, [chats, currentChatId])

  useEffect(() => {
    if (messages.length > 0) {
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === currentChatId)
        const updated = {
          id: currentChatId,
          title: prev[index]?.title || `Chat ${prev.length + 1}`,
          messages,
          createdAt: prev[index]?.createdAt || Date.now(),
          updatedAt: Date.now(),
        }
        if (index >= 0) {
          const copy = [...prev]
          copy[index] = updated
          return copy
        }
        return [...prev, updated]
      })
    }
  }, [messages, currentChatId])

  useEffect(() => {
    const t1 = setTimeout(() => setShowCurtain(false), 2000)
    const t2 = setTimeout(() => setShowWelcome(false), 4500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', parts: [{ text: input.trim() }] }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      const response = await axiosClient.post('/herby/chat', {
        messages: newMsgs,
        title: problem?.title,
        description: problem?.description,
        testCases: problem?.visibleTestCases,
        starterCode: problem?.starterCode,
      })

      const aiMsg = { role: 'model', parts: [{ text: response.data.message }] }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: '⚠️ Failed to get a response from Herby.' }],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    setCurrentChatId(newId)
    setMessages([
      {
        role: 'model',
        parts: [
          {
            text: `Hi! I'm Herby, your AI assistant for solving DSA problems. Ask me anything about the current problem!`,
          },
        ],
      },
    ])
  }

  const handleSelectChat = (id) => {
    const chat = chats.find((c) => c.id === id)
    if (chat) {
      setCurrentChatId(id)
      setMessages(chat.messages)
    }
  }

  const handleDeleteChat = (id) => {
    const filtered = chats.filter((c) => c.id !== id)
    if (id === currentChatId) {
      if (filtered.length > 0) {
        setCurrentChatId(filtered[0].id)
        setMessages(filtered[0].messages)
      } else {
        handleNewChat()
      }
    }
    setChats(filtered)
  }

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Curtain Animation */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#101010]"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-64 bg-[#111] border-r border-[#0FA]/20 p-4 space-y-4 h-screen overflow-y-auto">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0FA]/10 hover:bg-[#0FA]/20 rounded-md text-[#0FA] w-full"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <div className="text-sm text-gray-300 mt-2">Previous Chats</div>
        <ul className="space-y-1 text-sm">
          {chats.length === 0 ? (
            <li className="text-white/40 italic">No chats yet</li>
          ) : (
            chats
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={clsx(
                    'flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group',
                    chat.id === currentChatId
                      ? 'bg-[#0FA]/20 border border-[#0FA]/30'
                      : 'hover:bg-[#0FA]/10'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-4 h-4 text-[#0FA]/80" />
                    <span className="truncate">
                      {chat.title ||
                        `Chat ${new Date(chat.createdAt).toLocaleTimeString()}`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toast(
                        <div className="text-sm">
                          <p>Are you sure you want to delete this chat?</p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => {
                                handleDeleteChat(chat.id)
                                toast.dismiss() // closes all toasts
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => toast.dismiss()}
                              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>,
                        {
                          duration: 10000, // stays long enough
                        }
                      )
                    }}
                    className="p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))
          )}
        </ul>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute text-center z-40 text-white font-mono"
            >
              {welcomeMessages.map((msg, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 1, duration: 0.8 }}
                  className="text-lg text-[#0FA] mb-2"
                >
                  {msg}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!showCurtain && !showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl mx-auto bg-[#0e1a1a]/60 backdrop-blur-md border border-[#0FA]/20 rounded-xl shadow-[0_0_60px_#0FA3] hover:shadow-[0_0_100px_#0FA6] transition-all duration-500 overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-[#122222] border-b border-[#0FA]/10">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="ml-4 text-sm text-white/60 tracking-wider">
                {chats.find((c) => c.id === currentChatId)?.title || 'New Chat'}
              </span>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 space-y-4 font-mono text-sm text-white leading-relaxed">
              {messages.map((msg, idx) => (
                <ChatMessageBubble
                  key={idx}
                  msg={{
                    role: msg.role,
                    content: msg.parts[0]?.text || '',
                  }}
                  isLatestModelMessage={false}
                  isFirstMessage={idx === 0 && msg.role === 'model'}
                />
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-center border-t border-[#0FA]/10 bg-[#122222] p-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 resize-none bg-transparent text-white placeholder:text-gray-400 outline-none px-2"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className={clsx(
                  'ml-2 p-2 rounded-full transition hover:bg-[#0FA]/20',
                  loading ? 'animate-spin' : ''
                )}
              >
                <Send className="w-5 h-5 text-[#0FA]" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ChatWithAI
