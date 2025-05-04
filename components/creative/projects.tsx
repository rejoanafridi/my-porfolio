'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import type { ProjectsSection } from '@/lib/types'
import { getIconByName } from '@/lib/icon-map'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink } from 'lucide-react'

interface CreativeProjectsProps {
    data: ProjectsSection
}

const CreativeProjects = ({ data }: CreativeProjectsProps) => {
    const [activeProject, setActiveProject] = useState(0)

    return (
        <section className="min-h-screen flex items-center justify-center py-20 overflow-hidden">
            <div className="container px-4 relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-6"
                        >
                            {data.title}
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold mb-6 text-white"
                        >
                            {data.subtitle}
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Project Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-3"
                        >
                            <div className="space-y-2">
                                {data.projects.map((project, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveProject(index)}
                                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                                            activeProject === index
                                                ? 'bg-gradient-to-r from-amber-500/20 to-red-500/20 text-white'
                                                : 'bg-black/40 text-gray-400 hover:bg-black/60 hover:text-gray-300'
                                        }`}
                                    >
                                        <h3 className="font-bold truncate">
                                            {project.title}
                                        </h3>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Project Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-9"
                        >
                            <motion.div
                                key={activeProject}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-black/40 rounded-2xl overflow-hidden border border-amber-500/20"
                            >
                                <div className="relative h-64 md:h-80">
                                    <Image
                                        src={
                                            data.projects[activeProject]
                                                .image || '/placeholder.svg'
                                        }
                                        alt={data.projects[activeProject].title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                </div>

                                <div className="p-6 md:p-8">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                        {data.projects[activeProject].title}
                                    </h3>
                                    <p className="text-gray-300 mb-6">
                                        {
                                            data.projects[activeProject]
                                                .description
                                        }
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {data.projects[
                                            activeProject
                                        ].techStack.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full flex items-center gap-1"
                                            >
                                                {getIconByName(tech.icon, 14)}
                                                <span>{tech.name}</span>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Button
                                            variant="outline"
                                            className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                                            asChild
                                        >
                                            <a
                                                href={
                                                    data.projects[activeProject]
                                                        .githubLink
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                <Github size={16} />
                                                <span>View Code</span>
                                            </a>
                                        </Button>
                                        <Button
                                            className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white border-0"
                                            asChild
                                        >
                                            <a
                                                href={
                                                    data.projects[activeProject]
                                                        .demoLink
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                <ExternalLink size={16} />
                                                <span>Live Demo</span>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CreativeProjects
