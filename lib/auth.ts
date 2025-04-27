import { cookies } from 'next/headers'
import { validateUser as dbValidateUser } from './db-postgres'
import type { User } from './types'
import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

// Secret key for JWT signing - in production, use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || 'your-secret-key-at-least-32-chars-long'
)

// JWT expiration time (24 hours)
const EXPIRATION_TIME = '24h'

// Generate JWT token
export async function generateToken(user: User): Promise<string> {
    const token = await new SignJWT({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(EXPIRATION_TIME)
        .sign(JWT_SECRET)

    return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch (error) {
        return null
    }
}

// Login user and set cookie
export async function loginUser(
    username: string,
    password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        // Get cookies before any async operations
        const cookieStore = await cookies()

        const user = await dbValidateUser(username, password)

        if (!user) {
            return { success: false, error: 'Invalid username or password' }
        }

        const token = await generateToken(user)

        // Set cookie with secure options
        cookieStore.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'strict'
        })

        return { success: true, user }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: 'An error occurred during login' }
    }
}

// Logout user
export async function logoutUser(): void {
    // Get cookies before any async operations
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
}

// Get current user from request
export async function getCurrentUser(): Promise<User | null> {
    // Get cookies before any async operations
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
        return null
    }

    const payload = await verifyToken(token)

    if (!payload) {
        return null
    }

    return {
        id: payload.id,
        username: payload.username,
        name: payload.name,
        role: payload.role,
        password: '' // We don't want to expose the password
    }
}

// Check if user is admin
export async function isAdmin(req: NextRequest): Promise<boolean> {
    const token = req.cookies.get('auth-token')?.value

    if (!token) {
        return false
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload.role === 'admin'
    } catch (error) {
        return false
    }
}
