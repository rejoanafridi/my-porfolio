"use client"

import { motion } from "framer-motion"
import type { SkillsSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"

interface MinimalSkillsProps {
  data: SkillsSection
}

const MinimalSkills = ({ data }: MinimalSkillsProps) => {
  return (
    <section id="skills" className="py-24 md:py-32">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="text-neutral-800 dark:text-neutral-200">{getIconByName(skill.icon, 24)}</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-1">{skill.name}</h3>
                <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.05 }}
                    className="h-full bg-neutral-800 dark:bg-neutral-200"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-3 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            <span className="text-sm uppercase tracking-wider">Always learning new technologies</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default MinimalSkills
