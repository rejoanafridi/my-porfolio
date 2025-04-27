"use client"

import { useToast } from "@/components/ui/use-toast"
import { useCallback } from "react"

export function useToastNotification() {
  const { toast } = useToast()

  const showSuccessToast = useCallback(
    (message: string) => {
      toast({
        title: "Success",
        description: message,
        variant: "default",
        className: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300",
      })
    },
    [toast],
  )

  const showErrorToast = useCallback(
    (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    },
    [toast],
  )

  return {
    showSuccessToast,
    showErrorToast,
  }
}
