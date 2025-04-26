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
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'
import type { HeroSection } from '@/lib/types'

export default function HeroPage() {
    const router = useRouter()
    const [heroData, setHeroData] = useState<HeroSection | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/site/hero')
                const data = await response.json()

                if (data.success) {
                    setHeroData(data.data)
                } else {
                    setError('Failed to load hero data')
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

        if (heroData) {
            setHeroData({
                ...heroData,
                [name]: value
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!heroData) return

        setIsSaving(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/site/hero', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(heroData)
            })

            const data = await response.json()

            if (data.success) {
                setSuccess('Hero section updated successfully')
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError(data.error || 'Failed to update hero section')
            }
        } catch (err) {
            setError('An error occurred while saving data')
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

    if (!heroData) {
        return (
            <Alert variant="destructive">
                <AlertDescription>Failed to load hero data</AlertDescription>
            </Alert>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Edit Hero Section</h1>
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

            <Card>
                <CardHeader>
                    <CardTitle>Hero Content</CardTitle>
                    <CardDescription>
                        Edit the content of the hero section that appears at the
                        top of your portfolio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={heroData.title}
                                onChange={handleChange}
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
                                <Label htmlFor="ctaText">
                                    Resume Button Text
                                </Label>
                                <Input
                                    id="resumeBtnText"
                                    name="resumeBtnText"
                                    value={heroData.resumeBtnText}
                                    onChange={handleChange}
                                    placeholder="e.g., Resume"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">Resume Link</Label>
                                <Input
                                    id="resumeLink"
                                    name="resumeLink"
                                    value={heroData.resumeLink}
                                    onChange={handleChange}
                                    placeholder="e.g., https://resume.com/afridi"
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
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="w-full md:w-auto"
                    >
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
    )
}
