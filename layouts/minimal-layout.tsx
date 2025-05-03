'use client'
import { Suspense, useRef } from 'react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import type {} from '@/lib/types'
import MinimalNavbar from '@/components/minimal/navbar'
import MinimalHero from '@/components/minimal/hero'
import MinimalAbout from '@/components/minimal/about'
import MinimalSkills from '@/components/minimal/skills'
import MinimalProjects from '@/components/minimal/projects'
import MinimalContact from '@/components/minimal/contact'
import MinimalFooter from '@/components/minimal/footer'
import { useScroll, motion } from 'framer-motion'
import { useLayout } from '@/contexts/layout-context'

export default function MinimalLayout() {
    const { siteData } = useLayout()
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        >
            <MinimalNavbar />

            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-neutral-800 dark:bg-neutral-200 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            <Suspense fallback={<LoadingSpinner />}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <MinimalHero data={siteData.hero} />
                    <MinimalAbout data={siteData.about} />
                    <MinimalSkills data={siteData.skills} />
                    <MinimalProjects data={siteData.projects} />
                    <MinimalContact data={siteData.contact} />
                    <MinimalFooter  />
                </div>
            </Suspense>
        </div>
    )
}
