// src/components/HerbyShowcase.jsx
import React, { Suspense } from 'react'
import { Link } from 'react-router'
import Spline from '@splinetool/react-spline'

export default function HerbyShowcase() {
  return (
    <section className="mt-10 px-6 py-12 bg-[#0e0e0e] border border-[#1f1f1f] rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Text Section */}
      <div className="flex-1 text-white space-y-4 max-w-xl pl-5">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0FA]">
          Meet Herby 🤖
        </h2>
        <p className="text-gray-400 text-lg">
          Your personal AI assistant to explain, debug, and solve DSA problems —
          integrated directly into each challenge!
        </p>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>💡 Get approach & explanation in plain English</li>
          <li>🧠 Understand time & space complexity instantly</li>
          <li>📌 Supports all problems and languages</li>
        </ul>
        <div className="mt-10">
          <Link
            to="/problems"
            className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
          >
            Try Herby Now
          </Link>
        </div>
      </div>

      {/* Right Spline Robot Animation */}
      <div className="flex-1 w-full h-[300px] md:h-[350px] overflow-hidden rounded-lg relative">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-[#0FA]">
                <svg
                  className="animate-spin h-8 w-8 text-[#0FA]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <p className="text-sm font-medium animate-pulse">
                  Loading Herby...
                </p>
              </div>
            </div>
          }
        >
          <div className="absolute top-0 left-0 w-[120%] h-[120%] transform scale-[1.1] -translate-x-10 -translate-y-1 pointer-events-auto">
            <Spline scene="https://prod.spline.design/XcvMBtDVfLe0kPWa/scene.splinecode" />
          </div>
        </Suspense>
      </div>
    </section>
  )
}
