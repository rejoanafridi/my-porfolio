'use client'
import { useLayout } from '@/contexts/layout-context'
import { getIconByName } from '@/lib/icon-map'
import { motion } from 'framer-motion'

const CreativeFooter = () => {
    const { siteConfig, siteData } = useLayout()
    const currentYear = new Date().getFullYear()
    const { copyrightText, footerText } = siteConfig?.config ?? {}
    return (
        <footer className="py-8 border-t border-amber-900/30 bg-black/50">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 md:mb-0"
                    >
                        <p className="text-sm text-gray-400 flex items-center">
                            &copy; {currentYear} {copyrightText} {footerText}{' '}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex space-x-4"
                    >
                        {siteData?.contact?.socials?.map((social: any) => (
                            <a
                                key={social?.platform}
                                href={social?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-amber-200 dark:border-amber-500 flex items-center justify-center text-amber-200 dark:text-white hover:bg-neutral-100 dark:hover:bg-amber-600 transition-colors"
                                aria-label={social?.platform}
                            >
                                {getIconByName(social?.icon, 18)}
                            </a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}

export default CreativeFooter
