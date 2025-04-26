"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import type { SkillsSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"

interface SkillsProps {
  data: SkillsSection
}

const Skills = ({ data }: SkillsProps) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <section id="skills" className="py-20 md:py-32 overflow-hidden" ref={containerRef}>
      <motion.div ref={ref} style={{ y, opacity }} className="container px-4 relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="flex flex-col items-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/20 bg-primary/5">
                {data.title}
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              {data.subtitle}
            </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-20 h-1 bg-primary rounded-full mb-8"
            />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {data.skills.map((skill) => (
              <motion.div
                key={skill.id}
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${skill.color} border border-border rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex justify-center mb-4">{getIconByName(skill.icon, 24)}</div>
                <h3 className="font-medium">{skill.name}</h3>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Zap size={16} />
              <span className="text-sm font-medium">Always learning new technologies</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills
