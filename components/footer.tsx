'use client'
import { useLayout } from '@/contexts/layout-context'
import { getIconByName } from '@/lib/icon-map'
import { motion } from 'framer-motion'
import {} from 'lucide-react'

interface FooterProps {
    themeVariant?: string
}

const Footer = ({ themeVariant = 'default' }: FooterProps) => {
    const { siteConfig, siteData } = useLayout()
    const currentYear = new Date().getFullYear()

    const { copyrightText, footerText } = siteConfig?.config ?? {}

    // Theme-specific footer styles
    const getFooterStyles = () => {
        switch (themeVariant) {
            case 'minimal':
                return 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50'
            case 'creative':
                return 'border-amber-200 dark:border-amber-800 bg-amber-100/30 dark:bg-amber-900/30'
            default:
                return 'border-border/40 bg-muted/30'
        }
    }

    return (
        <footer className={`py-8 border-t ${getFooterStyles()}`}>
            <div className="container px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 md:mb-0"
                    >
                        <p className="text-sm text-muted-foreground flex items-center">
                            &copy; {currentYear} {copyrightText} {footerText}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex space-x-4"
                    >
                        {siteData?.contact?.socials.map((social: any) => (
                            <a
                                key={social?.platform}
                                href={social?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors"
                                aria-label={social?.platform}
                            >
                                {getIconByName(social.icon, 18)}
                            </a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
