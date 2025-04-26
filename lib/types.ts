import type { ReactNode } from 'react'

export interface HeroSection {
    id: string
    title: string
    name: string
    subtitle: string
    description: string
    ctaText: string
    resumeBtnText: string
    resumeLink: string
    secondaryCtaText: string
}

export interface AboutSection {
    id: string
    title: string
    subtitle: string
    description: string[]
    image: string
    traits: {
        icon: string
        text: string
    }[]
}

export interface Skill {
    id: string
    name: string
    icon: string
    color: string
}

export interface SkillsSection {
    id: string
    title: string
    subtitle: string
    skills: Skill[]
}

export interface Project {
    id: string
    title: string
    description: string
    image: string
    techStack: {
        name: string
        icon: string
    }[]
    demoLink: string
    githubLink: string
    featured: boolean
}

export interface ProjectsSection {
    id: string
    title: string
    subtitle: string
    projects: Project[]
}

export interface ContactSection {
    id: string
    title: string
    subtitle: string
    email: string
    location: string
    socials: {
        platform: string
        url: string
        icon: string
    }[]
}

export interface SiteConfig {
    siteName: string
    siteDescription: string
    hero: HeroSection
    about: AboutSection
    skills: SkillsSection
    projects: ProjectsSection
    contact: ContactSection
}

export interface User {
    id: string
    username: string
    password: string
    name: string
    role: 'admin' | 'editor'
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface IconMap {
    [key: string]: ReactNode
}
