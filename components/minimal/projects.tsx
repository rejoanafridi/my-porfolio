'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ProjectsSection } from '@/lib/types'
import { getIconByName } from '@/lib/icon-map'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink } from 'lucide-react'

interface MinimalProjectsProps {
    data: ProjectsSection
}

const MinimalProjects = ({ data }: MinimalProjectsProps) => {
    return (
        <section id="projects" className="py-24 md:py-32">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-16 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-block text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4"
                    >
                        {data.title}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-serif font-light mb-4 text-neutral-800 dark:text-neutral-200"
                    >
                        {data.subtitle}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="w-16 h-px bg-neutral-800 dark:bg-neutral-200 mx-auto"
                    />
                </div>

                <div className="space-y-24">
                    {data.projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: 0.5 + index * 0.1
                            }}
                            className={`flex flex-col ${
                                index % 2 === 0
                                    ? 'md:flex-row'
                                    : 'md:flex-row-reverse'
                            } gap-8 md:gap-12 items-center`}
                        >
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={
                                            project.image || '/placeholder.svg'
                                        }
                                        alt={project.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-1/2">
                                <h3 className="text-2xl font-medium text-neutral-800 dark:text-neutral-200 mb-4">
                                    {project.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    {project.techStack.map(
                                        (tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-3 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm flex items-center gap-1"
                                            >
                                                {getIconByName(tech.icon, 14)}
                                                <span>{tech.name}</span>
                                            </span>
                                        )
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="border-neutral-300 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 rounded-none"
                                        asChild
                                    >
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2"
                                        >
                                            <Github size={16} />
                                            <span>View Code</span>
                                        </a>
                                    </Button>
                                    <Button
                                        className="bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-800 rounded-none"
                                        asChild
                                    >
                                        <a
                                            href={project.demoLink}
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
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default MinimalProjects
