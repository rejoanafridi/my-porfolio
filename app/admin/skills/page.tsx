"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react"
import type { SkillsSection, Skill } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { iconMap } from "@/lib/icon-map"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function SkillsPage() {
  const router = useRouter()
  const [skillsData, setSkillsData] = useState<SkillsSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site/skills")
        const data = await response.json()

        if (data.success) {
          setSkillsData(data.data)
        } else {
          setError("Failed to load skills data")
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (skillsData) {
      setSkillsData({
        ...skillsData,
        [name]: value,
      })
    }
  }

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    if (!skillsData) return

    const newSkills = [...skillsData.skills]
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    }

    setSkillsData({
      ...skillsData,
      skills: newSkills,
    })
  }

  const addSkill = () => {
    if (!skillsData) return

    const newId = `skill-${Date.now()}`

    setSkillsData({
      ...skillsData,
      skills: [
        ...skillsData.skills,
        {
          id: newId,
          name: "",
          icon: "Code",
          color: "bg-primary/10 text-primary",
        },
      ],
    })
  }

  const removeSkill = (index: number) => {
    if (!skillsData) return

    const newSkills = [...skillsData.skills]
    newSkills.splice(index, 1)

    setSkillsData({
      ...skillsData,
      skills: newSkills,
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination || !skillsData) return

    const items = Array.from(skillsData.skills)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSkillsData({
      ...skillsData,
      skills: items,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!skillsData) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/site/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillsData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Skills section updated successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to update skills section")
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

  if (!skillsData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load skills data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Skills Section</h1>
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
            <CardTitle>Skills Section Settings</CardTitle>
            <CardDescription>Edit the title and subtitle of the skills section.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={skillsData.title}
                  onChange={handleChange}
                  placeholder="e.g., Skills"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Section Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={skillsData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., Technical Expertise"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Manage your skills. Drag and drop to reorder.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Skills List</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus size={16} className="mr-1" />
                  Add Skill
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="skills">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {skillsData.skills.map((skill, index) => (
                        <Draggable key={skill.id} draggableId={skill.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex gap-2 items-center border p-3 rounded-md bg-card"
                            >
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical size={20} className="text-muted-foreground" />
                              </div>

                              <div className="w-1/4">
                                <Select
                                  value={skill.icon}
                                  onValueChange={(value) => handleSkillChange(index, "icon", value)}
                                >
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
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                                placeholder="Skill name"
                                className="flex-1"
                              />

                              <Input
                                value={skill.color}
                                onChange={(e) => handleSkillChange(index, "color", e.target.value)}
                                placeholder="CSS color classes"
                                className="w-1/3"
                              />

                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeSkill(index)}
                                disabled={skillsData.skills.length <= 1}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
