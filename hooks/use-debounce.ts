'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to debounce a value
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        // Update debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cancel the timeout if value changes or component unmounts
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}
