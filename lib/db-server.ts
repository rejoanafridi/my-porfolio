import fs from 'fs'
import path from 'path'
import NodeCache from 'node-cache'
import type { SiteConfig, User, ApiResponse } from './types'
import { sql } from './db-client'
import { seedDatabase } from './seed-database'
import { getDefaultSiteData } from './db'

// Initialize cache with 5 minute TTL
const appCache = new NodeCache({ stdTTL: 300, checkperiod: 600 })

// Path to our JSON "database" files
const siteDataPath = path.join(process.cwd(), 'data', 'site-data.json')
const usersPath = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }
}

// Initialize default site data if it doesn't exist
async function initSiteData(): Promise<void> {
    ensureDataDir()

    if (!fs.existsSync(siteDataPath)) {
        const defaultData: SiteConfig = getDefaultSiteData()
        defaultData.hero.resumeButtonText = 'Resume'
        defaultData.hero.resumeLink = ''
        fs.writeFileSync(siteDataPath, JSON.stringify(defaultData, null, 2))
    }

    try {
        const dbCheck = await sql`SELECT COUNT(*) FROM hero_section`
        if (Number(dbCheck[0]?.count) === 0) {
            console.log('Initializing PostgreSQL with default data...')
            await seedDatabase()
        }
    } catch (error) {
        console.error('Error checking PostgreSQL database:', error)
    }
}

// Initialize default users if they don't exist
async function initUsers(): Promise<void> {
    ensureDataDir()
    if (!fs.existsSync(usersPath)) {
        const defaultUsers: User[] = [
            {
                id: 'admin-1',
                username: 'admin',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin'
            }
        ]
        fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2))
    }

    try {
        const dbCheck = await sql`SELECT COUNT(*) FROM users`
        if (Number(dbCheck[0]?.count) === 0) {
            console.log('Adding default admin user to PostgreSQL...')
            await sql`
                INSERT INTO users (username, password, name, role)
                VALUES ('admin', 'admin123', 'Admin User', 'admin')
            `
        }
    } catch (error) {
        console.error('Error checking PostgreSQL users table:', error)
    }
}

// Get site data with caching
async function getSiteData(): Promise<SiteConfig> {
    const cacheKey = 'siteData'
    const cachedData = appCache.get<SiteConfig>(cacheKey)
    if (cachedData) return cachedData

    await initSiteData()

    console.log('Cache Stats:', appCache.getStats())

    try {
        const [
            hero,
            about,
            about_paragraphs,
            skills_section,
            skills,
            projects,
            project_section,
            contact,
            about_traits,
            project_tech_stack,
            contact_socials
        ] = await Promise.all([
            sql`SELECT * FROM hero_section`,
            sql`SELECT * FROM about_section`,
            sql`SELECT * FROM about_paragraphs`,
            sql`SELECT * FROM skills_section LIMIT 1`,
            sql`SELECT * FROM skills`,
            sql`SELECT * FROM projects`,
            sql`SELECT * FROM projects_section`,
            sql`SELECT * FROM contact_section LIMIT 1`,
            sql`SELECT * FROM about_traits LIMIT 1`,
            sql`SELECT id, project_id, name, icon FROM project_tech_stack`,
            sql`SELECT platform, url, icon FROM contact_socials`
        ])

        if (
            hero.length > 0 &&
            about.length > 0 &&
            skills.length > 0 &&
            projects.length > 0
        ) {
            const siteData = {
                siteName: 'Portfolio',
                siteDescription: 'Professional portfolio website',
                hero: {
                    id: hero[0].id,
                    title: hero[0].title,
                    name: hero[0].name,
                    subtitle: hero[0].subtitle,
                    description: hero[0].description,
                    ctaText: hero[0].cta_text,
                    secondaryCtaText: hero[0].secondary_cta_text,
                    resumeButtonText: hero[0].resume_button_text || 'Resume',
                    resumeLink: hero[0].resume_link || ''
                },
                about: {
                    id: about[0]?.id || '',
                    title: about[0]?.title || '',
                    subtitle: about[0]?.subtitle || '',
                    image: about[0]?.image || '',
                    traits: about_traits.map((trait: any) => ({
                        icon: trait.icon,
                        text: trait.text
                    })),
                    description: about_paragraphs.map(
                        (desc: any) => desc.paragraph
                    )
                },
                skills: {
                    id: skills_section[0].id,
                    title: skills_section[0].title,
                    subtitle: skills_section[0].subtitle,
                    skills: skills.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        icon: s.icon,
                        color: s.color
                    }))
                },
                projects: {
                    id: project_section[0].id,
                    title: project_section[0].title,
                    subtitle: project_section[0].subtitle,
                    projects: projects.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        image: p.image,
                        techStack: project_tech_stack
                            .filter((pts: any) => pts.project_id === p.id)
                            .map((pts: any) => ({
                                icon: pts.icon,
                                name: pts.name
                            })),
                        demoLink: p.demoLink,
                        githubLink: p.github_link,
                        featured: p.featured
                    }))
                },
                contact: {
                    id: contact[0].id,
                    title: contact[0].title,
                    email: contact[0].email,
                    subtitle: contact[0].subtitle,
                    location: contact[0].location,
                    socials: contact_socials.map((sc: any) => ({
                        platform: sc.platform,
                        url: sc.url,
                        icon: sc.icon
                    }))
                }
            }

            appCache.set(cacheKey, siteData)
            return siteData
        }
    } catch (error) {
        console.error('Error getting site data from PostgreSQL:', error)
    }

    try {
        if (fs.existsSync(siteDataPath)) {
            const data = fs.readFileSync(siteDataPath, 'utf8')
            const siteData = JSON.parse(data) as SiteConfig
            appCache.set(cacheKey, siteData)
            return siteData
        }
    } catch (error) {
        console.error('Error reading site data from file:', error)
    }

    const defaultData = getDefaultSiteData()
    appCache.set(cacheKey, defaultData)
    return defaultData
}

