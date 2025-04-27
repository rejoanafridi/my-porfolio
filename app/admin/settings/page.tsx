"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Palette } from "lucide-react"
import { useToastNotification } from "@/hooks/use-toast-notification"
import { SectionLayout } from "@/components/admin/section-layout"

export default function SettingsPage() {
  const router = useRouter()
  const [themeVariant, setThemeVariant] = useState("default")
  const [isSaving, setIsSaving] = useState(false)
  const { showSuccessToast } = useToastNotification()

  // Load current theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeVariant")
    if (savedTheme) {
      setThemeVariant(savedTheme)
    }
  }, [])

  const handleSaveTheme = () => {
    setIsSaving(true)

    // Save theme to localStorage
    localStorage.setItem("themeVariant", themeVariant)

    // Show success message
    showSuccessToast("Theme settings saved successfully")

    setIsSaving(false)
  }

  return (
    <SectionLayout title="Settings" isLoading={false}>
      <Tabs defaultValue="theme">
        <TabsList className="mb-6">
          <TabsTrigger value="theme">Theme Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                Theme Variation
              </CardTitle>
              <CardDescription>Choose a theme variation for your portfolio website</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={themeVariant} onValueChange={setThemeVariant} className="space-y-6">
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="default" id="default" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="default" className="font-medium">
                      Default Theme
                    </Label>
                    <p className="text-sm text-muted-foreground">Modern purple gradient theme with animated elements</p>
                    <div className="mt-2 flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary"></div>
                      <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                      <div className="w-6 h-6 rounded-full bg-pink-500"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="minimal" className="font-medium">
                      Minimal Elegant
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Clean, minimalist design with subtle animations and monochrome palette
                    </p>
                    <div className="mt-2 flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-200"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-600 dark:bg-slate-100"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-400 dark:bg-slate-300"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="creative" id="creative" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="creative" className="font-medium">
                      Creative Bold
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Vibrant, energetic design with bold colors and playful animations
                    </p>
                    <div className="mt-2 flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                      <div className="w-6 h-6 rounded-full bg-orange-600 dark:bg-orange-500"></div>
                      <div className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTheme} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Theme
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </SectionLayout>
  )
}
