import { useEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue, animate } from 'framer-motion'

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0)
  const controls = useAnimation()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v)),
    })
    return () => animation.stop()
  }, [value])

  return <span>{display}</span>
}

const StreakCard = ({ streak, maxStreak }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-6 rounded-2xl border border-[#2e2e2e] shadow-lg relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`font-semibold text-sm uppercase tracking-wide ${
            streak > 0 ? 'text-[#0FA] animate-pulse' : 'text-[#666]'
          }`}
        >
          🔥 Current Streak
        </div>
        {streak > 0 && (
          <span className="text-xs text-[#22c55e] bg-[#1c1c1c] px-3 py-0.5 rounded-full border border-[#2e2e2e] shadow-md">
            On Fire!
          </span>
        )}
      </div>

      <div className="text-5xl font-extrabold mb-2 text-white">
        <AnimatedNumber value={streak} />{' '}
        <span className="text-base font-medium text-[#aaa]">days</span>
      </div>

      <div className="text-sm text-[#aaa] mb-4">
        Max Streak: <span className="text-white">{maxStreak}</span> days
      </div>

      <div className="w-full h-4 bg-[#222] rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-[#0FA] rounded-full"
          initial={{ width: 0 }}
          animate={{
            width:
              maxStreak > 0
                ? `${Math.min((streak / maxStreak) * 100, 100)}%`
                : '0%',
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 10px #0FA, 0 0 20px #0FA',
          }}
        />
      </div>

      <div className="mt-4 text-sm italic text-[#888] text-center">
        {streak === 0
          ? 'Solve today to start a new streak 🔁'
          : streak < 3
          ? 'Let’s build a streak!'
          : streak < 7
          ? 'Solid effort! Keep going 💪'
          : streak < 15
          ? 'You’re crushing it 🚀'
          : '🔥 You’re unstoppable!'}
      </div>
    </motion.div>
  )
}

export default StreakCard
