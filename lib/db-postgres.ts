import { sql } from './db-client'
import type {
    SiteConfig,
    HeroSection,
    AboutSection,
    SkillsSection,
    ProjectsSection,
    ContactSection,
    User,
    ApiResponse
} from './types'

// Get hero section data
export async function getHeroSection(): Promise<HeroSection | null> {
    try {
        const result = await sql`
      SELECT * FROM hero_section LIMIT 1
    `

        if (result.length === 0) {
            return null
        }

        const hero = result[0]
        return {
            id: hero.id,
            title: hero.title,
            name: hero.name,
            subtitle: hero.subtitle,
            description: hero.description,
            ctaText: hero.cta_text,
            secondaryCtaText: hero.secondary_cta_text,
            resumeButtonText: hero.resume_button_text || 'Resume',
            resumeLink: hero.resume_link || ''
        }
    } catch (error) {
        console.error('Error fetching hero section:', error)
        return null
    }
}

// Get about section data
export async function getAboutSection(): Promise<AboutSection | null> {
    try {
        // Get the main about section data
        const aboutResult = await sql`
      SELECT * FROM about_section LIMIT 1
    `

        if (aboutResult.length === 0) {
            return null
        }

        const about = aboutResult[0]

        // Get paragraphs
        const paragraphsResult = await sql`
      SELECT paragraph FROM about_paragraphs 
      WHERE about_id = ${about.id}
      ORDER BY display_order
    `

        const paragraphs = paragraphsResult.map((p) => p.paragraph)

        // Get traits
        const traitsResult = await sql`
      SELECT icon, text FROM about_traits
      WHERE about_id = ${about.id}
      ORDER BY display_order
    `

        const traits = traitsResult.map((t) => ({
            icon: t.icon,
            text: t.text
        }))

        return {
            id: about.id,
            title: about.title,
            subtitle: about.subtitle,
            description: paragraphs,
            image: about.image,
            traits
        }
    } catch (error) {
        console.error('Error fetching about section:', error)
        return null
    }
}

// Get skills section data
export async function getSkillsSection(): Promise<SkillsSection | null> {
    try {
        // Get the main skills section data
        const skillsSectionResult = await sql`
      SELECT * FROM skills_section LIMIT 1
    `

        if (skillsSectionResult.length === 0) {
            return null
        }

        const skillsSection = skillsSectionResult[0]

        // Get skills
        const skillsResult = await sql`
      SELECT id, name, icon, color FROM skills
      WHERE section_id = ${skillsSection.id}
      ORDER BY display_order
    `

        const skills = skillsResult.map((skill) => ({
            id: skill.id,
            name: skill.name,
            icon: skill.icon,
            color: skill.color
        }))

        return {
            id: skillsSection.id,
            title: skillsSection.title,
            subtitle: skillsSection.subtitle,
            skills
        }
    } catch (error) {
        console.error('Error fetching skills section:', error)
        return null
    }
}

// Get projects section data
export async function getProjectsSection(): Promise<ProjectsSection | null> {
    try {
        // Get the main projects section data
        const projectsSectionResult = await sql`
      SELECT * FROM projects_section LIMIT 1
    `

        if (projectsSectionResult.length === 0) {
            return null
        }

        const projectsSection = projectsSectionResult[0]

        // Get projects
        const projectsResult = await sql`
      SELECT id, title, description, image, demo_link, github_link, featured
      FROM projects
      WHERE section_id = ${projectsSection.id}
      ORDER BY display_order
    `

        const projects = await Promise.all(
            projectsResult.map(async (project) => {
                // Get tech stack for each project
                const techStackResult = await sql`
        SELECT name, icon FROM project_tech_stack
        WHERE project_id = ${project.id}
        ORDER BY display_order
      `

                const techStack = techStackResult.map((tech) => ({
                    name: tech.name,
                    icon: tech.icon
                }))

                return {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    image: project.image,
                    techStack,
                    demoLink: project.demo_link,
                    githubLink: project.github_link,
                    featured: project.featured
                }
            })
        )

        return {
            id: projectsSection.id,
            title: projectsSection.title,
            subtitle: projectsSection.subtitle,
            projects
        }
    } catch (error) {
        console.error('Error fetching projects section:', error)
        return null
    }
}

