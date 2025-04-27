import { getSiteData } from '@/lib/db-server'
import LayoutWrapper from '@/components/layout-wrapper'
import { LayoutProvider } from '@/contexts/layout-context'

export default async function Home() {
    const siteData = await getSiteData()

    return (
        <LayoutProvider>
            <LayoutWrapper siteData={siteData} />
        </LayoutProvider>
    )
}
