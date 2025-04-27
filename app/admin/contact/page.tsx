"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import type { ContactSection } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { iconMap } from "@/lib/icon-map"

export default function ContactPage() {
  const router = useRouter()
  const [contactData, setContactData] = useState<ContactSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site/contact")
        const data = await response.json()

        if (data.success) {
          setContactData(data.data)
        } else {
          setError("Failed to load contact data")
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (contactData) {
      setContactData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }, [])

  const handleSocialChange = useCallback((index: number, field: "platform" | "url" | "icon", value: string) => {
    if (!contactData) return

    setContactData((prev) => {
      if (!prev) return prev
      const newSocials = [...prev.socials]
      newSocials[index] = {
        ...newSocials[index],
        [field]: value,
      }
      return {
        ...prev,
        socials: newSocials,
      }
    })
  }, [])

  const addSocial = () => {
    if (!contactData) return

    setContactData({
      ...contactData,
      socials: [...contactData.socials, { platform: "", url: "", icon: "Github" }],
    })
  }

  const removeSocial = (index: number) => {
    if (!contactData) return

    const newSocials = [...contactData.socials]
    newSocials.splice(index, 1)

    setContactData({
      ...contactData,
      socials: newSocials,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactData) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/site/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Contact section updated successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to update contact section")
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

  if (!contactData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load contact data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Contact Section</h1>
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
            <CardTitle>Contact Section Settings</CardTitle>
            <CardDescription>Edit the title and subtitle of the contact section.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={contactData.title}
                  onChange={handleChange}
                  placeholder="e.g., Contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Section Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={contactData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., Get In Touch"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Edit your contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleChange}
                  placeholder="e.g., contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={contactData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Manage your social media links.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Social Media</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSocial}>
                  <Plus size={16} className="mr-1" />
                  Add Social Link
                </Button>
              </div>

              {contactData.socials.map((social, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="w-1/4">
                    <Select value={social.icon} onValueChange={(value) => handleSocialChange(index, "icon", value)}>
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
                    value={social.platform}
                    onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                    placeholder="Platform name"
                    className="w-1/4"
                  />

                  <Input
                    value={social.url}
                    onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                    placeholder="URL"
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSocial(index)}
                    disabled={contactData.socials.length <= 1}
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
