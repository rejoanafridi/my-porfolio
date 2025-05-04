'use client'
import { Suspense } from 'react'
import Hero from '@/components/default/hero'
import About from '@/components/about'
import Footer from '@/components/footer'
import Navbar from '@/components/default/navbar'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { useLayout } from '@/contexts/layout-context'
import Skills from '@/components/default/skills'
import Contact from '@/components/contact'
import Projects from '@/components/projects'

export default function DefaultLayout({}) {
    const { siteConfig, siteData } = useLayout()

    return (
        <main className="min-h-screen">
            <Navbar siteConfig={siteConfig} />
            <Suspense fallback={<LoadingSpinner />}>
                <Hero data={siteData.hero} />
                <About data={siteData.about} />
                <Skills data={siteData.skills} />
                <Projects data={siteData.projects} />
                <Contact data={siteData.contact} />
                <Footer />
            </Suspense>
        </main>
    )
}
