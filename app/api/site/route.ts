import { NextResponse } from 'next/server'
import { getSiteData, updateSiteData } from '@/lib/db-server'
import { isAdmin } from '@/lib/auth'

// Get all site data
export async function GET() {
    try {
        const siteData = getSiteData()
        return NextResponse.json({ success: true, data: siteData })
    } catch (error) {
        console.error('Error fetching site data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch site data' },
            { status: 500 }
        )
    }
}

// Update all site data
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

        const newData = await req.json()
        const result = updateSiteData(newData)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data: result.data })
    } catch (error) {
        console.error('Error updating site data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update site data' },
            { status: 500 }
        )
    }
}
