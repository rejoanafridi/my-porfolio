"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ArrowRight } from "lucide-react"
import Image from "next/image"
import type { ProjectsSection } from "@/lib/types"
import { getIconByName } from "@/lib/icon-map"

interface ProjectsProps {
  data: ProjectsSection
}

const Projects = ({ data }: ProjectsProps) => {
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

  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  return (
    <section id="projects" className="py-20 md:py-32 bg-muted/30 overflow-hidden" ref={containerRef}>
      <motion.div ref={ref} style={{ y, opacity }} className="container px-4 relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto relative z-10"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border/50">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out"
                      style={{
                        transform: hoveredProject === project.id ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                        >
                          {getIconByName(tech.icon, 14)}
                          <span>{tech.name}</span>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                    </Button>
                    <Button size="sm" asChild>
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 group"
                      >
                        <span>Live Demo</span>
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg" asChild className="rounded-full">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span>View More Projects</span>
                <ArrowRight size={16} />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects
