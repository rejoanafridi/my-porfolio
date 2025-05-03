import { NextResponse } from 'next/server'
import { getSiteConfig, updateSiteConfig } from '@/lib/db-postgres'
import { isAdmin } from '@/lib/auth'

// Get site configuration
export async function GET() {
    try {
        // First try to get existing config
        const data = await getSiteConfig()

        if (!data) {
            // Initialize default config if none exists
            const defaultConfig = {
                id: 'default',
                siteName: 'My Portfolio',
                siteDescription: 'Personal portfolio website',
                siteUrl: 'http://localhost:3000',
                logoUrl: '',
                faviconUrl: '',
                metaImage: '',
                footerText: '',
                copyrightText: ''
            }

            // Try to create default config
            try {
                const createResult = await updateSiteConfig(defaultConfig)
                if (!createResult.success) {
                    console.error(
                        'Failed to initialize site configuration:',
                        createResult.error
                    )
                    // Return default config even if save fails
                    return NextResponse.json({
                        success: true,
                        data: defaultConfig
                    })
                }

                return NextResponse.json({
                    success: true,
                    data: defaultConfig
                })
            } catch (createError) {
                console.error('Error creating default config:', createError)
                // Return default config even if save fails
                return NextResponse.json({
                    success: true,
                    data: defaultConfig
                })
            }
        }

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Error fetching site configuration:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch site configuration' },
            { status: 500 }
        )
    }
}

// Update site configuration
export async function PUT(req: Request) {
    try {
        // Check if user is admin
        const isAdminUser = await isAdmin(req)
        if (!isAdminUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        const newConfig = await req.json()

        // Validate required fields
        if (!newConfig.siteName || !newConfig.siteUrl) {
            return NextResponse.json(
                { success: false, error: 'Site name and URL are required' },
                { status: 400 }
            )
        }

        // Validate URL format
        try {
            new URL(newConfig.siteUrl)
        } catch (e) {
            return NextResponse.json(
                { success: false, error: 'Invalid site URL format' },
                { status: 400 }
            )
        }

        const result = await updateSiteConfig(newConfig)

        if (!result.success) {
            console.error('Database update error:', result.error)
            // Return the existing config if update fails
            const currentConfig = await getSiteConfig()
            return NextResponse.json(
                {
                    success: false,
                    error:
                        result.error ||
                        'Database operation failed while updating site configuration',
                    data: currentConfig || newConfig
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: 'Site configuration updated successfully'
        })
    } catch (error) {
        console.error('Error updating site configuration:', error)
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred while updating site configuration',
                data: await getSiteConfig() || newConfig
            },
            { status: 500 }
        )
    }
}
