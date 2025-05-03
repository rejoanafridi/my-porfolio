'use client'
import { Suspense, useState } from 'react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import type {} from '@/lib/types'
import CreativeNavbar from '@/components/creative/navbar'
import CreativeHero from '@/components/creative/hero'
import CreativeAbout from '@/components/creative/about'
import CreativeSkills from '@/components/creative/skills'
import CreativeProjects from '@/components/creative/projects'
import CreativeContact from '@/components/creative/contact'
import CreativeFooter from '@/components/creative/footer'
import { AnimatePresence, motion } from 'framer-motion'
import { useLayout } from '@/contexts/layout-context'

export default function CreativeLayout() {
    const { siteData } = useLayout()
    const [currentSection, setCurrentSection] = useState('hero')
    const [isTransitioning, setIsTransitioning] = useState(false)

    const handleSectionChange = (section: string) => {
        if (currentSection !== section && !isTransitioning) {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentSection(section)
                setIsTransitioning(false)
            }, 600)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <CreativeNavbar
                currentSection={currentSection}
                onSectionChange={handleSectionChange}
            />

            <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSection}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen"
                    >
                        {currentSection === 'hero' && (
                            <CreativeHero data={siteData.hero} />
                        )}
                        {currentSection === 'about' && (
                            <CreativeAbout data={siteData.about} />
                        )}
                        {currentSection === 'skills' && (
                            <CreativeSkills data={siteData.skills} />
                        )}
                        {currentSection === 'projects' && (
                            <CreativeProjects data={siteData.projects} />
                        )}
                        {currentSection === 'contact' && (
                            <CreativeContact data={siteData.contact} />
                        )}
                    </motion.div>
                </AnimatePresence>

                <CreativeFooter />
            </Suspense>
        </div>
    )
}
