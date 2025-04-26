import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { getSiteData } from '@/lib/db'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import LoginPage from './login/page'

export default async function AdminDashboard() {
    const siteData = getSiteData()
    // const router = useRouter()

    const sections = [
        { name: 'Hero', path: '/admin/hero', count: 1 },
        { name: 'About', path: '/admin/about', count: 1 },
        {
            name: 'Skills',
            path: '/admin/skills',
            count: siteData?.skills?.skills.length
        },
        {
            name: 'Projects',
            path: '/admin/projects',
            count: siteData?.projects?.projects.length
        },
        { name: 'Contact', path: '/admin/contact', count: 1 }
    ]
    console.log('siteData', siteData)
    const user = await getCurrentUser()
    if (!user) {
        return <LoginPage />
    }
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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
