'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import type { CloudinaryUploadResponse } from '@/lib/types-siteconfig'

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    label?: string
    folder?: string
    className?: string
}

export function ImageUploader({
    value,
    onChange,
    label = 'Image',
    folder = 'portfolio-website',
    className = ''
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) {
                setFile(selectedFile)
                setUploadError('')
            }
        },
        []
    )
    useEffect(() => {
        if (isUploading) {
            setIsUploading(isUploading)
        }
    }, [isUploading])
    const handleUpload = useCallback(async () => {
        if (!file) {
            setUploadError('Please select a file to upload')
            return
        }

        setIsUploading(true)
        setUploadError('')

        try {
            // Convert file to base64
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64data = reader.result as string

                // Upload to Cloudinary via our API
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: base64data,
                        folder
                    })
                })

                const result = await response.json()

                if (result.success) {
                    const uploadResult = result.data as CloudinaryUploadResponse
                    onChange(uploadResult.secure_url)
                    setFile(null)
                } else {
                    setUploadError(result.error || 'Failed to upload image')
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            setUploadError('An error occurred while uploading the image')
        } finally {
            setIsUploading(false)
        }
    }, [file, folder, onChange])

    const handleRemoveImage = useCallback(() => {
        onChange('')
    }, [onChange])

    const handleManualUrlChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value)
        },
        [onChange]
    )

    return (
        <div className={`space-y-4 ${className}`}>
            {label && <Label htmlFor="image-url">{label}</Label>}

            <div className="flex flex-col gap-4">
                {/* Image preview */}
                {value && (
                    <div className="relative w-full max-w-xs h-40 border rounded-md overflow-hidden">
                        <Image
                            src={value}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                )}

                {/* Manual URL input */}
                <Input
                    id="image-url"
                    value={value}
                    onChange={handleManualUrlChange}
                    placeholder="Image URL"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        key={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="mr-2 animate-spin"
                                />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={16} className="mr-2" />
                                Upload
                            </>
                        )}
                    </Button>
                </div>

                {uploadError && (
                    <p className="text-sm text-destructive">{uploadError}</p>
                )}
            </div>
        </div>
    )
}
