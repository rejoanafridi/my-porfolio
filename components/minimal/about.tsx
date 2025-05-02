'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { AboutSection } from '@/lib/types'
import { getIconByName } from '@/lib/icon-map'

interface MinimalAboutProps {
    data: AboutSection
}

const MinimalAbout = ({ data }: MinimalAboutProps) => {
    return (
        <section id="about" className="py-24 md:py-32">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="relative">
                            <div className="aspect-square overflow-hidden">
                                <Image
                                    src={data.image || '/placeholder.svg'}
                                    alt="Profile"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="space-y-6">
                            {data?.description?.map((paragraph, index) => (
                                <motion.p
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="text-neutral-600 dark:text-neutral-400 leading-relaxed"
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                            className="mt-8 flex flex-wrap gap-4"
                        >
                            {data.traits.map((trait, index) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                                >
                                    {getIconByName(trait.icon, 16)}
                                    <span>{trait.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default MinimalAbout
