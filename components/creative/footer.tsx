"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Heart } from "lucide-react"

const CreativeFooter = () => {
  const currentYear = new Date().getFullYear()

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
              &copy; {currentYear} John Doe. Made with <Heart size={14} className="mx-1 text-red-500" /> using Next.js
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
              className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
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

export default CreativeFooter
