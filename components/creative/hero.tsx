"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { HeroSection } from "@/lib/types"
import { useEffect, useState } from "react"

interface CreativeHeroProps {
  data: HeroSection
}

const CreativeHero = ({ data }: CreativeHeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-amber-500/20 via-transparent to-transparent"
          style={{
            transform: `translate(${(mousePosition.x / window.innerWidth - 0.5) * -20}px, ${
              (mousePosition.y / window.innerHeight - 0.5) * -20
            }px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent"
          style={{
            transform: `translate(${(mousePosition.x / window.innerWidth - 0.5) * 20}px, ${
              (mousePosition.y / window.innerHeight - 0.5) * 20
            }px)`,
          }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                {data.title}
              </span>
            </motion.div>

            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              {data.name.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ color: `hsl(${index * 10}, 80%, 60%)` }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl font-semibold mb-6 text-amber-300"
            >
              {data.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-gray-300 mb-8 max-w-lg"
            >
              {data.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white border-0"
              >
                {data.ctaText}
              </Button>
              <Button variant="outline" size="lg" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
                {data.secondaryCtaText}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-red-500 rounded-full blur opacity-75"></div>
              <div className="relative bg-black rounded-full p-8">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  <path
                    fill="#FF5733"
                    d="M40.8,-68.3C54.7,-62.5,69,-54.3,76.8,-41.6C84.6,-28.9,85.9,-11.7,83.8,4.3C81.7,20.4,76.2,35.3,66.6,46.5C57,57.7,43.3,65.2,29.1,70.2C14.9,75.2,0.2,77.7,-15.6,76.3C-31.4,74.9,-48.3,69.5,-60.1,58.5C-71.9,47.5,-78.6,30.8,-81.5,13.3C-84.4,-4.2,-83.5,-22.6,-76.3,-37.8C-69.1,-53,-55.6,-65,-41.2,-70.8C-26.8,-76.6,-11.4,-76.2,1.9,-79.3C15.2,-82.4,26.9,-74.1,40.8,-68.3Z"
                    transform="translate(100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="text-amber-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CreativeHero
