import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getDefaultColor = () => {
    const themeVariant = localStorage.getItem('themeVariant')
    switch (themeVariant) {
        case 'minimal':
            return 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50'
        case 'creative':
            return 'border-amber-200 dark:border-amber-800 bg-amber-100/30 dark:bg-amber-900/30'
        default:
            return 'border-purple-700/40 bg-purple-700 hover:text-white text-white hover:bg-purple-800/70'
    }
}

// Get logo styles based on theme variant
export const getLogoStyles = (themeVariant: any) => {
    switch (themeVariant) {
        case 'minimal':
            return 'text-slate-900 dark:text-white font-serif'
        case 'creative':
            return 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent font-bold'
        default:
            return 'bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-bold'
    }
}

// Get active nav item styles based on theme variant
export const getActiveNavStyles = (themeVariant: any) => {
    switch (themeVariant) {
        case 'minimal':
            return 'text-slate-900 dark:text-white font-medium'
        case 'creative':
            return 'text-amber-600 dark:text-amber-400 font-medium'
        default:
            return 'text-violet-600 dark:text-violet-400 font-medium'
    }
}

export const getActiveBorder = (themeVariant: any) => {
    switch (themeVariant) {
        case 'minimal':
            return 'bg-slate-700'
        case 'creative':
            return 'bg-amber-700'
        default:
            return 'bg-purple-700'
    }
}

// Get hover styles for nav items
export const getNavHoverStyles = (themeVariant: any) => {
    switch (themeVariant) {
        case 'minimal':
            return 'hover:text-slate-900 dark:hover:text-white'
        case 'creative':
            return 'hover:text-amber-600 dark:hover:text-amber-400'
        default:
            return 'hover:text-violet-600 dark:hover:text-violet-400'
    }
}
