import React, { useEffect, useState } from 'react'
import Dropdown from '../components/DropDown'

const languageSnippets = {
  cpp: [
    { text: '#include ', color: 'text-green-400' },
    { text: '<vector>\n', color: 'text-cyan-400' },
    { text: '#include ', color: 'text-green-400' },
    { text: '<unordered_map>\n\n', color: 'text-cyan-400' },
    { text: 'class ', color: 'text-yellow-400' },
    { text: 'Solution ', color: 'text-white' },
    { text: '{\npublic:\n', color: 'text-white' },
    { text: '    std::vector<int> ', color: 'text-cyan-400' },
    { text: 'twoSum', color: 'text-white' },
    { text: '(std::vector<int>& nums, int target) {\n', color: 'text-white' },
    { text: '        std::unordered_map<int, int> ', color: 'text-cyan-400' },
    { text: 'hashmap;\n', color: 'text-white' },
    { text: '        for ', color: 'text-yellow-400' },
    { text: '(int i = 0; i < nums.size(); i++) {\n', color: 'text-white' },
    {
      text: '            int complement = target - nums[i];\n',
      color: 'text-white',
    },
    { text: '            if ', color: 'text-yellow-400' },
    {
      text: '(hashmap.find(complement) != hashmap.end()) {\n',
      color: 'text-white',
    },
    {
      text: '                return {hashmap[complement], i};\n',
      color: 'text-white',
    },
    { text: '            }\n', color: 'text-white' },
    { text: '            hashmap[nums[i]] = i;\n', color: 'text-white' },
    { text: '        }\n', color: 'text-white' },
    { text: '        return {};\n', color: 'text-white' },
    { text: '    }\n', color: 'text-white' },
    { text: '};\n', color: 'text-white' },
  ],
  python: [
    { text: '# Two Sum Problem\n', color: 'text-green-400' },
    { text: 'def ', color: 'text-yellow-400' },
    { text: 'twoSum', color: 'text-cyan-400' },
    { text: '(nums, target):\n', color: 'text-white' },
    { text: '    hashmap = {}\n', color: 'text-white' },
    { text: '    for ', color: 'text-yellow-400' },
    { text: 'i, num ', color: 'text-white' },
    { text: 'in ', color: 'text-yellow-400' },
    { text: 'enumerate(nums):\n', color: 'text-cyan-400' },
    { text: '        complement = target - num\n', color: 'text-white' },
    { text: '        if ', color: 'text-yellow-400' },
    { text: 'complement in hashmap:\n', color: 'text-white' },
    {
      text: '            return [hashmap[complement], i]\n',
      color: 'text-white',
    },
    { text: '        hashmap[num] = i\n', color: 'text-white' },
  ],
  java: [
    { text: 'import java.util.*;\n\n', color: 'text-cyan-400' },
    { text: 'class ', color: 'text-yellow-400' },
    { text: 'Solution {\n', color: 'text-white' },
    { text: '    public int[] ', color: 'text-cyan-400' },
    { text: 'twoSum', color: 'text-white' },
    { text: '(int[] nums, int target) {\n', color: 'text-white' },
    {
      text: '        Map<Integer, Integer> hashmap = new HashMap<>();\n',
      color: 'text-white',
    },
    { text: '        for ', color: 'text-yellow-400' },
    { text: '(int i = 0; i < nums.length; i++) {\n', color: 'text-white' },
    {
      text: '            int complement = target - nums[i];\n',
      color: 'text-white',
    },
    { text: '            if ', color: 'text-yellow-400' },
    { text: '(hashmap.containsKey(complement)) {\n', color: 'text-white' },
    {
      text: '                return new int[]{hashmap.get(complement), i};\n',
      color: 'text-white',
    },
    { text: '            }\n', color: 'text-white' },
    { text: '            hashmap.put(nums[i], i);\n', color: 'text-white' },
    {
      text: '        }\n        return new int[]{};\n    }\n}\n',
      color: 'text-white',
    },
  ],
}

const flatten = (segments) => {
  const chars = []
  segments.forEach((seg) => {
    for (let ch of seg.text) {
      chars.push({ char: ch, color: seg.color })
    }
  })
  return chars
}

const languageMap = {
  'C++': 'cpp',
  Java: 'java',
  Python: 'python',
}

export default function TypingCodeBlock({ lang, setLang }) {
  const [visible, setVisible] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const flat = flatten(languageSnippets[lang])

  useEffect(() => {
    if (isDeleting) {
      const eraseTimeout = setTimeout(() => {
        setVisible(0)
        setIsDeleting(false)

        setLang((prev) => {
          if (prev === 'cpp') return 'python'
          if (prev === 'python') return 'java'
          return 'cpp'
        })
      }, 300)
      return () => clearTimeout(eraseTimeout)
    }

    if (visible === flat.length) {
      const holdTimeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(holdTimeout)
    }

    const typeTimeout = setTimeout(() => {
      setVisible((prev) => prev + 1)
    }, 15)

    return () => clearTimeout(typeTimeout)
  }, [visible, isDeleting, flat])

  useEffect(() => {
    setVisible(0)
    setIsDeleting(false)
  }, [lang])

  return (
    <div
      className="bg-gradient-to-br from-[#0FA]/10 to-black p-6 rounded-xl border border-[#0FA]/20 shadow-xl backdrop-blur-lg transition duration-300 ease-in-out hover:shadow-[0_0_60px_#0FA] ml-4"
      style={{
        width: 620,
        height: 550,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Three dots bar */}
      <div className="flex space-x-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {/* Dropdown with mapped display */}
      <div className="flex justify-end mb-4 to-black">
        <Dropdown
          label=""
          options={['C++', 'Java', 'Python']}
          selected={Object.keys(languageMap).find(
            (key) => languageMap[key] === lang
          )}
          setSelected={(val) => setLang(languageMap[val])}
        />
      </div>

      {/* Animated Code Display */}
      <pre
        className="text-sm font-mono text-white leading-relaxed overflow-auto custom-scrollbar"
        style={{
          width: '600px',
          height: '340px',
          whiteSpace: 'pre-wrap',
          margin: 0,
          flexGrow: 1,
        }}
      >
        {flat.slice(0, visible).map((c, i) => (
          <span key={i} className={c.color}>
            {c.char}
          </span>
        ))}
        <span className="text-white animate-pulse">|</span>
      </pre>
    </div>
  )
}
