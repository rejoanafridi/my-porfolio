import { sql } from './db-client'

export async function initDatabaseSchema() {
    try {
        console.log('Checking database schema...')

        // Check if tables exist
        const tablesExist = await checkTablesExist()

        if (tablesExist) {
            console.log('Database schema already exists.')
            return
        }

        console.log('Creating database schema...')

        // Create tables
        await createTables()

        console.log('Database schema created successfully!')
    } catch (error) {
        console.error('Error initializing database schema:', error)
        throw error
    }
}

async function checkTablesExist(): Promise<boolean> {
    try {
        // Check if hero_section table exists
        const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hero_section'
      )
    `
        return result[0]?.exists || false
    } catch (error) {
        console.error('Error checking if tables exist:', error)
        return false
    }
}

async function createTables() {
    // Create users table
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    )
  `

    // Create hero_section table
    await sql`
    CREATE TABLE IF NOT EXISTS hero_section (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cta_text VARCHAR(255) NOT NULL,
      secondary_cta_text VARCHAR(255) NOT NULL,
      resume_button_text VARCHAR(255) DEFAULT 'Resume',
      resume_link VARCHAR(255) DEFAULT ''
    )
  `

    // Create about_section table
    await sql`
    CREATE TABLE IF NOT EXISTS about_section (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL
    )
  `

    // Create about_paragraphs table
    await sql`
    CREATE TABLE IF NOT EXISTS about_paragraphs (
      id SERIAL PRIMARY KEY,
      about_id VARCHAR(50) NOT NULL,
      paragraph TEXT NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (about_id) REFERENCES about_section(id) ON DELETE CASCADE
    )
  `

  
    // Create about_traits table
    await sql`
    CREATE TABLE IF NOT EXISTS about_traits (
      id SERIAL PRIMARY KEY,
      about_id VARCHAR(50) NOT NULL,
      icon VARCHAR(255) NOT NULL,
      text VARCHAR(255) NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (about_id) REFERENCES about_section(id) ON DELETE CASCADE
    )
  `

    // Create skills_section table
    await sql`
    CREATE TABLE IF NOT EXISTS skills_section (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL
    )
  `


    // Create skills table
    await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id VARCHAR(50) PRIMARY KEY,
      section_id VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255) NOT NULL,
      color VARCHAR(255) NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (section_id) REFERENCES skills_section(id) ON DELETE CASCADE
    )
  `

    // Create projects_section table
    await sql`
    CREATE TABLE IF NOT EXISTS projects_section (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL
    )
  `

    // Create projects table
    await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(50) PRIMARY KEY,
      section_id VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(255) NOT NULL,
      demo_link VARCHAR(255) NOT NULL,
      github_link VARCHAR(255) NOT NULL,
      featured BOOLEAN NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (section_id) REFERENCES projects_section(id) ON DELETE CASCADE
    )
  `

    // Create project_tech_stack table
    await sql`
    CREATE TABLE IF NOT EXISTS project_tech_stack (
      id SERIAL PRIMARY KEY,
      project_id VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255) NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `

    // Create contact_section table
    await sql`
    CREATE TABLE IF NOT EXISTS contact_section (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL
    )
  `

    // Create contact_socials table
    await sql`
    CREATE TABLE IF NOT EXISTS contact_socials (
      id SERIAL PRIMARY KEY,
      contact_id VARCHAR(50) NOT NULL,
      platform VARCHAR(255) NOT NULL,
      url VARCHAR(255) NOT NULL,
      icon VARCHAR(255) NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (contact_id) REFERENCES contact_section(id) ON DELETE CASCADE
    )
  `

await sql`
CREATE TABLE IF NOT EXISTS site_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`


}
