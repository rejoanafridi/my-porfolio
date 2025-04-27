"use client"

import type React from "react"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { AboutSection } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { iconMap } from "@/lib/icon-map"
import { SectionLayout } from "@/components/admin/section-layout"
import { SaveButton } from "@/components/admin/save-button"
import { useAdminSection } from "@/hooks/use-admin-section"

export default function AboutPage() {
  const {
    data: aboutData,
    setData: setAboutData,
    isLoading,
    isSaving,
    saveData,
  } = useAdminSection<AboutSection>({
    endpoint: "about",
  })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      if (aboutData) {
        setAboutData({
          ...aboutData,
          [name]: value,
        })
      }
    },
    [aboutData, setAboutData],
  )

  const handleDescriptionChange = useCallback(
    (index: number, value: string) => {
      if (!aboutData) return

      setAboutData((prev) => {
        if (!prev) return prev
        const newDescription = [...prev.description]
        newDescription[index] = value
        return {
          ...prev,
          description: newDescription,
        }
      })
    },
    [setAboutData],
  )

  const addDescriptionParagraph = useCallback(() => {
    if (!aboutData) return

    setAboutData({
      ...aboutData,
      description: [...aboutData.description, ""],
    })
  }, [aboutData, setAboutData])

  const removeDescriptionParagraph = useCallback(
    (index: number) => {
      if (!aboutData) return

      const newDescription = [...aboutData.description]
      newDescription.splice(index, 1)

      setAboutData({
        ...aboutData,
        description: newDescription,
      })
    },
    [aboutData, setAboutData],
  )

  const handleTraitChange = useCallback(
    (index: number, field: "icon" | "text", value: string) => {
      if (!aboutData) return

      setAboutData((prev) => {
        if (!prev) return prev
        const newTraits = [...prev.traits]
        newTraits[index] = {
          ...newTraits[index],
          [field]: value,
        }
        return {
          ...prev,
          traits: newTraits,
        }
      })
    },
    [setAboutData],
  )

  const addTrait = useCallback(() => {
    if (!aboutData) return

    setAboutData({
      ...aboutData,
      traits: [...aboutData.traits, { icon: "Code", text: "" }],
    })
  }, [aboutData, setAboutData])

  const removeTrait = useCallback(
    (index: number) => {
      if (!aboutData) return

      const newTraits = [...aboutData.traits]
      newTraits.splice(index, 1)

      setAboutData({
        ...aboutData,
        traits: newTraits,
      })
    },
    [aboutData, setAboutData],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (aboutData) {
      await saveData(aboutData)
    }
  }

  return (
    <SectionLayout title="About" isLoading={isLoading}>
      {aboutData && (
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
              <SaveButton onClick={handleSubmit} isSaving={isSaving} className="w-full md:w-auto" />
            </CardFooter>
          </Card>
        </div>
      )}
    </SectionLayout>
  )
}
