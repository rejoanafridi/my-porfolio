"use client"

import { useState, useEffect, useCallback } from "react"
import { useToastNotification } from "./use-toast-notification"

interface AdminSectionOptions<T> {
  endpoint: string
  initialData?: T | null
}

export function useAdminSection<T>({ endpoint, initialData = null }: AdminSectionOptions<T>) {
  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { showSuccessToast, showErrorToast } = useToastNotification()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/site/${endpoint}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          showErrorToast(`Failed to load ${endpoint} data`)
        }
      } catch (err) {
        showErrorToast(`An error occurred while fetching ${endpoint} data`)
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [endpoint, showErrorToast])

  const saveData = useCallback(
    async (updatedData: T) => {
      try {
        setIsSaving(true)
        const response = await fetch(`/api/site/${endpoint}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })

        const result = await response.json()

        if (result.success) {
          showSuccessToast(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} section updated successfully`)
          return true
        } else {
          showErrorToast(result.error || `Failed to update ${endpoint} section`)
          return false
        }
      } catch (err) {
        showErrorToast(`An error occurred while saving ${endpoint} data`)
        console.error(err)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [endpoint, showErrorToast],
  )

  return {
    data,
    setData,
    isLoading,
    isSaving,
    saveData,
  }
}
