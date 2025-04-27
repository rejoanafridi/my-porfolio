'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { HeroSection } from '@/lib/types'
import Link from 'next/link'

interface MinimalHeroProps {
    data: HeroSection
}

const MinimalHero = ({ data }: MinimalHeroProps) => {
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact')
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const scrollToProjects = () => {
        const projectsSection = document.getElementById('projects')
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center pt-16"
        >
            <div className="py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-6 text-sm font-medium text-neutral-500 dark:text-neutral-400"
                    >
                        {data.title}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-serif font-light mb-6 text-neutral-800 dark:text-neutral-200"
                    >
                        {data.name}
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl md:text-3xl font-light mb-8 text-neutral-600 dark:text-neutral-300"
                    >
                        {data.subtitle}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto"
                    >
                        {data.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href={data?.resumeLink || ''} target="_blank">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-neutral-300 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 rounded-none px-8"
                            >
                                {data.resumeButtonText || 'Resume'}
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            onClick={scrollToContact}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-800 rounded-none px-8"
                        >
                            {data.ctaText}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={scrollToProjects}
                            className="border-neutral-300 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 rounded-none px-8"
                        >
                            {data.secondaryCtaText}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default MinimalHero
