import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { getSiteData } from '@/lib/db-postgres'
import Link from 'next/link'
import { ArrowRight, Settings, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
    const siteData = await getSiteData()

    const sections = [
        { name: 'Hero', path: '/admin/hero', count: 1 },
        { name: 'About', path: '/admin/about', count: 1 },
        {
            name: 'Skills',
            path: '/admin/skills',
            count: siteData.skills.skills.length
        },
        {
            name: 'Projects',
            path: '/admin/projects',
            count: siteData.projects.projects.length
        },
        { name: 'Contact', path: '/admin/contact', count: 1 }
    ]

    return (
        <div>
            <div className="flex justify-center md:justify-between flex-wrap  items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <Link href="/admin/settings">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Settings size={16} />
                            <span>Theme Settings</span>
                        </Button>
                    </Link>
                    <Link href="/admin/layout">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Layout size={16} />
                            <span>Layout Settings</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Toast testing section */}
            {/* <div className="mb-8 p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-3">
                    Toast Notification Test
                </h2>
                <ToastTest />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Link href={section.path} key={section.name}>
                        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle>{section.name}</CardTitle>
                                <CardDescription>
                                    {section.count}{' '}
                                    {section.count === 1 ? 'item' : 'items'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <span>Edit {section.name}</span>
                                <ArrowRight size={16} />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
