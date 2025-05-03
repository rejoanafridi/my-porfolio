import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with credentials
cloudinary.config({
    cloud_name: 'drhbipsmy',
    api_key: '925252225862794',
    api_secret: 'hHsJzPL4h4ECmPdl81hYVJ1rVGM'
})

/**
 * Upload an image to Cloudinary
 * @param file The file to upload (base64 or file path)
 * @param options Upload options
 * @returns The upload result
 */
export async function uploadImage(file: string, options: any = {}) {
    try {
        // Set default options
        const uploadOptions = {
            folder: 'portfolio-website',
            ...options
        }

        // Upload the image
        const result = await cloudinary.uploader.upload(file, uploadOptions)
        return { success: true, data: result }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        let errorMessage = 'Failed to upload image'
        if (error instanceof Error) {
            errorMessage = error.message.includes('File size too large')
                ? 'Image size exceeds maximum limit (10MB)'
                : error.message.includes('Invalid image file')
                ? 'Invalid image format. Please upload JPEG, PNG or GIF'
                : error.message
        }
        return { success: false, error: errorMessage }
    }
}

/**
 * Delete an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns The deletion result
 */
export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return { success: true, data: result }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        return { success: false, error: 'Failed to delete image' }
    }
}

/**
 * Get a Cloudinary URL with transformations
 * @param publicId The public ID of the image
 * @param options Transformation options
 * @returns The transformed URL
 */
export function getImageUrl(publicId: string, options: any = {}) {
    return cloudinary.url(publicId, options)
}
