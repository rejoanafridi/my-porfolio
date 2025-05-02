'use client'

import type React from 'react'
import { useCallback, useMemo, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import type { AboutSection } from '@/lib/types'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { iconMap } from '@/lib/icon-map'
import { SectionLayout } from '@/components/admin/section-layout'
import { SaveButton } from '@/components/admin/save-button'
import { useAdminSection } from '@/hooks/use-admin-section'

// Memoized input component to prevent unnecessary re-renders
const MemoizedInput = memo(({ value, onChange, ...props }) => {
    return <Input value={value} onChange={onChange} {...props} />
})
MemoizedInput.displayName = 'MemoizedInput'

// Memoized textarea component
const MemoizedTextarea = memo(({ value, onChange, ...props }) => {
    return <Textarea value={value} onChange={onChange} {...props} />
})
MemoizedTextarea.displayName = 'MemoizedTextarea'

// Memoized trait item component
const TraitItem = memo(
    ({
        trait,
        index,
        onTraitChange,
        onRemoveTrait,
        disableRemove,
        iconOptions
    }) => {
        const handleTextChange = useCallback(
            (e) => {
                onTraitChange(index, 'text', e.target.value)
            },
            [index, onTraitChange]
        )

        const handleIconChange = useCallback(
            (value) => {
                onTraitChange(index, 'icon', value)
            },
            [index, onTraitChange]
        )

        const handleRemove = useCallback(() => {
            onRemoveTrait(index)
        }, [index, onRemoveTrait])

        return (
            <div className="flex gap-2 items-center">
                <div className="w-1/3">
                    <Select value={trait.icon} onValueChange={handleIconChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>{iconOptions}</SelectContent>
                    </Select>
                </div>

                <MemoizedInput
                    value={trait.text}
                    onChange={handleTextChange}
                    placeholder="Trait text"
                    className="flex-1"
                />

                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemove}
                    disabled={disableRemove}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        )
    }
)
TraitItem.displayName = 'TraitItem'

// Memoized paragraph item component
const ParagraphItem = memo(
    ({ value, index, onChange, onRemove, disableRemove }) => {
        const handleChange = useCallback(
            (e) => {
                onChange(index, e.target.value)
            },
            [index, onChange]
        )

        const handleRemove = useCallback(() => {
            onRemove(index)
        }, [index, onRemove])

        return (
            <div className="flex gap-2">
                <MemoizedTextarea
                    value={value}
                    onChange={handleChange}
                    placeholder={`Paragraph ${index + 1}`}
                    rows={3}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemove}
                    disabled={disableRemove}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        )
    }
)
ParagraphItem.displayName = 'ParagraphItem'

export default function AboutPage() {
    const {
        data: aboutData,
        setData: setAboutData,
        isLoading,
        isSaving,
        saveData
    } = useAdminSection<AboutSection>({
        endpoint: 'about'
    })

    // Memoize icon options to prevent recreating on every render
    const iconOptions = useMemo(
        () =>
            Object.keys(iconMap).map((iconName) => (
                <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center">
                        <span className="mr-2">{iconMap[iconName]}</span>
                        <span>{iconName}</span>
                    </div>
                </SelectItem>
            )),
        []
    )

    // Use field-specific handlers instead of a generic handler
    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!aboutData) return
            setAboutData((prev) => ({ ...prev, title: e.target.value }))
        },
        [aboutData, setAboutData]
    )

    const handleSubtitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!aboutData) return
            setAboutData((prev) => ({ ...prev, subtitle: e.target.value }))
        },
        [aboutData, setAboutData]
    )

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!aboutData) return
            setAboutData((prev) => ({ ...prev, image: e.target.value }))
        },
        [aboutData, setAboutData]
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
                    description: newDescription
                }
            })
        },
        [aboutData, setAboutData]
    )

    const addDescriptionParagraph = useCallback(() => {
        if (!aboutData) return

        setAboutData((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                description: [...prev.description, '']
            }
        })
    }, [setAboutData])

    const removeDescriptionParagraph = useCallback(
        (index: number) => {
            if (!aboutData) return

            setAboutData((prev) => {
                if (!prev) return prev
                const newDescription = [...prev.description]
                newDescription.splice(index, 1)
                return {
                    ...prev,
                    description: newDescription
                }
            })
        },
        [setAboutData]
    )

    const handleTraitChange = useCallback(
        (index: number, field: 'icon' | 'text', value: string) => {
            if (!aboutData) return

            setAboutData((prev) => {
                if (!prev) return prev
                const newTraits = [...prev.traits]
                newTraits[index] = {
                    ...newTraits[index],
                    [field]: value
                }
                return {
                    ...prev,
                    traits: newTraits
                }
            })
        },
        [setAboutData]
    )

    const addTrait = useCallback(() => {
        if (!aboutData) return

        setAboutData((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                traits: [...prev.traits, { icon: 'Code', text: '' }]
            }
        })
    }, [setAboutData])

    const removeTrait = useCallback(
        (index: number) => {
            if (!aboutData) return

            setAboutData((prev) => {
                if (!prev) return prev
                const newTraits = [...prev.traits]
                newTraits.splice(index, 1)
                return {
                    ...prev,
                    traits: newTraits
                }
            })
        },
        [setAboutData]
    )

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (aboutData) {
                await saveData(aboutData)
            }
        },
        [aboutData, saveData]
    )

    if (isLoading || !aboutData) {
        return <SectionLayout title="About" isLoading={true} />
    }

    return (
        <SectionLayout title="About" isLoading={isLoading}>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>About Content</CardTitle>
                        <CardDescription>
                            Edit the main content of the about section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Section Title</Label>
                                <MemoizedInput
                                    id="title"
                                    name="title"
                                    value={aboutData.title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g., About Me"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">
                                    Section Subtitle
                                </Label>
                                <MemoizedInput
                                    id="subtitle"
                                    name="subtitle"
                                    value={aboutData.subtitle}
                                    onChange={handleSubtitleChange}
                                    placeholder="e.g., My Journey & Expertise"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Profile Image URL</Label>
                                <MemoizedInput
                                    id="image"
                                    name="image"
                                    value={aboutData.image}
                                    onChange={handleImageChange}
                                    placeholder="URL to your profile image"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Description Paragraphs</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addDescriptionParagraph}
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Paragraph
                                    </Button>
                                </div>

                                {aboutData.description.map(
                                    (paragraph, index) => (
                                        <ParagraphItem
                                            key={`paragraph-${index}`}
                                            value={paragraph}
                                            index={index}
                                            onChange={handleDescriptionChange}
                                            onRemove={
                                                removeDescriptionParagraph
                                            }
                                            disableRemove={
                                                aboutData.description.length <=
                                                1
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Traits</CardTitle>
                        <CardDescription>
                            Edit the traits or skills that appear in the about
                            section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Traits</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTrait}
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Trait
                                </Button>
                            </div>

                            {aboutData.traits.map((trait, index) => (
                                <TraitItem
                                    key={`trait-${index}`}
                                    trait={trait}
                                    index={index}
                                    onTraitChange={handleTraitChange}
                                    onRemoveTrait={removeTrait}
                                    disableRemove={aboutData.traits.length <= 1}
                                    iconOptions={iconOptions}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SaveButton
                            onClick={handleSubmit}
                            isSaving={isSaving}
                            className="w-full md:w-auto"
                        />
                    </CardFooter>
                </Card>
            </div>
        </SectionLayout>
    )
}
