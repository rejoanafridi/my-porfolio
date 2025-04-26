import { NextResponse } from 'next/server'
import { getSiteData, updateSiteSection } from '@/lib/db-server'
import { isAdmin } from '@/lib/auth'

// Get specific section data
export async function GET(
    req: Request,
    { params }: { params: { section: string } }
) {
    try {
        const { section } = await params
        const siteData = getSiteData()

        if (!(section in siteData)) {
            return NextResponse.json(
                { success: false, error: `Section '${section}' not found` },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: siteData[section as keyof typeof siteData]
        })
    } catch (error) {
        console.error(`Error fetching ${params.section} data:`, error)
        return NextResponse.json(
            { success: false, error: `Failed to fetch ${params.section} data` },
            { status: 500 }
        )
    }
}

// Update specific section data
export async function PUT(
    req: Request,
    { params }: { params: { section: string } }
) {
    try {
        // Check if user is admin
        const isAdminUser = await isAdmin(req)
        if (!isAdminUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        const { section } = await params
        const siteData = getSiteData()

        if (!(section in siteData)) {
            return NextResponse.json(
                { success: false, error: `Section '${section}' not found` },
                { status: 404 }
            )
        }

        const newSectionData = await req.json()
        const result = updateSiteSection(
            section as keyof typeof siteData,
            newSectionData
        )

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data: result.data })
    } catch (error) {
        console.error(`Error updating ${params.section} data:`, error)
        return NextResponse.json(
            {
                success: false,
                error: `Failed to update ${params.section} data`
            },
            { status: 500 }
        )
    }
}
