"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import type { AboutSection } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { iconMap } from "@/lib/icon-map"

export default function AboutPage() {
  const router = useRouter()
  const [aboutData, setAboutData] = useState<AboutSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site/about")
        const data = await response.json()

        if (data.success) {
          setAboutData(data.data)
        } else {
          setError("Failed to load about data")
        }
      } catch (err) {
        setError("An error occurred while fetching data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (aboutData) {
      setAboutData({
        ...aboutData,
        [name]: value,
      })
    }
  }

  const handleDescriptionChange = (index: number, value: string) => {
    if (!aboutData) return

    const newDescription = [...aboutData.description]
    newDescription[index] = value

    setAboutData({
      ...aboutData,
      description: newDescription,
    })
  }

  const addDescriptionParagraph = () => {
    if (!aboutData) return

    setAboutData({
      ...aboutData,
      description: [...aboutData.description, ""],
    })
  }

  const removeDescriptionParagraph = (index: number) => {
    if (!aboutData) return

    const newDescription = [...aboutData.description]
    newDescription.splice(index, 1)

    setAboutData({
      ...aboutData,
      description: newDescription,
    })
  }

  const handleTraitChange = (index: number, field: "icon" | "text", value: string) => {
    if (!aboutData) return

    const newTraits = [...aboutData.traits]
    newTraits[index] = {
      ...newTraits[index],
      [field]: value,
    }

    setAboutData({
      ...aboutData,
      traits: newTraits,
    })
  }

  const addTrait = () => {
    if (!aboutData) return

    setAboutData({
      ...aboutData,
      traits: [...aboutData.traits, { icon: "Code", text: "" }],
    })
  }

  const removeTrait = (index: number) => {
    if (!aboutData) return

    const newTraits = [...aboutData.traits]
    newTraits.splice(index, 1)

    setAboutData({
      ...aboutData,
      traits: newTraits,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!aboutData) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/site/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("About section updated successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to update about section")
      }
    } catch (err) {
      setError("An error occurred while saving data")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!aboutData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load about data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit About Section</h1>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-500 text-green-500">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>Edit the main content of the about section.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={aboutData.title}
                  onChange={handleChange}
                  placeholder="e.g., About Me"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Section Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={aboutData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., My Journey & Expertise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={aboutData.image}
                  onChange={handleChange}
                  placeholder="URL to your profile image"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Description Paragraphs</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addDescriptionParagraph}>
                    <Plus size={16} className="mr-1" />
                    Add Paragraph
                  </Button>
                </div>

                {aboutData.description.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder={`Paragraph ${index + 1}`}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDescriptionParagraph(index)}
                      disabled={aboutData.description.length <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traits</CardTitle>
            <CardDescription>Edit the traits or skills that appear in the about section.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Traits</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTrait}>
                  <Plus size={16} className="mr-1" />
                  Add Trait
                </Button>
              </div>

              {aboutData.traits.map((trait, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="w-1/3">
                    <Select value={trait.icon} onValueChange={(value) => handleTraitChange(index, "icon", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(iconMap).map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center">
                              <span className="mr-2">{iconMap[iconName]}</span>
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    value={trait.text}
                    onChange={(e) => handleTraitChange(index, "text", e.target.value)}
                    placeholder="Trait text"
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTrait(index)}
                    disabled={aboutData.traits.length <= 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isSaving} className="w-full md:w-auto">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
