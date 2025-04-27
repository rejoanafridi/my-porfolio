"use client"

import { motion } from "framer-motion"
import type { SkillsSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"
import { useState } from "react"

interface CreativeSkillsProps {
  data: SkillsSection
}

const CreativeSkills = ({ data }: CreativeSkillsProps) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {data.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative h-full bg-black rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300">
                  <div className="text-amber-400 mb-4 transition-all duration-300 transform group-hover:scale-110">
                    {getIconByName(skill.icon, 40)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>

                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hoveredSkill === skill.id ? "100%" : "70%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              <span className="text-lg font-medium">Always learning new technologies</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CreativeSkills
