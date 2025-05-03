import { getSiteData } from '@/lib/db-server'
import LayoutWrapper from '@/components/layout-wrapper'
import { LayoutProvider } from '@/contexts/layout-context'
import { getSiteConfig } from '@/lib/db-postgres'

export default async function Home() {
    const siteConfig = await getSiteConfig()
    const siteData = await getSiteData()

    return (
        <LayoutProvider siteConfig={siteConfig} siteData={siteData}>
            <LayoutWrapper />
        </LayoutProvider>
    )
}
