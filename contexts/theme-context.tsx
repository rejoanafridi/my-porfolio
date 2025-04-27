"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"
import useClient from "@/hooks/use-client"

type ThemeVariant = "default" | "minimal" | "creative"

interface ThemeContextType {
  themeVariant: ThemeVariant
  setThemeVariant: (theme: ThemeVariant) => void
  applyThemeColors: (variant: ThemeVariant) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme color configurations
const themeColors = {
  default: {
    light: {
      primary: "hsl(262.1 83.3% 57.8%)",
      primaryForeground: "hsl(210 20% 98%)",
      secondary: "hsl(240 4.8% 95.9%)",
      secondaryForeground: "hsl(240 5.9% 10%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(240 10% 3.9%)",
    },
    dark: {
      primary: "hsl(263.4 70% 50.4%)",
      primaryForeground: "hsl(210 20% 98%)",
      secondary: "hsl(240 3.7% 15.9%)",
      secondaryForeground: "hsl(0 0% 98%)",
      background: "hsl(240 10% 3.9%)",
      foreground: "hsl(0 0% 98%)",
    },
  },
  minimal: {
    light: {
      primary: "hsl(220 14% 30%)",
      primaryForeground: "hsl(0 0% 100%)",
      secondary: "hsl(220 14% 95%)",
      secondaryForeground: "hsl(220 14% 30%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 14% 10%)",
    },
    dark: {
      primary: "hsl(220 14% 80%)",
      primaryForeground: "hsl(220 14% 10%)",
      secondary: "hsl(220 14% 15%)",
      secondaryForeground: "hsl(220 14% 80%)",
      background: "hsl(220 14% 10%)",
      foreground: "hsl(220 14% 95%)",
    },
  },
  creative: {
    light: {
      primary: "hsl(35 92% 50%)",
      primaryForeground: "hsl(0 0% 100%)",
      secondary: "hsl(35 92% 95%)",
      secondaryForeground: "hsl(35 92% 20%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(35 10% 10%)",
    },
    dark: {
      primary: "hsl(35 92% 50%)",
      primaryForeground: "hsl(0 0% 10%)",
      secondary: "hsl(35 50% 15%)",
      secondaryForeground: "hsl(35 92% 90%)",
      background: "hsl(0 0% 10%)",
      foreground: "hsl(35 10% 95%)",
    },
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isClient = useClient()
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>("default")
  const { theme: nextTheme } = useNextTheme()
  const isDark = nextTheme === "dark"

  // Apply theme colors to CSS variables
  const applyThemeColors = (variant: ThemeVariant) => {
    if (!isClient) return

    const colors = isDark ? themeColors[variant].dark : themeColors[variant].light

    // Apply colors to CSS variables
    document.documentElement.style.setProperty("--primary", colors.primary)
    document.documentElement.style.setProperty("--primary-foreground", colors.primaryForeground)
    document.documentElement.style.setProperty("--secondary", colors.secondary)
    document.documentElement.style.setProperty("--secondary-foreground", colors.secondaryForeground)
    document.documentElement.style.setProperty("--background", colors.background)
    document.documentElement.style.setProperty("--foreground", colors.foreground)
  }

  // Load theme from localStorage on client side
  useEffect(() => {
    if (!isClient) return

    const savedTheme = localStorage.getItem("themeVariant") as ThemeVariant | null
    if (savedTheme && ["default", "minimal", "creative"].includes(savedTheme)) {
      setThemeVariant(savedTheme)
    }
  }, [isClient])

  // Apply theme colors when theme variant or light/dark mode changes
  useEffect(() => {
    if (isClient) {
      applyThemeColors(themeVariant)
    }
  }, [themeVariant, nextTheme, isClient])

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("themeVariant", themeVariant)
    }
  }, [themeVariant, isClient])

  return (
    <ThemeContext.Provider value={{ themeVariant, setThemeVariant, applyThemeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeVariant() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeVariant must be used within a ThemeProvider")
  }
  return context
}
