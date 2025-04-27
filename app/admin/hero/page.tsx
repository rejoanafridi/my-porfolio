'use client'

import type React from 'react'

import { useCallback } from 'react'
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
import type { HeroSection } from '@/lib/types'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { SectionLayout } from '@/components/admin/section-layout'
import { SaveButton } from '@/components/admin/save-button'
import { useAdminSection } from '@/hooks/use-admin-section'
import { Separator } from '@/components/ui/separator'
import { FileText } from 'lucide-react'

export default function HeroPage() {
    const {
        data: heroData,
        setData: setHeroData,
        isLoading,
        isSaving,
        saveData
    } = useAdminSection<HeroSection>({
        endpoint: 'hero'
    })

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target

            if (heroData) {
                setHeroData({
                    ...heroData,
                    [name]: value
                })
            }
        },
        [heroData, setHeroData]
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (heroData) {
            await saveData(heroData)
        }
    }

    return (
        <SectionLayout title="Hero" isLoading={isLoading}>
            {heroData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Content</CardTitle>
                        <CardDescription>
                            Edit the content of the hero section that appears at
                            the top of your portfolio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <DebouncedInput
                                    id="title"
                                    name="title"
                                    value={heroData.title}
                                    onChange={(value) =>
                                        setHeroData({
                                            ...heroData,
                                            title: value
                                        })
                                    }
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={heroData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    name="subtitle"
                                    value={heroData.subtitle}
                                    onChange={handleChange}
                                    placeholder="e.g., Crafting Digital Experiences"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={heroData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description about yourself"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ctaText">
                                        Primary Button Text
                                    </Label>
                                    <Input
                                        id="ctaText"
                                        name="ctaText"
                                        value={heroData.ctaText}
                                        onChange={handleChange}
                                        placeholder="e.g., Get in Touch"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="secondaryCtaText">
                                        Secondary Button Text
                                    </Label>
                                    <Input
                                        id="secondaryCtaText"
                                        name="secondaryCtaText"
                                        value={heroData.secondaryCtaText}
                                        onChange={handleChange}
                                        placeholder="e.g., View Projects"
                                    />
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} />
                                    <h3 className="text-lg font-medium">
                                        Resume Button
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="resumeButtonText">
                                            Resume Button Text
                                        </Label>
                                        <Input
                                            id="resumeButtonText"
                                            name="resumeButtonText"
                                            value={
                                                heroData.resumeButtonText || ''
                                            }
                                            onChange={handleChange}
                                            placeholder="e.g., View Resume"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="resumeLink">
                                            Resume Link
                                        </Label>
                                        <Input
                                            id="resumeLink"
                                            name="resumeLink"
                                            value={heroData.resumeLink || ''}
                                            onChange={handleChange}
                                            placeholder="e.g., https://example.com/resume.pdf"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Enter the full URL to your resume.
                                            This will open in a new tab when
                                            clicked.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <SaveButton
                            onClick={handleSubmit}
                            isSaving={isSaving}
                            className="w-full md:w-auto"
                        />
                    </CardFooter>
                </Card>
            )}
        </SectionLayout>
    )
}
