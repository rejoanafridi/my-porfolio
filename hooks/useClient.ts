'use client'

import { useEffect, useState } from 'react'

export function useClient() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // When the useEffect runs, we know we're on the client
        setIsClient(true)
    }, [])

    return { isClient }
}