// Get contact section data
export async function getContactSection(): Promise<ContactSection | null> {
    try {
        // Get the main contact section data
        const contactSectionResult = await sql`
      SELECT * FROM contact_section LIMIT 1
    `

        if (contactSectionResult.length === 0) {
            return null
        }

        const contactSection = contactSectionResult[0]

        // Get social links
        const socialsResult = await sql`
      SELECT platform, url, icon FROM contact_socials
      WHERE contact_id = ${contactSection.id}
      ORDER BY display_order
    `

        const socials = socialsResult.map((social) => ({
            platform: social.platform,
            url: social.url,
            icon: social.icon
        }))

        return {
            id: contactSection.id,
            title: contactSection.title,
            subtitle: contactSection.subtitle,
            email: contactSection.email,
            location: contactSection.location,
            socials
        }
    } catch (error) {
        console.error('Error fetching contact section:', error)
        return null
    }
}

// Get all site data
export async function getSiteData(): Promise<SiteConfig> {
    try {
        const [hero, about, skills, projects, contact] = await Promise.all([
            getHeroSection(),
            getAboutSection(),
            getSkillsSection(),
            getProjectsSection(),
            getContactSection()
        ])

        // If any section is missing, throw an error
        if (!hero || !about || !skills || !projects || !contact) {
            throw new Error(
                'One or more sections are missing from the database'
            )
        }

        return {
            siteName: 'Portfolio',
            siteDescription: 'Professional portfolio website',
            hero,
            about,
            skills,
            projects,
            contact
        }
    } catch (error) {
        console.error('Error fetching site data:', error)
        // Return default site data in case of error
        return getDefaultSiteData()
    }
}

