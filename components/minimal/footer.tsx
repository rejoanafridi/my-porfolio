'use client'
import { useLayout } from '@/contexts/layout-context'
import { getIconByName } from '@/lib/icon-map'
import { motion } from 'framer-motion'

const MinimalFooter = () => {
    const { siteConfig, siteData } = useLayout()
    const currentYear = new Date().getFullYear()
    const { copyrightText, footerText } = siteConfig?.config ?? {}

    return (
        <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 md:mb-0"
                    >
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            &copy; {currentYear} {copyrightText} {footerText}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex space-x-6"
                    >
                        {siteData?.contact?.socials?.map((social: any) => (
                            <a
                                key={social?.platform}
                                href={social?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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

export default MinimalFooter
