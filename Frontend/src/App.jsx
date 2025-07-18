// App.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'

import LoadingOverlay from './components/LoadingOverlay'
import AnimatedRoutes from './Routes/AnimatedRoutes'
import { checkAuth } from './authSlice'

export default function App() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const location = useLocation()

  // 🔄 Auth Check
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // 💨 Lenis Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  // 🔁 Reset scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (loading) return <LoadingOverlay />

  return (
    <div className="scroll-smooth antialiased bg-[#0e0e0e] text-white">
      <AnimatedRoutes />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#111',
            color: '#0FA',
            border: '1px solid #0FA',
          },
        }}
      />
    </div>
  )
}
