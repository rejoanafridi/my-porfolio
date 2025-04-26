'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Heart } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="py-8 border-t border-border/40 bg-muted/30">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 md:mb-0"
                    >
                        <p className="text-sm text-muted-foreground flex items-center">
                            &copy; {currentYear} Rejoan Islam. Made with{' '}
                            <Heart size={14} className="mx-1 text-red-500" />{' '}
                            using Next.js
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex space-x-4"
                    >
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="GitHub"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={18} />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter size={18} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
