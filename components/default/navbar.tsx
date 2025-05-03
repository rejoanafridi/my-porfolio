'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ModeToggle } from '../mode-toggle'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeVariant } from '@/contexts/theme-context'
import useClient from '@/hooks/use-client'

const Navbar = ({ siteConfig }: any) => {
    const isClient = useClient()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    const { themeVariant } = useThemeVariant()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)

            // Determine active section based on scroll position
            const sections = ['hero', 'about', 'skills', 'projects', 'contact']
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

        if (isClient) {
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [isClient])

    const scrollToSection = (sectionId: string) => {
        setIsMenuOpen(false)
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const navItems = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' }
    ]

    // Get logo styles based on theme variant
    const getLogoStyles = () => {
        switch (themeVariant) {
            case 'minimal':
                return 'text-slate-900 dark:text-white font-serif'
            case 'creative':
                return 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent font-bold'
            default:
                return 'bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-bold'
        }
    }

    // Get active nav item styles based on theme variant
    const getActiveNavStyles = () => {
        switch (themeVariant) {
            case 'minimal':
                return 'text-slate-900 dark:text-white font-medium'
            case 'creative':
                return 'text-amber-600 dark:text-amber-400 font-medium'
            default:
                return 'text-violet-600 dark:text-violet-400 font-medium'
        }
    }

    // Get hover styles for nav items
    const getNavHoverStyles = () => {
        switch (themeVariant) {
            case 'minimal':
                return 'hover:text-slate-900 dark:hover:text-white'
            case 'creative':
                return 'hover:text-amber-600 dark:hover:text-amber-400'
            default:
                return 'hover:text-violet-600 dark:hover:text-violet-400'
        }
    }


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-background/90 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className={`text-xl tracking-tight hover:opacity-80 transition-colors ${getLogoStyles()}`}
                    >
                        {siteConfig?.config?.siteName || "Portfolio"}
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex items-center space-x-1"
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`relative px-4 py-2 text-sm rounded-full transition-colors ${
                                activeSection === item.id
                                    ? getActiveNavStyles()
                                    : `text-foreground/70 ${getNavHoverStyles()}`
                            }`}
                        >
                            {activeSection === item.id && (
                                <motion.span
                                    layoutId="activeSection"
                                    className="absolute inset-0 bg-primary/10 rounded-full"
                                    transition={{
                                        type: 'spring',
                                        duration: 0.6
                                    }}
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    ))}
                    <div className="ml-2">
                        <ModeToggle />
                    </div>
                </motion.nav>

                {/* Mobile Navigation Toggle */}
                <div className="flex items-center md:hidden">
                    <ModeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="ml-4 p-1 rounded-md hover:bg-accent"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-background/95 backdrop-blur-md shadow-md"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`py-2 text-sm font-medium ${
                                        activeSection === item.id
                                            ? getActiveNavStyles()
                                            : `text-foreground/70 ${getNavHoverStyles()}`
                                    } transition-colors`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
