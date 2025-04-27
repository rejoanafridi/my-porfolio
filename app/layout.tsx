import type React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider as PortfolioThemeProvider } from '@/contexts/theme-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Professional Portfolio',
    description: 'A professional portfolio website',
    generator: 'v0.dev'
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <PortfolioThemeProvider>
                        {children}
                        <Toaster />
                    </PortfolioThemeProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
