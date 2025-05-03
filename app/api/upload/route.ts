import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

/**
 * API route for handling image uploads to Cloudinary
 * POST /api/upload
 */
export async function POST(req: Request) {
    try {
        // Check if user is admin
        const isAdminUser = await isAdmin(req)
        if (!isAdminUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Get the request body
        const body = await req.json()
        const { image, folder = 'portfolio-website' } = body

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'No image provided' },
                { status: 400 }
            )
        }

        // Upload the image to Cloudinary
        const result = await uploadImage(image, { folder })

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        // Return the upload result
        return NextResponse.json({
            success: true,
            data: result.data
        })
    } catch (error) {
        console.error('Error uploading image:', error)
        let errorMessage = 'Failed to upload image'
        if (error instanceof Error) {
            errorMessage = error.message
        }
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        )
    }
}
