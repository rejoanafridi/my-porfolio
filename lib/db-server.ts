import fs from 'fs'
import path from 'path'
import type { SiteConfig, User, ApiResponse } from './types'
import { sql } from './db-client'
import { seedDatabase } from './seed-database'
import { getDefaultSiteData } from './db'

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
    // Initialize filesystem data storage
    ensureDataDir()

    if (!fs.existsSync(siteDataPath)) {
        const defaultData: SiteConfig = getDefaultSiteData()
        // Add missing fields required by HeroSection interface
        defaultData.hero.resumeButtonText = 'Resume'
        defaultData.hero.resumeLink = ''

        fs.writeFileSync(siteDataPath, JSON.stringify(defaultData, null, 2))
    }

    // Initialize PostgreSQL data storage if it's empty
    try {
        // Check if PostgreSQL table exists and is empty
        const dbCheck = await sql`SELECT COUNT(*) FROM hero_section`
        if (Number(dbCheck[0]?.count) === 0) {
            console.log(
                'No data found in PostgreSQL database. Initializing with default data...'
            )
            await seedDatabase()
        }
    } catch (error) {
        console.error('Error checking PostgreSQL database:', error)
        // If tables don't exist yet, this will error. The application should handle schema creation elsewhere.
    }
}

// Initialize default users if they don't exist
async function initUsers(): Promise<void> {
    // Initialize filesystem data storage
    ensureDataDir()

    if (!fs.existsSync(usersPath)) {
        const defaultUsers: User[] = [
            {
                id: 'admin-1',
                username: 'admin',
                // This is just a placeholder - in a real app, you'd use a hashed password
                password: 'admin123',
                name: 'Admin User',
                role: 'admin'
            }
        ]

        fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2))
    }

    // Initialize PostgreSQL users if empty
    try {
        const dbCheck = await sql`SELECT COUNT(*) FROM users`
        if (Number(dbCheck[0]?.count) === 0) {
            console.log(
                'No users found in PostgreSQL database. Adding default admin user...'
            )
            await sql`
        INSERT INTO users (username, password, name, role)
        VALUES ('admin', 'admin123', 'Admin User', 'admin')
      `
        }
    } catch (error) {
        console.error('Error checking PostgreSQL users table:', error)
        // If tables don't exist yet, this will error. The application should handle schema creation elsewhere.
    }
}

// Get site data
async function getSiteData(): Promise<SiteConfig> {
    await initSiteData()

    try {
        // Try to get data from PostgreSQL first
        const result = await sql`SELECT COUNT(*) FROM hero_section`
        if (Number(result[0]?.count) > 0) {
            // If PostgreSQL has data, use the db-postgres implementation
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
                sql`SELECT id, project_id, name, icon  FROM project_tech_stack`,
                sql`SELECT platform, url, icon  FROM contact_socials`
            ])

            // Check if we have all the required data
            if (
                hero.length > 0 &&
                about.length > 0 &&
                skills.length > 0 &&
                projects.length > 0 &&
                contact.length > 0
            ) {
                // Get additional data for complete sections (just an example for hero)
                // In a real implementation, you would get all related data
                const heroData = hero[0]

                return {
                    siteName: 'Portfolio',
                    siteDescription: 'Professional portfolio website',
                    hero: {
                        id: heroData.id,
                        title: heroData.title,
                        name: heroData.name,
                        subtitle: heroData.subtitle,
                        description: heroData.description,
                        ctaText: heroData.cta_text,
                        secondaryCtaText: heroData.secondary_cta_text,
                        resumeButtonText:
                            heroData.resume_button_text || 'Resume',
                        resumeLink: heroData.resume_link || ''
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
                            (desc) => desc.paragraph
                        )
                    },
                    skills: {
                        id: skills_section[0].id,
                        title: skills_section[0].title,
                        subtitle: skills_section[0].subtitle,
                        skills: skills.map((s) => {
                            return {
                                id: s?.id,
                                name: s?.name,
                                icon: s?.icon,
                                color: s?.color
                            }
                        })
                    },
                    projects: {
                        id: project_section[0].id,
                        title: project_section[0].title,
                        subtitle: project_section[0].subtitle,
                        projects: projects.map((p) => {
                            return {
                                id: p.id,
                                title: p.title,
                                description: p.description,
                                image: p.image,
                                techStack: project_tech_stack
                                    .filter((pts) => pts.project_id === p.id)
                                    .map((pts) => ({
                                        icon: pts.icon,
                                        name: pts.name
                                    })),
                                demoLink: p.demoLink,
                                githubLink: p.github_link,
                                featured: p.featured
                            }
                        })
                    },
                    contact: {
                        id: contact[0].id,
                        title: contact[0].title,
                        email: contact[0].email,
                        subtitle: contact[0].subtitle,
                        location: contact[0].location,
                        socials: contact_socials.map((sc) => {
                            return {
                                platform: sc.platform,
                                url: sc.url,
                                icon: sc.icon
                            }
                        })
                    }
                }
            }
        }

        // Fallback to file system if PostgreSQL failed or incomplete
        if (fs.existsSync(siteDataPath)) {
            const data = fs.readFileSync(siteDataPath, 'utf8')
            return JSON.parse(data) as SiteConfig
        }

        return getDefaultSiteData()
    } catch (error) {
        console.error('Error getting site data from PostgreSQL:', error)

        // Fallback to file system
        if (fs.existsSync(siteDataPath)) {
            const data = fs.readFileSync(siteDataPath, 'utf8')
            return JSON.parse(data) as SiteConfig
        }

        return getDefaultSiteData()
    }
}

