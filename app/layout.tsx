import type React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider as PortfolioThemeProvider } from '@/contexts/theme-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Rejoan Islam',
    description: 'A professional portfolio website Rejoan Islam'
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              })();
            `
                    }}
                />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    // attribute="class"
                    // defaultTheme="system"
                    // enableSystem
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
