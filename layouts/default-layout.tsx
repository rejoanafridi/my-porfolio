'use client'

import { Suspense } from 'react'
import Hero from '@/components/default/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import Navbar from '@/components/default/navbar'
import LoadingSpinner from '@/components/ui/loading-spinner'
import type { SiteConfig } from '@/lib/types'

interface DefaultLayoutProps {
    siteData: SiteConfig
}

export default function DefaultLayout({ siteData }: DefaultLayoutProps) {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
                <Hero data={siteData.hero} />
                <About data={siteData.about} />
                <Skills data={siteData.skills} />
                <Projects data={siteData.projects} />
                <Contact data={siteData.contact} />
                <Footer name={siteData.hero.name} />
            </Suspense>
        </main>
    )
}
