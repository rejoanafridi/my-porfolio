import Image from 'next/image'
import type { AboutSection } from '@/lib/types'
import { getIconByName } from '@/lib/icon-map'

interface AboutProps {
    data: AboutSection
}

const About = ({ data }: AboutProps) => {
    return (
        <section id="about" className="py-16 md:py-24">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
                    <p className="text-xl text-muted-foreground">
                        {data.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 opacity-30 blur-xl"></div>
                        <div className="relative overflow-hidden rounded-xl">
                            <Image
                                src={
                                    data.image ||
                                    '/placeholder.svg?height=600&width=600'
                                }
                                alt="About me"
                                width={600}
                                height={600}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4 mb-8">
                            {data.description.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-muted-foreground"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.traits.map((trait, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                                >
                                    <div className="text-primary">
                                        {getIconByName(trait.icon)}
                                    </div>
                                    <span>{trait.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
