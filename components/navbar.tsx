'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const currentPath = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')

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
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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

    if (currentPath.includes('admin')) {
        return null
    }
    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-background/80 backdrop-blur-md shadow-sm'
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
                        className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        <span className="text-purple-500">Rejoan Islam</span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex items-center space-x-1"
                >
                    {navItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                activeSection === item.id
                                    ? 'text-primary'
                                    : 'hover:text-primary'
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
                                            ? 'text-primary'
                                            : 'hover:text-primary'
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