// Update site data with cache invalidation
async function updateSiteData(
    newData: SiteConfig
): Promise<ApiResponse<SiteConfig>> {
    try {
        // Update PostgreSQL
        try {
            await sql`
                UPDATE hero_section SET
                    title = ${newData.hero.title},
                    name = ${newData.hero.name},
                    subtitle = ${newData.hero.subtitle},
                    description = ${newData.hero.description},
                    cta_text = ${newData.hero.ctaText},
                    secondary_cta_text = ${newData.hero.secondaryCtaText},
                    resume_button_text = ${newData.hero.resumeButtonText},
                    resume_link = ${newData.hero.resumeLink}
                WHERE id = ${newData.hero.id}
            `
        } catch (error) {
            console.error('Error updating PostgreSQL:', error)
        }

        // Update file system
        fs.writeFileSync(siteDataPath, JSON.stringify(newData, null, 2))

        // Clear cache
        appCache.del('siteData')
        return { success: true, data: newData }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

// Update section with cache invalidation
async function updateSiteSection<T>(
    sectionKey: keyof SiteConfig,
    sectionData: T
): Promise<ApiResponse<T>> {
    try {
        const currentData = await getSiteData()
        const updatedData = { ...currentData, [sectionKey]: sectionData }

        // Update both database and file system
        fs.writeFileSync(siteDataPath, JSON.stringify(updatedData, null, 2))

        // Clear cache
        appCache.del('siteData')
        return { success: true, data: sectionData }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

// Get users with caching
async function getUsers(): Promise<User[]> {
    const cacheKey = 'users'
    const cachedUsers = appCache.get<User[]>(cacheKey)
    if (cachedUsers) return cachedUsers

    await initUsers()

    try {
        const result = await sql`SELECT * FROM users`
        if (result?.length > 0) {
            const users = result.map((user) => ({
                id: user.id,
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role
            }))
            appCache.set(cacheKey, users)
            return users
        }
    } catch (error) {
        console.error('Error getting users from PostgreSQL:', error)
    }

    try {
        const data = fs.readFileSync(usersPath, 'utf8')
        const users = JSON.parse(data) as User[]
        appCache.set(cacheKey, users)
        return users
    } catch (error) {
        console.error('Error reading users from file:', error)
        return []
    }
}

// Find user by username with caching
async function findUserByUsername(username: string): Promise<User | undefined> {
    const users = await getUsers() // Uses cached users
    return users.find((user) => user.username === username)
}

// Validate user credentials
async function validateUser(
    username: string,
    password: string
): Promise<User | null> {
    const user = await findUserByUsername(username)
    return user?.password === password ? user : null
}

// Utility function to clear all caches (for testing/dev)
function clearAllCaches(): void {
    appCache.flushAll()
}

export {
    getSiteData,
    initSiteData,
    initUsers,
    updateSiteData,
    updateSiteSection,
    getUsers,
    findUserByUsername,
    validateUser,
    clearAllCaches
}
