'use client'

import { useLayout } from '@/contexts/layout-context'
import { Suspense, lazy } from 'react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import type { SiteConfig } from '@/lib/types'
import useClient from '@/hooks/use-client'

// Lazy load layouts for better performance
const DefaultLayout = lazy(() => import('@/layouts/default-layout'))
const CreativeLayout = lazy(() => import('@/layouts/creative-layout'))
const MinimalLayout = lazy(() => import('@/layouts/minimal-layout'))

interface LayoutWrapperProps {
    siteData: SiteConfig
}

export default function LayoutWrapper({ siteData }: LayoutWrapperProps) {
    const isClient = useClient()
    const { layoutVariant } = useLayout()

    // Show loading spinner until client-side code is ready
    if (!isClient) {
        return <LoadingSpinner />
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {layoutVariant === 'creative' && (
                <CreativeLayout siteData={siteData} />
            )}
            {layoutVariant === 'minimal' && (
                <MinimalLayout siteData={siteData} />
            )}
            {layoutVariant === 'default' && (
                <DefaultLayout siteData={siteData} />
            )}
        </Suspense>
    )
}
