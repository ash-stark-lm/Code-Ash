// components/QuantumGlow.jsx
import React, { useEffect, useRef } from 'react'

const GridGlow = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * 100,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.dx
        node.y += node.dy

        if (node.x < 0 || node.x > canvas.width) node.dx *= -1
        if (node.y < 0 || node.y > canvas.height) node.dy *= -1

        node.pulse += 0.05

        ctx.beginPath()
        const glow = 0.5 + Math.sin(node.pulse) * 0.5
        ctx.shadowBlur = 20
        ctx.shadowColor = `rgba(15, 250, 170, ${glow})`
        ctx.fillStyle = `rgba(15, 250, 170, ${glow})`
        ctx.arc(node.x, node.y, node.r + glow * 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.2 }}
    />
  )
}

export default GridGlow
