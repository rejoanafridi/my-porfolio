import type React from 'react'
import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/sidebar'

export const metadata: Metadata = {
    title: 'Admin Dashboard | Portfolio',
    description: 'Admin dashboard for portfolio website'
}

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    // Check if user is authenticated

    return (
        <div className="flex min-h-screen bg-muted/30">
            <AdminSidebar />
            <div className="flex-1 p-8">{children}</div>
        </div>
    )
}
