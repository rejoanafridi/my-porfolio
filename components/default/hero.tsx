"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowDown, Sparkles, FileText, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import type { HeroSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"
import { useThemeVariant } from "@/contexts/theme-context"
import useClient from "@/hooks/use-client"

interface HeroProps {
  data: HeroSection
}

const Hero = ({ data }: HeroProps) => {
  const isClient = useClient()
  const { themeVariant } = useThemeVariant()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    if (!isClient) return

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [isClient])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 0.5,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      opacity: 0.1,
      backgroundColor: "var(--primary)",
      mixBlendMode: "difference",
    },
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Get name gradient based on theme variant
  const getNameGradient = () => {
    switch (themeVariant) {
      case "minimal":
        return "from-slate-900 to-slate-700 dark:from-white dark:to-slate-300"
      case "creative":
        return "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500"
      default:
        return "from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400"
    }
  }

  // Get button styles based on theme variant
  const getPrimaryButtonStyles = () => {
    switch (themeVariant) {
      case "minimal":
        return "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900"
      case "creative":
        return "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
      default:
        return "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
    }
  }

  const getSecondaryButtonStyles = () => {
    switch (themeVariant) {
      case "minimal":
        return "border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800/50"
      case "creative":
        return "border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/20"
      default:
        return "border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-900/20"
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Custom cursor effect - only show on client */}
      {isClient && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full bg-primary z-50 pointer-events-none hidden md:block"
          variants={variants}
          animate={cursorVariant}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      )}

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 z-0" />

      {/* Animated background elements - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>
      )}

      <div className="container px-4 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <div className="flex flex-wrap items-center justify-center mb-4 gap-2">
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full flex items-center">
                {getIconByName(data.title.split(" ")[0], 14)}
                <span className="ml-1">{data.title}</span>
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full flex items-center">
                <Sparkles size={14} className="mr-1" />
                <span>Problem Solver</span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <span className={`bg-gradient-to-r ${getNameGradient()} bg-clip-text text-transparent drop-shadow-sm`}>
              {data.name}
            </span>
          </motion.h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6"
          >
            {data.subtitle}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
          >
            <Button size="lg" onClick={scrollToContact} className={`rounded-full px-8 ${getPrimaryButtonStyles()}`}>
              {data.ctaText}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToProjects}
              className={`rounded-full px-8 ${getSecondaryButtonStyles()}`}
            >
              {data.secondaryCtaText}
            </Button>

            {data.resumeLink && (
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full px-8 ${getSecondaryButtonStyles()} group`}
                onClick={() => window.open(data.resumeLink, "_blank", "noopener,noreferrer")}
              >
                <FileText size={16} className="mr-2" />
                <span>{data.resumeButtonText || "Resume"}</span>
                <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </motion.div>
        </motion.div>

        {isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <ArrowDown size={24} className="text-foreground/50" />
            </motion.div>
            <span className="text-xs text-foreground/50 mt-2">Scroll to explore</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Hero
