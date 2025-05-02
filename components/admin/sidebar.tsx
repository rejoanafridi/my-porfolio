'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Home,
    User,
    Code,
    FolderKanban,
    Mail,
    LogOut,
    Menu,
    X,
    Settings,
    Layout
} from 'lucide-react'
import { useState } from 'react'

const AdminSidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <Home size={18} /> },
        { name: 'Hero Section', path: '/admin/hero', icon: <Home size={18} /> },
        {
            name: 'About Section',
            path: '/admin/about',
            icon: <User size={18} />
        },
        {
            name: 'Skills Section',
            path: '/admin/skills',
            icon: <Code size={18} />
        },
        {
            name: 'Projects Section',
            path: '/admin/projects',
            icon: <FolderKanban size={18} />
        },
        {
            name: 'Contact Section',
            path: '/admin/contact',
            icon: <Mail size={18} />
        },
        {
            name: 'Theme Settings',
            path: '/admin/settings',
            icon: <Settings size={18} />
        },
        {
            name: 'Layout Settings',
            path: '/admin/layout',
            icon: <Layout size={18} />
        }
    ]

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            })

            router.push('/admin/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <>
            {/* Mobile menu toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                    item.path === pathname
                                        ? 'bg-purple-500 text-primary-foreground text-white'
                                        : 'hover:bg-muted'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} className="mr-2" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}

export default AdminSidebar
