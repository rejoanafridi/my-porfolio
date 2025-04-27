"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { AboutSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"

interface CreativeAboutProps {
  data: AboutSection
}

const CreativeAbout = ({ data }: CreativeAboutProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 overflow-hidden">
      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-amber-500/20">
                  <Image src={data.image || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-7"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-6"
              >
                {data.title}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
              >
                {data.subtitle}
              </motion.h2>

              <div className="space-y-4 mb-8">
                {data.description.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-gray-300"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-3"
              >
                {data.traits.map((trait, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-full flex items-center gap-2 text-amber-300"
                  >
                    {getIconByName(trait.icon, 16)}
                    <span>{trait.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CreativeAbout