// Update site data
async function updateSiteData(
    newData: SiteConfig
): Promise<ApiResponse<SiteConfig>> {
    try {
        // Update in PostgreSQL first
        try {
            // Use a simpler approach without transaction
            // Update hero section
            await sql`
          UPDATE hero_section
          SET 
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

            // In a complete implementation, you would update all sections
            // This is just a simplified example
        } catch (error) {
            console.error('Error updating site data in PostgreSQL:', error)
            // Continue to update file system even if PostgreSQL fails
        }

        // Update in file system
        fs.writeFileSync(siteDataPath, JSON.stringify(newData, null, 2))
        return { success: true, data: newData }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Update a specific section of site data
async function updateSiteSection<T>(
    sectionKey: keyof SiteConfig,
    sectionData: T
): Promise<ApiResponse<T>> {
    try {
        // For a complete implementation, you would need to update both PostgreSQL and file system
        // This is just a simplified example
        const currentData = await getSiteData()
        const updatedData = {
            ...currentData,
            [sectionKey]: sectionData
        }

        fs.writeFileSync(siteDataPath, JSON.stringify(updatedData, null, 2))
        return { success: true, data: sectionData }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Get users
async function getUsers(): Promise<User[]> {
    await initUsers()

    try {
        // Try to get from PostgreSQL first
        const result = await sql`SELECT * FROM users`
        if (result && result.length > 0) {
            return result.map((user) => ({
                id: user.id,
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role
            }))
        }
    } catch (error) {
        console.error('Error getting users from PostgreSQL:', error)
        // Fall back to file system
    }

    // Fallback to file system
    const data = fs.readFileSync(usersPath, 'utf8')
    return JSON.parse(data) as User[]
}

// Find user by username
async function findUserByUsername(username: string): Promise<User | undefined> {
    try {
        // Try PostgreSQL first
        const result = await sql`
      SELECT * FROM users
      WHERE username = ${username}
      LIMIT 1
    `

        if (result && result.length > 0) {
            const user = result[0]
            return {
                id: user.id,
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role
            }
        }
    } catch (error) {
        console.error('Error finding user in PostgreSQL:', error)
        // Fall back to file system
    }

    // Fallback to file system
    const users = await getUsers()
    return users.find((user) => user.username === username)
}

// Validate user credentials
async function validateUser(
    username: string,
    password: string
): Promise<User | null> {
    const user = await findUserByUsername(username)
    if (user && user.password === password) {
        // In a real app, you'd use proper password hashing and comparison
        return user
    }
    return null
}

// Export all functions
export {
    getSiteData,
    initSiteData,
    initUsers,
    updateSiteData,
    updateSiteSection,
    getUsers,
    findUserByUsername,
    validateUser
}
