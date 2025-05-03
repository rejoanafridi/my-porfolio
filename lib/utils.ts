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
