'use client'
import { useState, useEffect } from 'react'
import {} from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Globe } from 'lucide-react'
import { useToastNotification } from '@/hooks/use-toast-notification'
import { SectionLayout } from '@/components/admin/section-layout'
import { ImageUploader } from '@/components/admin/image-uploader'
import type { SiteConfig } from '@/lib/types-siteconfig'
import useClient from '@/hooks/use-client'

export default function SiteConfigPage() {
    const isClient = useClient()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { showSuccessToast, showErrorToast } = useToastNotification()
    const [siteConfig, setSiteConfig] = useState<SiteConfig>({
        id: '',
        siteName: '',
        siteDescription: '',
        siteUrl: '',
        logoUrl: '',
        faviconUrl: '',
        metaImage: '',
        footerText: '',
        copyrightText: '',

    })

    const fetchSiteData = async () => {
        try {
            const response = await fetch('/api/siteConfig')
            const result = await response.json()

            if (result.success && result.data) {
                setSiteConfig(result.data.config)
            } else {
                showErrorToast('Failed to load site configuration')
            }
        } catch (error) {
            console.error('Error loading site configuration:', error)
            showErrorToast('Error loading site configuration')
        } finally {
            setIsLoading(false)
        }
    }

    // Load site configuration on component mount
    useEffect(() => {
        if (isClient) {
            fetchSiteData()
        }
    }, [isClient])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setSiteConfig((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (field: string) => (url: string) => {
        setSiteConfig((prev) => ({
            ...prev,
            [field]: url
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)

        try {
            const response = await fetch('/api/siteConfig', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(siteConfig)
            })

            const result = await response.json()

            if (result.success) {
                showSuccessToast('Site configuration saved successfully')
            } else {
                showErrorToast(
                    result.error || 'Failed to save site configuration'
                )
            }
        } catch (error) {
            console.error('Error saving site configuration:', error)
            showErrorToast('Error saving site configuration')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <SectionLayout title="Site Configuration" isLoading={isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe size={20} />
                        General Settings
                    </CardTitle>
                    <CardDescription>
                        Configure your site's general information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            name="siteName"
                            value={siteConfig.siteName}
                            onChange={handleInputChange}
                            placeholder="Your Site Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteDescription">
                            Site Description
                        </Label>
                        <Textarea
                            id="siteDescription"
                            name="siteDescription"
                            value={siteConfig.siteDescription}
                            onChange={handleInputChange}
                            placeholder="Brief description of your site"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteUrl">Site URL</Label>
                        <Input
                            id="siteUrl"
                            name="siteUrl"
                            value={siteConfig.siteUrl}
                            onChange={handleInputChange}
                            placeholder="https://yoursite.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUploader
                            label="Logo"
                            value={siteConfig.logoUrl}
                            onChange={handleImageChange('logoUrl')}
                            folder="site-config"
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUploader
                            as="div"
                            label="Favicon"
                            value={siteConfig.faviconUrl}
                            onChange={handleImageChange('faviconUrl')}
                            folder="site-config"
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUploader
                            label="Meta Image (for social sharing)"
                            value={siteConfig.metaImage}
                            onChange={handleImageChange('metaImage')}
                            folder="site-config"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Textarea
                            id="footerText"
                            name="footerText"
                            value={siteConfig.footerText}
                            onChange={handleInputChange}
                            placeholder="Text to display in the footer"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="copyrightText">Copyright Text</Label>
                        <Input
                            id="copyrightText"
                            name="copyrightText"
                            value={siteConfig.copyrightText}
                            onChange={handleInputChange}
                            placeholder="© 2023 Your Company"
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto"
                    >
                        {isSaving ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="mr-2 animate-spin"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                Save Configuration
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </SectionLayout>
    )
}
