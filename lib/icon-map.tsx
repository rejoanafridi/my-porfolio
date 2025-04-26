import React from "react"
import {
  Code,
  Database,
  Globe,
  Server,
  Terminal,
  Layers,
  Cloud,
  Figma,
  GitBranch,
  Zap,
  Lightbulb,
  Rocket,
  Coffee,
  CreditCard,
  BarChart,
  PieChart,
  Palette,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Heart,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import type { IconMap } from "./types"

export const iconMap: IconMap = {
  Code: <Code />,
  Database: <Database />,
  Globe: <Globe />,
  Server: <Server />,
  Terminal: <Terminal />,
  Layers: <Layers />,
  Cloud: <Cloud />,
  Figma: <Figma />,
  GitBranch: <GitBranch />,
  Zap: <Zap />,
  Lightbulb: <Lightbulb />,
  Rocket: <Rocket />,
  Coffee: <Coffee />,
  CreditCard: <CreditCard />,
  BarChart: <BarChart />,
  PieChart: <PieChart />,
  Palette: <Palette />,
  Github: <Github />,
  Linkedin: <Linkedin />,
  Twitter: <Twitter />,
  Mail: <Mail />,
  MapPin: <MapPin />,
  Send: <Send />,
  CheckCircle: <CheckCircle />,
  Heart: <Heart />,
  ArrowRight: <ArrowRight />,
  ExternalLink: <ExternalLink />,
}

export const getIconByName = (name: string, size = 24): React.ReactNode => {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`)
    return <Code size={size} />
  }

  // Clone the element with the new size prop
  return React.cloneElement(IconComponent as React.ReactElement, { size })
}
