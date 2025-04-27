"use client"

import type React from "react"

import { useThemeVariant } from "@/contexts/theme-context"

interface ThemeVariantWrapperProps {
  children: (themeVariant: string) => React.ReactNode
}

export function ThemeVariantWrapper({ children }: ThemeVariantWrapperProps) {
  const { themeVariant } = useThemeVariant()
  return <>{children(themeVariant)}</>
}
