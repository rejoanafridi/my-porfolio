"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Layout } from "lucide-react"
import { useToastNotification } from "@/hooks/use-toast-notification"
import { SectionLayout } from "@/components/admin/section-layout"

export default function LayoutSettingsPage() {
  const router = useRouter()
  const [layoutVariant, setLayoutVariant] = useState("default")
  const [isSaving, setIsSaving] = useState(false)
  const { showSuccessToast } = useToastNotification()

  // Load current layout on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem("layoutVariant")
    if (savedLayout) {
      setLayoutVariant(savedLayout)
    }
  }, [])

  const handleSaveLayout = () => {
    setIsSaving(true)

    // Save layout to localStorage
    localStorage.setItem("layoutVariant", layoutVariant)

    // Show success message
    showSuccessToast("Layout settings saved successfully")

    setIsSaving(false)
  }

  return (
    <SectionLayout title="Layout" isLoading={false}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout size={20} />
            Layout Variation
          </CardTitle>
          <CardDescription>Choose a layout variation for your portfolio website</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={layoutVariant} onValueChange={setLayoutVariant} className="space-y-8">
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="default" id="default-layout" />
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="default-layout" className="font-medium">
                  Default Layout
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Standard portfolio layout with smooth scrolling sections and animated elements
                </p>
                <div className="relative h-40 w-full rounded-md overflow-hidden border">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20"></div>
                  <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 flex items-center px-3">
                    <div className="w-20 h-4 bg-primary/30 rounded-full"></div>
                    <div className="ml-auto flex space-x-2">
                      {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                        <div key={item} className="w-12 h-4 bg-muted rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-16 left-0 right-0 flex justify-center">
                    <div className="w-3/4 h-16 bg-primary/30 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <RadioGroupItem value="creative" id="creative-layout" />
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="creative-layout" className="font-medium">
                  Creative Modern
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Bold animations, dynamic project cards, and colorful gradient touches with a single-page app feel
                </p>
                <div className="relative h-40 w-full rounded-md overflow-hidden border">
                  <div className="absolute inset-0 bg-black"></div>
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black/80 flex items-center px-3">
                    <div className="w-20 h-4 bg-amber-500/50 rounded-full"></div>
                    <div className="ml-auto flex space-x-4">
                      {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                        <div key={item} className="w-12 h-4 bg-amber-500/30 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-16 left-8 right-8 flex">
                    <div className="w-1/2 h-16 bg-gradient-to-r from-amber-500/30 to-red-500/30 rounded-lg"></div>
                    <div className="w-1/2 ml-4">
                      <div className="h-4 w-3/4 bg-amber-500/30 rounded-full mb-2"></div>
                      <div className="h-4 w-full bg-amber-500/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <RadioGroupItem value="minimal" id="minimal-layout" />
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="minimal-layout" className="font-medium">
                  Minimal Professional
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Clean, minimalistic design with focus on white space and soft transitions
                </p>
                <div className="relative h-40 w-full rounded-md overflow-hidden border">
                  <div className="absolute inset-0 bg-white dark:bg-neutral-900"></div>
                  <div className="absolute top-0 left-0 right-0 h-8 bg-white/80 dark:bg-neutral-900/80 flex items-center px-3">
                    <div className="w-20 h-4 bg-neutral-800/20 dark:bg-neutral-200/20 rounded-sm"></div>
                    <div className="ml-auto flex space-x-6">
                      {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                        <div key={item} className="w-8 h-3 bg-neutral-800/20 dark:bg-neutral-200/20"></div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-16 left-0 right-0 px-8">
                    <div className="h-4 w-1/3 mx-auto bg-neutral-800/20 dark:bg-neutral-200/20 mb-4"></div>
                    <div className="h-3 w-2/3 mx-auto bg-neutral-800/10 dark:bg-neutral-200/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveLayout} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </SectionLayout>
  )
}
