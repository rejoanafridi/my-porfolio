"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import { motion } from "framer-motion"

const MinimalNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const sections = ["hero", "about", "skills", "projects", "contact"]
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Link
            href="/"
            className="text-xl font-serif tracking-tight hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <span className="text-neutral-800 dark:text-neutral-200">Portfolio</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center space-x-8"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "text-neutral-800 dark:text-neutral-200"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="minimalActiveSection"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-800 dark:bg-neutral-200"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          ))}
          <div className="ml-2">
            <ModeToggle />
          </div>
        </motion.nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ModeToggle />
          <button
            onClick={() => document.getElementById("minimal-mobile-menu")?.classList.toggle("hidden")}
            className="ml-4 p-2 text-neutral-800 dark:text-neutral-200"
            aria-label="Toggle menu"
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
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="minimal-mobile-menu" className="hidden md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id)
                document.getElementById("minimal-mobile-menu")?.classList.add("hidden")
              }}
              className={`py-2 text-sm font-medium ${
                activeSection === item.id
                  ? "text-neutral-800 dark:text-neutral-200"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default MinimalNavbar
