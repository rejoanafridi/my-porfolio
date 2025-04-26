import type React from "react"
import { ExternalLink, Code, Server, Database, Globe } from "lucide-react"

export type Project = {
  id: string
  title: string
  description: string
  image: string
  techStack: {
    name: string
    icon: React.ReactNode
  }[]
  demoLink: string
  githubLink: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: "ecommerce",
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with product listings, cart functionality, and payment processing.",
    image: "/placeholder.svg?height=200&width=400",
    techStack: [
      { name: "React", icon: <Code size={14} /> },
      { name: "Node.js", icon: <Server size={14} /> },
      { name: "MongoDB", icon: <Database size={14} /> },
      { name: "Stripe", icon: <ExternalLink size={14} /> },
    ],
    demoLink: "https://example.com",
    githubLink: "https://github.com",
    featured: true,
  },
  {
    id: "task-manager",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team workspaces.",
    image: "/placeholder.svg?height=200&width=400",
    techStack: [
      { name: "Next.js", icon: <Globe size={14} /> },
      { name: "TypeScript", icon: <Code size={14} /> },
      { name: "Prisma", icon: <Database size={14} /> },
      { name: "PostgreSQL", icon: <Database size={14} /> },
    ],
    demoLink: "https://example.com",
    githubLink: "https://github.com",
    featured: true,
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description: "A weather dashboard that displays current conditions and forecasts for multiple locations.",
    image: "/placeholder.svg?height=200&width=400",
    techStack: [
      { name: "React", icon: <Code size={14} /> },
      { name: "Redux", icon: <Code size={14} /> },
      { name: "Weather API", icon: <Globe size={14} /> },
      { name: "Chart.js", icon: <ExternalLink size={14} /> },
    ],
    demoLink: "https://example.com",
    githubLink: "https://github.com",
    featured: true,
  },
  {
    id: "finance-tracker",
    title: "Personal Finance Tracker",
    description: "An application to track expenses, income, and financial goals with visualization tools.",
    image: "/placeholder.svg?height=200&width=400",
    techStack: [
      { name: "Vue.js", icon: <Code size={14} /> },
      { name: "Firebase", icon: <Database size={14} /> },
      { name: "D3.js", icon: <ExternalLink size={14} /> },
      { name: "Tailwind CSS", icon: <Code size={14} /> },
    ],
    demoLink: "https://example.com",
    githubLink: "https://github.com",
    featured: true,
  },
]
