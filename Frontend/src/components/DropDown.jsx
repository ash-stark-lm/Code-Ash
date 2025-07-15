import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Dropdown = ({ options = [], selected, setSelected, label }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative group inline-block text-left z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center px-4 py-2 text-sm text-white bg-white/10 border border-white/20 rounded hover:bg-white/20 transition cursor-pointer"
      >
        {label && <span className="mr-2">{label}</span>}
        {selected}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-[#111] border border-[#333] rounded-lg shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelected(option)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-[#222] transition cursor-pointer ${
                selected === option ? 'bg-[#222]' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
