"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to check if code is running on the client side
 * Use this to safely access browser APIs like window, document, localStorage
 *
 * @returns {boolean} True if running on client side, false otherwise
 *
 * @example
 * const isClient = useClient();
 *
 * // Only render client-side components when isClient is true
 * if (!isClient) return null;
 *
 * // Now you can safely use browser APIs
 * const width = window.innerWidth;
 */
export function useClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export default useClient
