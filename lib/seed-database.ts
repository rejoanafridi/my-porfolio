import { sql } from "./db-client"
import { getDefaultSiteData } from "./db"

export async function seedDatabase() {
  try {
    console.log("Seeding database...")

    // Check if data already exists
    const heroExists = await sql`SELECT COUNT(*) FROM hero_section`
    if (Number.parseInt(heroExists[0].count) > 0) {
      console.log("Database already seeded. Skipping...")
      return
    }

    const defaultData = getDefaultSiteData()

    // Insert admin user - don't specify the ID, let PostgreSQL auto-generate it
    await sql`
      INSERT INTO users (username, password, name, role)
      VALUES ('admin', 'admin123', 'Admin User', 'admin')
    `

    // Insert hero section
    await sql`
      INSERT INTO hero_section (id, title, name, subtitle, description, cta_text, secondary_cta_text)
      VALUES (
        ${defaultData.hero.id},
        ${defaultData.hero.title},
        ${defaultData.hero.name},
        ${defaultData.hero.subtitle},
        ${defaultData.hero.description},
        ${defaultData.hero.ctaText},
        ${defaultData.hero.secondaryCtaText}
      )
    `

    // Insert about section
    await sql`
      INSERT INTO about_section (id, title, subtitle, image)
      VALUES (
        ${defaultData.about.id},
        ${defaultData.about.title},
        ${defaultData.about.subtitle},
        ${defaultData.about.image}
      )
    `

    // Insert about paragraphs
    for (let i = 0; i < defaultData.about.description.length; i++) {
      await sql`
        INSERT INTO about_paragraphs (about_id, paragraph, display_order)
        VALUES (${defaultData.about.id}, ${defaultData.about.description[i]}, ${i})
      `
    }

    // Insert about traits
    for (let i = 0; i < defaultData.about.traits.length; i++) {
      await sql`
        INSERT INTO about_traits (about_id, icon, text, display_order)
        VALUES (
          ${defaultData.about.id},
          ${defaultData.about.traits[i].icon},
          ${defaultData.about.traits[i].text},
          ${i}
        )
      `
    }

    // Insert skills section
    await sql`
      INSERT INTO skills_section (id, title, subtitle)
      VALUES (
        ${defaultData.skills.id},
        ${defaultData.skills.title},
        ${defaultData.skills.subtitle}
      )
    `

    // Insert skills
    for (let i = 0; i < defaultData.skills.skills.length; i++) {
      const skill = defaultData.skills.skills[i]
      await sql`
        INSERT INTO skills (id, section_id, name, icon, color, display_order)
        VALUES (
          ${skill.id},
          ${defaultData.skills.id},
          ${skill.name},
          ${skill.icon},
          ${skill.color},
          ${i}
        )
      `
    }

    // Insert projects section
    await sql`
      INSERT INTO projects_section (id, title, subtitle)
      VALUES (
        ${defaultData.projects.id},
        ${defaultData.projects.title},
        ${defaultData.projects.subtitle}
      )
    `

    // Insert projects
    for (let i = 0; i < defaultData.projects.projects.length; i++) {
      const project = defaultData.projects.projects[i]
      await sql`
        INSERT INTO projects (id, section_id, title, description, image, demo_link, github_link, featured, display_order)
        VALUES (
          ${project.id},
          ${defaultData.projects.id},
          ${project.title},
          ${project.description},
          ${project.image},
          ${project.demoLink},
          ${project.githubLink},
          ${project.featured},
          ${i}
        )
      `

      // Insert project tech stack
      for (let j = 0; j < project.techStack.length; j++) {
        const tech = project.techStack[j]
        await sql`
          INSERT INTO project_tech_stack (project_id, name, icon, display_order)
          VALUES (${project.id}, ${tech.name}, ${tech.icon}, ${j})
        `
      }
    }

    // Insert contact section
    await sql`
      INSERT INTO contact_section (id, title, subtitle, email, location)
      VALUES (
        ${defaultData.contact.id},
        ${defaultData.contact.title},
        ${defaultData.contact.subtitle},
        ${defaultData.contact.email},
        ${defaultData.contact.location}
      )
    `

    // Insert contact socials
    for (let i = 0; i < defaultData.contact.socials.length; i++) {
      const social = defaultData.contact.socials[i]
      await sql`
        INSERT INTO contact_socials (contact_id, platform, url, icon, display_order)
        VALUES (
          ${defaultData.contact.id},
          ${social.platform},
          ${social.url},
          ${social.icon},
          ${i}
        )
      `
    }

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
