'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useHasMounted } from '@/hooks/use-has-mounted'

type ThemeVariant = 'default' | 'minimal' | 'creative'

interface ThemeContextType {
    themeVariant: ThemeVariant
    setThemeVariant: (theme: ThemeVariant) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme color configurations with CSS variable mappings
const themeConfigurations = {
    default: {
        light: {
            '--primary': 'hsl(262.1 83.3% 57.8%)',
            '--primary-foreground': 'hsl(210 20% 98%)',
            '--secondary': 'hsl(240 4.8% 95.9%)',
            '--secondary-foreground': 'hsl(240 5.9% 10%)',
            '--background': 'hsl(0 0% 100%)',
            '--foreground': 'hsl(240 10% 3.9%)'
        },
        dark: {
            '--primary': 'hsl(263.4 70% 50.4%)',
            '--primary-foreground': 'hsl(210 20% 98%)',
            '--secondary': 'hsl(240 3.7% 15.9%)',
            '--secondary-foreground': 'hsl(0 0% 98%)',
            '--background': 'hsl(240 10% 3.9%)',
            '--foreground': 'hsl(0 0% 98%)'
        }
    },
    minimal: {
        light: {
            '--primary': 'hsl(220 14% 30%)',
            '--primary-foreground': 'hsl(0 0% 100%)',
            '--secondary': 'hsl(220 14% 95%)',
            '--secondary-foreground': 'hsl(220 14% 30%)',
            '--background': 'hsl(0 0% 100%)',
            '--foreground': 'hsl(220 14% 10%)'
        },
        dark: {
            '--primary': 'hsl(220 14% 80%)',
            '--primary-foreground': 'hsl(220 14% 10%)',
            '--secondary': 'hsl(220 14% 15%)',
            '--secondary-foreground': 'hsl(220 14% 80%)',
            '--background': 'hsl(220 14% 10%)',
            '--foreground': 'hsl(220 14% 95%)'
        }
    },
    creative: {
        light: {
            '--primary': 'hsl(35 92% 50%)',
            '--primary-foreground': 'hsl(0 0% 100%)',
            '--secondary': 'hsl(35 92% 95%)',
            '--secondary-foreground': 'hsl(35 92% 20%)',
            '--background': 'hsl(0 0% 100%)',
            '--foreground': 'hsl(35 10% 10%)'
        },
        dark: {
            '--primary': 'hsl(35 92% 50%)',
            '--primary-foreground': 'hsl(0 0% 10%)',
            '--secondary': 'hsl(35 50% 15%)',
            '--secondary-foreground': 'hsl(35 92% 90%)',
            '--background': 'hsl(0 0% 10%)',
            '--foreground': 'hsl(35 10% 95%)'
        }
    }
} satisfies Record<
    ThemeVariant,
    Record<'light' | 'dark', Record<string, string>>
>

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const hasMounted = useHasMounted()
    const [themeVariant, _setThemeVariant] = useState<ThemeVariant>('default')
    const { theme: nextTheme, resolvedTheme } = useNextTheme()
    const isDark = resolvedTheme === 'dark'

    // Memoized theme configuration based on variant and mode
    const currentTheme = useMemo(
        () => themeConfigurations[themeVariant][isDark ? 'dark' : 'light'],
        [themeVariant, isDark]
    )

    // Apply theme colors to CSS variables
    const applyTheme = useCallback(() => {
        if (!hasMounted) return

        const root = document.documentElement
        Object.entries(currentTheme).forEach(([property, value]) => {
            root.style.setProperty(property, value)
        })
    }, [currentTheme, hasMounted])

    // Sync theme with localStorage and CSS
    const setThemeVariant = useCallback((variant: ThemeVariant) => {
        _setThemeVariant(variant)
        localStorage.setItem('themeVariant', variant)
    }, [])

    // Initial theme setup
    useEffect(() => {
        if (!hasMounted) return

        const savedTheme = localStorage.getItem(
            'themeVariant'
        ) as ThemeVariant | null
        const initialTheme =
            savedTheme && Object.keys(themeConfigurations).includes(savedTheme)
                ? savedTheme
                : 'default'

        _setThemeVariant(initialTheme)
    }, [hasMounted])

    // Apply theme changes
    useEffect(() => {
        applyTheme()
    }, [applyTheme, currentTheme])

    // Prevent flash of unstyled content
    if (!hasMounted) {
        return (
            <div style={{ visibility: 'hidden' }} aria-hidden="true">
                {children}
            </div>
        )
    }

    return (
        <ThemeContext.Provider value={{ themeVariant, setThemeVariant }}>
            <div style={currentTheme}>{children}</div>
        </ThemeContext.Provider>
    )
}

export function useThemeVariant() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useThemeVariant must be used within a ThemeProvider')
    }
    return context
}

// use-has-mounted.ts
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])
    return hasMounted
}
