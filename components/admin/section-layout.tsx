"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface SectionLayoutProps {
  title: string
  isLoading: boolean
  error?: string
  children: ReactNode
}

export function SectionLayout({ title, isLoading, error, children }: SectionLayoutProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit {title} Section</h1>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {children}
    </div>
  )
}
