'use client'

import type React from 'react'

import { createContext, useContext, useState, useEffect } from 'react'
import useClient from '@/hooks/use-client'

type LayoutVariant = 'default' | 'minimal' | 'creative'

interface LayoutContextType {
    layoutVariant: LayoutVariant
    setLayoutVariant: (layout: LayoutVariant) => void
    siteConfig: any
    siteData: any
    setSiteConfig: (config: any) => void
    setSiteData: (data: any) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({
    children,
    siteConfig: siteConfigData,
    siteData: siteDataData
}: {
    children: React.ReactNode
    siteConfig: any
    siteData: any
}) {
    const isClient = useClient()
    const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>('default')
    const [siteConfig, setSiteConfig] = useState<any>(siteConfigData)
    const [siteData, setSiteData] = useState<any>(siteDataData)

    // Load layout from localStorage on client side
    useEffect(() => {
        if (!isClient) return

        const savedLayout = localStorage.getItem(
            'layoutVariant'
        ) as LayoutVariant | null
        if (
            savedLayout &&
            ['default', 'minimal', 'creative'].includes(savedLayout)
        ) {
            setLayoutVariant(savedLayout)
        }
    }, [isClient])

    // Save layout to localStorage when it changes
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('layoutVariant', layoutVariant)
        }
    }, [layoutVariant, isClient])

    return (
        <LayoutContext.Provider
            value={{
                layoutVariant,
                setLayoutVariant,
                siteConfig,
                siteData,
                setSiteConfig,
                setSiteData
            }}
        >
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayout() {
    const context = useContext(LayoutContext)
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider')
    }
    return context
}
