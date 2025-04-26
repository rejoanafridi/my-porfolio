import { Suspense } from 'react'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { getSiteData } from '@/lib/db-server'

// This ensures the database is initialized with default data
export const dynamic = 'force-dynamic'

export default async function Home() {
    // Initialize and get site data
    const siteData = getSiteData()

    return (
        <main className="min-h-screen">
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
