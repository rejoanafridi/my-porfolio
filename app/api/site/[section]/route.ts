import { NextResponse } from 'next/server'
import {
    getHeroSection,
    getAboutSection,
    getSkillsSection,
    getProjectsSection,
    getContactSection,
    updateHeroSection,
    updateAboutSection,
    updateSkillsSection,
    updateProjectsSection,
    updateContactSection
} from '@/lib/db-postgres'
import { isAdmin } from '@/lib/auth'

// Get specific section data
export async function GET(
    req: Request,
    { params }: { params: { section: string } }
) {
    try {
        const { section } = await params

        let data

        switch (section) {
            case 'hero':
                data = await getHeroSection()
                break
            case 'about':
                data = await getAboutSection()
                break
            case 'skills':
                data = await getSkillsSection()
                break
            case 'projects':
                data = await getProjectsSection()
                break
            case 'contact':
                data = await getContactSection()
                break
            default:
                return NextResponse.json(
                    { success: false, error: `Section '${section}' not found` },
                    { status: 404 }
                )
        }

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Section '${section}' data not found`
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data
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
        const newSectionData = await req.json()

        let result

        switch (section) {
            case 'siteConfig':
                result = await updateHeroSection(newSectionData)
                break
            case 'hero':
                result = await updateHeroSection(newSectionData)
                break
            case 'about':
                result = await updateAboutSection(newSectionData)
                break
            case 'skills':
                result = await updateSkillsSection(newSectionData)
                break
            case 'projects':
                result = await updateProjectsSection(newSectionData)
                break
            case 'contact':
                result = await updateContactSection(newSectionData)
                break
            default:
                return NextResponse.json(
                    { success: false, error: `Section '${section}' not found` },
                    { status: 404 }
                )
        }

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
