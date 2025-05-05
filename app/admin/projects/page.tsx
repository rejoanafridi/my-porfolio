'use client'

import type React from 'react'
import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Loader2,
    Save,
    Plus,
    Trash2,
    GripVertical,
    PlusCircle
} from 'lucide-react'
import type { ProjectsSection, Project } from '@/lib/types'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { iconMap } from '@/lib/icon-map'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Switch } from '@/components/ui/switch'
import { ImageUploader } from '@/components/admin/image-uploader'

const IconOptions = memo(() => (
    <>
        {Object.entries(iconMap).map(([iconName, Icon]) => (
            <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center">
                    <span className="mr-2">{Icon}</span>
                    <span>{iconName}</span>
                </div>
            </SelectItem>
        ))}
    </>
))

const TechStackItem = memo(
    ({
        tech,
        index,
        projectIndex,
        onChange,
        onRemove
    }: {
        tech: { name: string; icon: string }
        index: number
        projectIndex: number
        onChange: (
            projectIndex: number,
            techIndex: number,
            field: 'name' | 'icon',
            value: string
        ) => void
        onRemove: (projectIndex: number, techIndex: number) => void
    }) => (
        <div className="flex gap-2 items-center">
            <div className="w-1/3">
                <Select
                    value={tech.icon}
                    onValueChange={(value) =>
                        onChange(projectIndex, index, 'icon', value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                        <IconOptions />
                    </SelectContent>
                </Select>
            </div>

            <Input
                value={tech.name}
                onChange={(e) =>
                    onChange(projectIndex, index, 'name', e.target.value)
                }
                placeholder="Technology name"
                className="flex-1"
            />

            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(projectIndex, index)}
            >
                <Trash2 size={16} />
            </Button>
        </div>
    )
)

TechStackItem.displayName = 'TechStackItem'

const ProjectCard = memo(
    ({
        project,
        index,
        onChange,
        onRemove,
        onTechStackChange,
        dragHandleProps
    }: {
        project: Project
        index: number
        onChange: (index: number, field: keyof Project, value: any) => void
        onRemove: (index: number) => void
        onTechStackChange: (
            projectIndex: number,
            techIndex: number,
            field: 'name' | 'icon',
            value: string
        ) => void
        dragHandleProps: any
    }) => {
        const handleImageChange =
            (index: number, field: string) => (url: string) => {
                console.log(index, { [field]: url })
                onChange(index, field, url)
            }
        return (
            <Card className="border-2">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div {...dragHandleProps} className="cursor-grab">
                            <GripVertical
                                size={20}
                                className="text-muted-foreground"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`featured-${index}`}
                                    checked={project.featured}
                                    onCheckedChange={(checked) =>
                                        onChange(index, 'featured', checked)
                                    }
                                />
                                <Label htmlFor={`featured-${index}`}>
                                    Featured
                                </Label>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onRemove(index)}
                            >
                                <Trash2 size={16} className="mr-2" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`title-${index}`}>
                                Project Title
                            </Label>
                            <Input
                                id={`title-${index}`}
                                value={project.title}
                                onChange={(e) =>
                                    onChange(index, 'title', e.target.value)
                                }
                                placeholder="Project title"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor={`image-${index}`}>Image URL</Label>
                            <Input
                                id={`image-${index}`}
                                value={project.image}
                                onChange={(e) =>
                                    onChange(index, 'image', e.target.value)
                                }
                                placeholder="Image URL"
                            />
                        </div> */}
                    </div>
                    <div className="space-y-2">
                        <ImageUploader
                            id={`image-${index}`}
                            label="Logo"
                            value={project.image}
                            onChange={handleImageChange(index, 'image')}
                            folder="project-image"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>
                            Description
                        </Label>
                        <Textarea
                            id={`description-${index}`}
                            value={project.description}
                            onChange={(e) =>
                                onChange(index, 'description', e.target.value)
                            }
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`demoLink-${index}`}>
                                Demo Link
                            </Label>
                            <Input
                                id={`demoLink-${index}`}
                                value={project.demoLink}
                                onChange={(e) =>
                                    onChange(index, 'demoLink', e.target.value)
                                }
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`githubLink-${index}`}>
                                GitHub Link
                            </Label>
                            <Input
                                id={`githubLink-${index}`}
                                value={project.githubLink}
                                onChange={(e) =>
                                    onChange(
                                        index,
                                        'githubLink',
                                        e.target.value
                                    )
                                }
                                placeholder="https://github.com/username/repo"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Tech Stack</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onChange(index, 'techStack', [
                                        ...project.techStack,
                                        { name: '', icon: 'Code' }
                                    ])
                                }
                            >
                                <PlusCircle size={16} className="mr-1" />
                                Add Technology
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {project.techStack.map((tech, techIndex) => (
                                <TechStackItem
                                    key={techIndex}
                                    tech={tech}
                                    index={techIndex}
                                    projectIndex={index}
                                    onChange={onTechStackChange}
                                    onRemove={(pIndex, tIndex) => {
                                        const updatedTechStack = [
                                            ...project.techStack
                                        ]
                                        updatedTechStack.splice(tIndex, 1)
                                        onChange(
                                            pIndex,
                                            'techStack',
                                            updatedTechStack
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
)

ProjectCard.displayName = 'ProjectCard'

export default function ProjectsPage() {
    const router = useRouter()
    const [projectsData, setProjectsData] = useState<ProjectsSection | null>(
        null
    )
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/site/projects')
                const data = await response.json()
                data.success
                    ? setProjectsData(data.data)
                    : setError('Failed to load projects data')
            } catch (err) {
                setError('An error occurred while fetching data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSectionChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target
            setProjectsData((prev) =>
                prev ? { ...prev, [name]: value } : prev
            )
        },
        []
    )

    const handleProjectChange = useCallback(
        (index: number, field: keyof Project, value: any) => {
            setProjectsData((prev) => {
                if (!prev) return prev
                const newProjects = [...prev.projects]
                newProjects[index] = { ...newProjects[index], [field]: value }
                return { ...prev, projects: newProjects }
            })
        },
        []
    )

    const handleTechStackChange = useCallback(
        (
            projectIndex: number,
            techIndex: number,
            field: 'name' | 'icon',
            value: string
        ) => {
            setProjectsData((prev) => {
                if (!prev) return prev
                const newProjects = [...prev.projects]
                const newTechStack = [...newProjects[projectIndex].techStack]
                newTechStack[techIndex] = {
                    ...newTechStack[techIndex],
                    [field]: value
                }
                newProjects[projectIndex] = {
                    ...newProjects[projectIndex],
                    techStack: newTechStack
                }
                return { ...prev, projects: newProjects }
            })
        },
        []
    )

    const addProject = useCallback(() => {
        setProjectsData((prev) =>
            prev
                ? {
                      ...prev,
                      projects: [
                          ...prev.projects,
                          {
                              id: `project-${Date.now()}`,
                              title: '',
                              description: '',
                              image: '/placeholder.svg?height=200&width=400',
                              techStack: [{ name: 'React', icon: 'Code' }],
                              demoLink: 'https://example.com',
                              githubLink: 'https://github.com',
                              featured: true
                          }
                      ]
                  }
                : prev
        )
    }, [])

    const removeProject = useCallback((index: number) => {
        setProjectsData((prev) =>
            prev && prev.projects.length > 1
                ? {
                      ...prev,
                      projects: prev.projects.filter((_, i) => i !== index)
                  }
                : prev
        )
    }, [])

    const handleDragEnd = useCallback(
        (result: any) => {
            if (!result.destination || !projectsData) return
            const items = Array.from(projectsData.projects)
            const [reorderedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, reorderedItem)
            setProjectsData((prev) =>
                prev ? { ...prev, projects: items } : prev
            )
        },
        [projectsData]
    )

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!projectsData) return

            setIsSaving(true)
            try {
                const response = await fetch('/api/site/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectsData)
                })
                const data = await response.json()
                data.success
                    ? setSuccess('Projects section updated successfully')
                    : setError(
                          data.error || 'Failed to update projects section'
                      )
            } catch (err) {
                setError('An error occurred while saving data')
            } finally {
                setIsSaving(false)
                setTimeout(() => setSuccess(''), 3000)
            }
        },
        [projectsData]
    )

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )

    if (!projectsData)
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Failed to load projects data
                </AlertDescription>
            </Alert>
        )

    return (
        <div>
            <div className="flex flex-wrap justify-center md:justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Edit Projects Section</h1>
                <Button onClick={() => router.push('/admin')}>
                    Back to Dashboard
                </Button>
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
                        <CardTitle>Projects Section Settings</CardTitle>
                        <CardDescription>
                            Edit the title and subtitle of the projects section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Section Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={projectsData.title}
                                    onChange={handleSectionChange}
                                    placeholder="e.g., Projects"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subtitle">
                                    Section Subtitle
                                </Label>
                                <Input
                                    id="subtitle"
                                    name="subtitle"
                                    value={projectsData.subtitle}
                                    onChange={handleSectionChange}
                                    placeholder="e.g., Featured Work"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Projects</h2>
                    <Button onClick={addProject} variant="outline">
                        <Plus size={16} className="mr-2" />
                        Add Project
                    </Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="projects">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-8"
                            >
                                {projectsData.projects
                                    .sort(
                                        (a, b) =>
                                            (a.display_order || 0) -
                                            (b.display_order || 0)
                                    )
                                    .map((project, index) => (
                                        <Draggable
                                            key={project.id}
                                            draggableId={project.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <ProjectCard
                                                        project={project}
                                                        index={index}
                                                        onChange={
                                                            handleProjectChange
                                                        }
                                                        onRemove={removeProject}
                                                        onTechStackChange={
                                                            handleTechStackChange
                                                        }
                                                        dragHandleProps={
                                                            provided.dragHandleProps
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        size="lg"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save All Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
