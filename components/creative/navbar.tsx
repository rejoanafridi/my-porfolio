'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ModeToggle } from '../mode-toggle'
import { motion } from 'framer-motion'
import { useLayout } from '@/contexts/layout-context'

interface CreativeNavbarProps {
    currentSection: string
    onSectionChange: (section: string) => void
}

const CreativeNavbar = ({
    currentSection,
    onSectionChange
}: CreativeNavbarProps) => {
    const { siteConfig } = useLayout()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' }
    ]

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                    >
                        {siteConfig?.config?.siteName || 'Portfolio'}
                    </motion.span>
                </Link>

                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, staggerChildren: 0.1 }}
                    className="hidden md:flex items-center space-x-8"
                >
                    {navItems.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSectionChange(item.id)}
                            className={`relative text-sm font-medium transition-colors ${
                                currentSection === item.id
                                    ? 'text-amber-400'
                                    : 'text-white hover:text-amber-400'
                            }`}
                        >
                            {currentSection === item.id && (
                                <motion.span
                                    layoutId="creativeActiveSection"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-400"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                />
                            )}
                            {item.label}
                        </motion.button>
                    ))}
                    <div className="ml-2">
                        <ModeToggle />
                    </div>
                </motion.nav>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center">
                    <ModeToggle />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            document
                                .getElementById('mobile-menu')
                                ?.classList.toggle('hidden')
                        }
                        className="ml-4 p-2 rounded-full bg-amber-500/20 text-amber-400"
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
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className="hidden md:hidden bg-black/95 backdrop-blur-md"
            >
                <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSectionChange(item.id)
                                document
                                    .getElementById('mobile-menu')
                                    ?.classList.add('hidden')
                            }}
                            className={`py-3 text-center text-lg font-medium ${
                                currentSection === item.id
                                    ? 'text-amber-400'
                                    : 'text-white'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </motion.header>
    )
}

export default CreativeNavbar