// Update hero section
export async function updateHeroSection(
    data: HeroSection
): Promise<ApiResponse<HeroSection>> {
    try {
        await sql`
      UPDATE hero_section
      SET 
        title = ${data.title},
        name = ${data.name},
        subtitle = ${data.subtitle},
        description = ${data.description},
        cta_text = ${data.ctaText},
        secondary_cta_text = ${data.secondaryCtaText},
        resume_button_text = ${data.resumeButtonText || 'Resume'},
        resume_link = ${data.resumeLink || ''}
      WHERE id = ${data.id}
    `

        return { success: true, data }
    } catch (error) {
        console.error('Error updating hero section:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Update about section
export async function updateAboutSection(
    data: AboutSection
): Promise<ApiResponse<AboutSection>> {
    try {
        // Update main about section
        await sql`
      UPDATE about_section
      SET 
        title = ${data.title},
        subtitle = ${data.subtitle},
        image = ${data.image}
      WHERE id = ${data.id}
    `

        // Delete existing paragraphs
        await sql`
      DELETE FROM about_paragraphs
      WHERE about_id = ${data.id}
    `

        // Insert new paragraphs
        for (let i = 0; i < data.description.length; i++) {
            await sql`
        INSERT INTO about_paragraphs (about_id, paragraph, display_order)
        VALUES (${data.id}, ${data.description[i]}, ${i})
      `
        }

        // Delete existing traits
        await sql`
      DELETE FROM about_traits
      WHERE about_id = ${data.id}
    `

        // Insert new traits
        for (let i = 0; i < data.traits.length; i++) {
            await sql`
        INSERT INTO about_traits (about_id, icon, text, display_order)
        VALUES (${data.id}, ${data.traits[i].icon}, ${data.traits[i].text}, ${i})
      `
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error updating about section:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Update skills section
export async function updateSkillsSection(
    data: SkillsSection
): Promise<ApiResponse<SkillsSection>> {
    try {
        // Update main skills section
        await sql`
      UPDATE skills_section
      SET 
        title = ${data.title},
        subtitle = ${data.subtitle}
      WHERE id = ${data.id}
    `

        // Delete existing skills
        await sql`
      DELETE FROM skills
      WHERE section_id = ${data.id}
    `

        // Insert new skills
        for (let i = 0; i < data.skills.length; i++) {
            const skill = data.skills[i]
            await sql`
        INSERT INTO skills (id, section_id, name, icon, color, display_order)
        VALUES (${skill.id}, ${data.id}, ${skill.name}, ${skill.icon}, ${skill.color}, ${i})
      `
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error updating skills section:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Update projects section
export async function updateProjectsSection(
    data: ProjectsSection
): Promise<ApiResponse<ProjectsSection>> {
    try {
        // Update main projects section
        await sql`
      UPDATE projects_section
      SET 
        title = ${data.title},
        subtitle = ${data.subtitle}
      WHERE id = ${data.id}
    `

        // Get existing project IDs
        const existingProjectsResult = await sql`
      SELECT id FROM projects
      WHERE section_id = ${data.id}
    `
        const existingProjectIds = new Set(
            existingProjectsResult.map((p: any) => p.id)
        )

        // Process each project
        for (let i = 0; i < data.projects.length; i++) {
            const project = data.projects[i]

            if (existingProjectIds.has(project.id)) {
                // Update existing project
                await sql`
          UPDATE projects
          SET 
            title = ${project.title},
            description = ${project.description},
            image = ${project.image},
            demo_link = ${project.demoLink},
            github_link = ${project.githubLink},
            featured = ${project.featured},
            display_order = ${i}
          WHERE id = ${project.id}
        `

                // Remove from set to track which ones to delete later
                existingProjectIds.delete(project.id)
            } else {
                // Insert new project
                await sql`
          INSERT INTO projects (id, section_id, title, description, image, demo_link, github_link, featured, display_order)
          VALUES (${project.id}, ${data.id}, ${project.title}, ${project.description}, ${project.image}, ${project.demoLink}, ${project.githubLink}, ${project.featured}, ${i})
        `
            }

            // Delete existing tech stack
            await sql`
          DELETE FROM project_tech_stack
          WHERE project_id = ${project.id}
        `

            // Insert new tech stack
            for (let j = 0; j < project.techStack.length; j++) {
                const tech = project.techStack[j]
                await sql`
          INSERT INTO project_tech_stack (project_id, name, icon, display_order)
          VALUES (${project.id}, ${tech.name}, ${tech.icon}, ${j})
        `
            }
        }

        // Delete projects that no longer exist
        for (const projectId of existingProjectIds) {
            await sql`
          DELETE FROM projects
          WHERE id = ${projectId}
        `
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error updating projects section:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Update contact section
export async function updateContactSection(
    data: ContactSection
): Promise<ApiResponse<ContactSection>> {
    try {
        // Update main contact section
        await sql`
      UPDATE contact_section
      SET 
        title = ${data.title},
        subtitle = ${data.subtitle},
        email = ${data.email},
        location = ${data.location}
      WHERE id = ${data.id}
    `

        // Delete existing socials
        await sql`
      DELETE FROM contact_socials
      WHERE contact_id = ${data.id}
    `

        // Insert new socials
        for (let i = 0; i < data.socials.length; i++) {
            const social = data.socials[i]
            await sql`
          INSERT INTO contact_socials (contact_id, platform, url, icon, display_order)
          VALUES (${data.id}, ${social.platform}, ${social.url}, ${social.icon}, ${i})
        `
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error updating contact section:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}

// Find user by username
export async function findUserByUsername(
    username: string
): Promise<User | undefined> {
    try {
        const result = await sql`
      SELECT * FROM users
      WHERE username = ${username}
      LIMIT 1
    `

        if (result.length === 0) {
            return undefined
        }

        const user = result[0]
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role
        }
    } catch (error) {
        console.error('Error finding user:', error)
        return undefined
    }
}

// Validate user credentials
export async function validateUser(
    username: string,
    password: string
): Promise<User | null> {
    try {
        const user = await findUserByUsername(username)

        if (user && user.password === password) {
            // In a real app, you'd use proper password hashing and comparison
            return user
        }

        return null
    } catch (error) {
        console.error('Error validating user:', error)
        return null
    }
}

// Default site data for fallback
function getDefaultSiteData(): SiteConfig {
    return {
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
            secondaryCtaText: 'View Projects',
            resumeButtonText: 'Resume',
            resumeLink: ''
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
}

// Update all site data
export async function updateSiteData(
    newData: SiteConfig
): Promise<ApiResponse<SiteConfig>> {
    try {
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
        resume_button_text = ${newData.hero.resumeButtonText || 'Resume'},
        resume_link = ${newData.hero.resumeLink || ''}
      WHERE id = ${newData.hero.id}
    `

        // Update about section
        await sql`
      UPDATE about_section
      SET 
        title = ${newData.about.title},
        subtitle = ${newData.about.subtitle},
        image = ${newData.about.image}
      WHERE id = ${newData.about.id}
    `

        // Delete existing about paragraphs
        await sql`
      DELETE FROM about_paragraphs
      WHERE about_id = ${newData.about.id}
    `

        // Insert new about paragraphs
        for (let i = 0; i < newData.about.description.length; i++) {
            await sql`
        INSERT INTO about_paragraphs (about_id, paragraph, display_order)
        VALUES (${newData.about.id}, ${newData.about.description[i]}, ${i})
      `
        }

        // Delete existing about traits
        await sql`
      DELETE FROM about_traits
      WHERE about_id = ${newData.about.id}
    `

        // Insert new about traits
        for (let i = 0; i < newData.about.traits.length; i++) {
            await sql`
        INSERT INTO about_traits (about_id, icon, text, display_order)
        VALUES (${newData.about.id}, ${newData.about.traits[i].icon}, ${newData.about.traits[i].text}, ${i})
      `
        }

        // Update skills section
        await sql`
      UPDATE skills_section
      SET 
        title = ${newData.skills.title},
        subtitle = ${newData.skills.subtitle}
      WHERE id = ${newData.skills.id}
    `

        // Delete existing skills
        await sql`
      DELETE FROM skills
      WHERE section_id = ${newData.skills.id}
    `

        // Insert new skills
        for (let i = 0; i < newData.skills.skills.length; i++) {
            const skill = newData.skills.skills[i]
            await sql`
        INSERT INTO skills (id, section_id, name, icon, color, display_order)
        VALUES (${skill.id}, ${newData.skills.id}, ${skill.name}, ${skill.icon}, ${skill.color}, ${i})
      `
        }

        // Update projects section
        await sql`
      UPDATE projects_section
      SET 
        title = ${newData.projects.title},
        subtitle = ${newData.projects.subtitle}
      WHERE id = ${newData.projects.id}
    `

        // Delete existing projects
        await sql`
      DELETE FROM projects
      WHERE section_id = ${newData.projects.id}
    `

        // Insert new projects
        for (let i = 0; i < newData.projects.projects.length; i++) {
            const project = newData.projects.projects[i]
            await sql`
        INSERT INTO projects (id, section_id, title, description, image, demo_link, github_link, featured, display_order)
        VALUES (${project.id}, ${newData.projects.id}, ${project.title}, ${project.description}, ${project.image}, ${project.demoLink}, ${project.githubLink}, ${project.featured}, ${i})
      `

            // Delete existing project tech stack
            await sql`
        DELETE FROM project_tech_stack
        WHERE project_id = ${project.id}
      `

            // Insert new project tech stack
            for (let j = 0; j < project.techStack.length; j++) {
                const tech = project.techStack[j]
                await sql`
          INSERT INTO project_tech_stack (project_id, name, icon, display_order)
          VALUES (${project.id}, ${tech.name}, ${tech.icon}, ${j})
        `
            }
        }

        // Update contact section
        await sql`
      UPDATE contact_section
      SET 
        title = ${newData.contact.title},
        subtitle = ${newData.contact.subtitle},
        email = ${newData.contact.email},
        location = ${newData.contact.location}
      WHERE id = ${newData.contact.id}
    `

        // Delete existing contact socials
        await sql`
      DELETE FROM contact_socials
      WHERE contact_id = ${newData.contact.id}
    `

        // Insert new contact socials
        for (let i = 0; i < newData.contact.socials.length; i++) {
            const social = newData.contact.socials[i]
            await sql`
          INSERT INTO contact_socials (contact_id, platform, url, icon, display_order)
          VALUES (${newData.contact.id}, ${social.platform}, ${social.url}, ${social.icon}, ${i})
        `
        }

        return { success: true, data: newData }
    } catch (error) {
        console.error('Error updating site data:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
        }
    }
}
