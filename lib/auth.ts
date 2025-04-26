'use server'
import { cookies } from 'next/headers'
import { validateUser } from './db-server'
import type { User } from './types'
import { SignJWT, jwtVerify } from 'jose'

// Secret key for JWT signing - in production, use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode('your-secret-key')

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
    const user = validateUser(username, password)

    if (!user) {
        return { success: false, error: 'Invalid username or password' }
    }

    const token = await generateToken(user)

    // Set cookie
    await (await cookies()).set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'strict'
    })

    return { success: true, user }
}

// Logout user
export async function logoutUser(): void {
    await (await cookies()).delete('auth-token')
}

// Get current user from request
export async function getCurrentUser(): Promise<User | null> {
    const token = (await cookies())?.get('auth-token')?.value

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

// Middleware to protect routes
export async function isAuthenticated(req: Request): Promise<boolean> {
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((cookie) => {
            const [name, value] = cookie.split('=')
            return [name, value]
        })
    )

    const token = cookies['auth-token']

    if (!token) {
        return false
    }

    const payload = await verifyToken(token)
    return !!payload
}

// Check if user is admin
export async function isAdmin(req: Request): Promise<boolean> {
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((cookie) => {
            const [name, value] = cookie.split('=')
            return [name, value]
        })
    )

    const token = cookies['auth-token']

    if (!token) {
        return false
    }

    const payload = await verifyToken(token)
    return payload?.role === 'admin'
}
