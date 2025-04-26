import fs from 'fs'
import path from 'path'
import type { SiteConfig, User, ApiResponse } from './types'

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
function initSiteData(): void {
    ensureDataDir()

    if (!fs.existsSync(siteDataPath)) {
        const defaultData: SiteConfig = {
            siteName: 'Portfolio',
            siteDescription: 'Professional portfolio website',
            hero: {
                id: 'hero',
                title: 'Software Engineer',
                name: 'John Doe',
                subtitle: 'Crafting Digital Experiences',
                description:
                    'Building elegant solutions to complex problems with clean, efficient code and a focus on user experience.',
                ctaText: 'Get in Touch',
                secondaryCtaText: 'View Projects'
            },
            about: {
                id: 'about',
                title: 'About Me',
                subtitle: 'My Journey & Expertise',
                description: [
                    "I'm a passionate software engineer with over 3 years of experience building web applications and services. I specialize in JavaScript/TypeScript, React, Node.js, and cloud technologies.",
                    "My approach to software development focuses on creating clean, maintainable code that solves real-world problems. I'm constantly learning new technologies and methodologies to improve my craft.",
                    "When I'm not coding, you can find me hiking, reading tech blogs, or contributing to open-source projects. I believe in the power of technology to transform lives and businesses."
                ],
                image: '/placeholder.svg?height=256&width=256',
                traits: [
                    { icon: 'Code', text: 'Clean Code' },
                    { icon: 'Lightbulb', text: 'Problem Solver' },
                    { icon: 'Globe', text: 'Web Expert' },
                    { icon: 'Rocket', text: 'Fast Learner' },
                    { icon: 'Coffee', text: 'Team Player' }
                ]
            },
            skills: {
                id: 'skills',
                title: 'Skills',
                subtitle: 'Technical Expertise',
                skills: [
                    {
                        id: 'js',
                        name: 'JavaScript',
                        icon: 'Code',
                        color: 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400'
                    },
                    {
                        id: 'ts',
                        name: 'TypeScript',
                        icon: 'Code',
                        color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                    },
                    {
                        id: 'react',
                        name: 'React',
                        icon: 'Code',
                        color: 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400'
                    },
                    {
                        id: 'nextjs',
                        name: 'Next.js',
                        icon: 'Globe',
                        color: 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    },
                    {
                        id: 'nodejs',
                        name: 'Node.js',
                        icon: 'Server',
                        color: 'bg-green-500/10 text-green-500 dark:text-green-400'
                    },
                    {
                        id: 'python',
                        name: 'Python',
                        icon: 'Terminal',
                        color: 'bg-yellow-600/10 text-yellow-600 dark:text-yellow-500'
                    },
                    {
                        id: 'sql',
                        name: 'SQL',
                        icon: 'Database',
                        color: 'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                    },
                    {
                        id: 'graphql',
                        name: 'GraphQL',
                        icon: 'Database',
                        color: 'bg-pink-500/10 text-pink-500 dark:text-pink-400'
                    },
                    {
                        id: 'git',
                        name: 'Git',
                        icon: 'GitBranch',
                        color: 'bg-red-500/10 text-red-500 dark:text-red-400'
                    },
                    {
                        id: 'docker',
                        name: 'Docker',
                        icon: 'Layers',
                        color: 'bg-blue-600/10 text-blue-600 dark:text-blue-500'
                    },
                    {
                        id: 'aws',
                        name: 'AWS',
                        icon: 'Cloud',
                        color: 'bg-orange-600/10 text-orange-600 dark:text-orange-500'
                    },
                    {
                        id: 'uiux',
                        name: 'UI/UX',
                        icon: 'Figma',
                        color: 'bg-purple-500/10 text-purple-500 dark:text-purple-400'
                    }
                ]
            },
            projects: {
                id: 'projects',
                title: 'Projects',
                subtitle: 'Featured Work',
                projects: [
                    {
                        id: 'ecommerce',
                        title: 'E-Commerce Platform',
                        description:
                            'A full-featured e-commerce platform with product listings, cart functionality, and payment processing.',
                        image: '/placeholder.svg?height=200&width=400',
                        techStack: [
                            { name: 'React', icon: 'Code' },
                            { name: 'Node.js', icon: 'Server' },
                            { name: 'MongoDB', icon: 'Database' },
                            { name: 'Stripe', icon: 'CreditCard' }
                        ],
                        demoLink: 'https://example.com',
                        githubLink: 'https://github.com',
                        featured: true
                    },
                    {
                        id: 'task-manager',
                        title: 'Task Management App',
                        description:
                            'A collaborative task management application with real-time updates and team workspaces.',
                        image: '/placeholder.svg?height=200&width=400',
                        techStack: [
                            { name: 'Next.js', icon: 'Globe' },
                            { name: 'TypeScript', icon: 'Code' },
                            { name: 'Prisma', icon: 'Database' },
                            { name: 'PostgreSQL', icon: 'Database' }
                        ],
                        demoLink: 'https://example.com',
                        githubLink: 'https://github.com',
                        featured: true
                    },
                    {
                        id: 'weather-dashboard',
                        title: 'Weather Dashboard',
                        description:
                            'A weather dashboard that displays current conditions and forecasts for multiple locations.',
                        image: '/placeholder.svg?height=200&width=400',
                        techStack: [
                            { name: 'React', icon: 'Code' },
                            { name: 'Redux', icon: 'Code' },
                            { name: 'Weather API', icon: 'Cloud' },
                            { name: 'Chart.js', icon: 'BarChart' }
                        ],
                        demoLink: 'https://example.com',
                        githubLink: 'https://github.com',
                        featured: true
                    },
                    {
                        id: 'finance-tracker',
                        title: 'Personal Finance Tracker',
                        description:
                            'An application to track expenses, income, and financial goals with visualization tools.',
                        image: '/placeholder.svg?height=200&width=400',
                        techStack: [
                            { name: 'Vue.js', icon: 'Code' },
                            { name: 'Firebase', icon: 'Database' },
                            { name: 'D3.js', icon: 'PieChart' },
                            { name: 'Tailwind CSS', icon: 'Palette' }
                        ],
                        demoLink: 'https://example.com',
                        githubLink: 'https://github.com',
                        featured: true
                    }
                ]
            },
            contact: {
                id: 'contact',
                title: 'Contact',
                subtitle: 'Get In Touch',
                email: 'contact@example.com',
                location: 'San Francisco, CA',
                socials: [
                    {
                        platform: 'GitHub',
                        url: 'https://github.com',
                        icon: 'Github'
                    },
                    {
                        platform: 'LinkedIn',
                        url: 'https://linkedin.com',
                        icon: 'Linkedin'
                    },
                    {
                        platform: 'Twitter',
                        url: 'https://twitter.com',
                        icon: 'Twitter'
                    }
                ]
            }
        }

        fs.writeFileSync(siteDataPath, JSON.stringify(defaultData, null, 2))
    }
}

// Initialize default users if they don't exist
function initUsers(): void {
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
}

// Get site data
function getSiteData(): SiteConfig {
    initSiteData()

    if (!fs.existsSync(siteDataPath)) {
        initSiteData()
    }

    const data = fs.readFileSync(siteDataPath, 'utf8')
    return JSON.parse(data) as SiteConfig
}

// Update site data
function updateSiteData(newData: SiteConfig): ApiResponse<SiteConfig> {
    try {
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
function updateSiteSection<T>(
    sectionKey: keyof SiteConfig,
    sectionData: T
): ApiResponse<T> {
    try {
        const currentData = getSiteData()
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
function getUsers(): User[] {
    initUsers()
    const data = fs.readFileSync(usersPath, 'utf8')
    return JSON.parse(data) as User[]
}

// Find user by username
function findUserByUsername(username: string): User | undefined {
    const users = getUsers()
    return users.find((user) => user.username === username)
}

// Validate user credentials
function validateUser(username: string, password: string): User | null {
    const user = findUserByUsername(username)
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
