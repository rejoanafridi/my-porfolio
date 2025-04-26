'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
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
import Loading from '@/components/ui/Loading'

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

                if (data.success) {
                    setProjectsData(data.data)
                } else {
                    setError('Failed to load projects data')
                }
            } catch (err) {
                setError('An error occurred while fetching data')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target

        if (projectsData) {
            setProjectsData({
                ...projectsData,
                [name]: value
            })
        }
    }

    const handleProjectChange = (
        index: number,
        field: keyof Project,
        value: any
    ) => {
        if (!projectsData) return

        const newProjects = [...projectsData.projects]
        newProjects[index] = {
            ...newProjects[index],
            [field]: value
        }

        setProjectsData({
            ...projectsData,
            projects: newProjects
        })
    }

    const handleTechStackChange = (
        projectIndex: number,
        techIndex: number,
        field: 'name' | 'icon',
        value: string
    ) => {
        if (!projectsData) return

        const newProjects = [...projectsData.projects]
        const newTechStack = [...newProjects[projectIndex].techStack]

        newTechStack[techIndex] = {
            ...newTechStack[techIndex],
            [field]: value
        }

        newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            techStack: newTechStack
        }

        setProjectsData({
            ...projectsData,
            projects: newProjects
        })
    }

    const addTechStack = (projectIndex: number) => {
        if (!projectsData) return

        const newProjects = [...projectsData.projects]
        const newTechStack = [
            ...newProjects[projectIndex].techStack,
            { name: '', icon: 'Code' }
        ]

        newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            techStack: newTechStack
        }

        setProjectsData({
            ...projectsData,
            projects: newProjects
        })
    }

    const removeTechStack = (projectIndex: number, techIndex: number) => {
        if (!projectsData) return

        const newProjects = [...projectsData.projects]
        const newTechStack = [...newProjects[projectIndex].techStack]

        newTechStack.splice(techIndex, 1)

        newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            techStack: newTechStack
        }

        setProjectsData({
            ...projectsData,
            projects: newProjects
        })
    }

    const addProject = () => {
        if (!projectsData) return

        const newId = `project-${Date.now()}`

        setProjectsData({
            ...projectsData,
            projects: [
                ...projectsData.projects,
                {
                    id: newId,
                    title: '',
                    description: '',
                    image: '/placeholder.svg?height=200&width=400',
                    techStack: [{ name: 'React', icon: 'Code' }],
                    demoLink: 'https://example.com',
                    githubLink: 'https://github.com',
                    featured: true
                }
            ]
        })
    }

    const removeProject = (index: number) => {
        if (!projectsData) return

        const newProjects = [...projectsData.projects]
        newProjects.splice(index, 1)

        setProjectsData({
            ...projectsData,
            projects: newProjects
        })
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination || !projectsData) return

        const items = Array.from(projectsData.projects)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setProjectsData({
            ...projectsData,
            projects: items
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!projectsData) return

        setIsSaving(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/site/projects', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectsData)
            })

            const data = await response.json()

            if (data.success) {
                setSuccess('Projects section updated successfully')
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError(data.error || 'Failed to update projects section')
            }
        } catch (err) {
            setError('An error occurred while saving data')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    if (!projectsData) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Failed to load projects data
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                {projectsData.projects.map((project, index) => (
                                    <Draggable
                                        key={project.id}
                                        draggableId={project.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="border-2"
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="cursor-grab"
                                                        >
                                                            <GripVertical
                                                                size={20}
                                                                className="text-muted-foreground"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    id={`featured-${index}`}
                                                                    checked={
                                                                        project.featured
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) =>
                                                                        handleProjectChange(
                                                                            index,
                                                                            'featured',
                                                                            checked
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`featured-${index}`}
                                                                >
                                                                    Featured
                                                                </Label>
                                                            </div>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeProject(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    projectsData
                                                                        .projects
                                                                        .length <=
                                                                    1
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`title-${index}`}
                                                            >
                                                                Project Title
                                                            </Label>
                                                            <Input
                                                                id={`title-${index}`}
                                                                value={
                                                                    project.title
                                                                }
                                                                onChange={(e) =>
                                                                    handleProjectChange(
                                                                        index,
                                                                        'title',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Project title"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`image-${index}`}
                                                            >
                                                                Image URL
                                                            </Label>
                                                            <Input
                                                                id={`image-${index}`}
                                                                value={
                                                                    project.image
                                                                }
                                                                onChange={(e) =>
                                                                    handleProjectChange(
                                                                        index,
                                                                        'image',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Image URL"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`description-${index}`}
                                                        >
                                                            Description
                                                        </Label>
                                                        <Textarea
                                                            id={`description-${index}`}
                                                            value={
                                                                project.description
                                                            }
                                                            onChange={(e) =>
                                                                handleProjectChange(
                                                                    index,
                                                                    'description',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Project description"
                                                            rows={3}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`demoLink-${index}`}
                                                            >
                                                                Demo Link
                                                            </Label>
                                                            <Input
                                                                id={`demoLink-${index}`}
                                                                value={
                                                                    project.demoLink
                                                                }
                                                                onChange={(e) =>
                                                                    handleProjectChange(
                                                                        index,
                                                                        'demoLink',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="https://example.com"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`githubLink-${index}`}
                                                            >
                                                                GitHub Link
                                                            </Label>
                                                            <Input
                                                                id={`githubLink-${index}`}
                                                                value={
                                                                    project.githubLink
                                                                }
                                                                onChange={(e) =>
                                                                    handleProjectChange(
                                                                        index,
                                                                        'githubLink',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="https://github.com/username/repo"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <Label>
                                                                Tech Stack
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    addTechStack(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <PlusCircle
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                Add Technology
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {project.techStack.map(
                                                                (
                                                                    tech,
                                                                    techIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            techIndex
                                                                        }
                                                                        className="flex gap-2 items-center"
                                                                    >
                                                                        <div className="w-1/3">
                                                                            <Select
                                                                                value={
                                                                                    tech.icon
                                                                                }
                                                                                onValueChange={(
                                                                                    value
                                                                                ) =>
                                                                                    handleTechStackChange(
                                                                                        index,
                                                                                        techIndex,
                                                                                        'icon',
                                                                                        value
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select icon" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {Object.keys(
                                                                                        iconMap
                                                                                    ).map(
                                                                                        (
                                                                                            iconName
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    iconName
                                                                                                }
                                                                                                value={
                                                                                                    iconName
                                                                                                }
                                                                                            >
                                                                                                <div className="flex items-center">
                                                                                                    <span className="mr-2">
                                                                                                        {
                                                                                                            iconMap[
                                                                                                                iconName
                                                                                                            ]
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span>
                                                                                                        {
                                                                                                            iconName
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>
                                                                                            </SelectItem>
                                                                                        )
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>

                                                                        <Input
                                                                            value={
                                                                                tech.name
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleTechStackChange(
                                                                                    index,
                                                                                    techIndex,
                                                                                    'name',
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Technology name"
                                                                            className="flex-1"
                                                                        />

                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                removeTechStack(
                                                                                    index,
                                                                                    techIndex
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                project
                                                                                    .techStack
                                                                                    .length <=
                                                                                1
                                                                            }
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
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
