import { initDatabaseSchema } from './init-database'
import { initSiteData, initUsers } from './db-server'

export async function initializeApp() {
    try {
        console.log('Initializing application...')

        // Initialize database schema
        await initDatabaseSchema()

        // Initialize site data
        await initSiteData()

        // Initialize users
        await initUsers()

        console.log('Application initialized successfully!')
    } catch (error) {
        console.error('Error initializing application:', error)
        console.error(
            'Application will fall back to file system mode if needed'
        )
    }
}
