/**
 * One project entry in the timeline: thumbnail logo, title, description snippet, tag chips, and extra images.
 * Cards slide in when they scroll near the viewport; clicking anywhere on the card runs the parent’s onClick (opens ProjectModal).
 * `isLeft` controls which side of the timeline the card sits on and flips text alignment on wide screens.
 */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { tagStyles } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
    isLeft: boolean;
    onClick: () => void;
}

export default function ProjectCard({ project, isLeft, onClick }: ProjectCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const firstImage = project.images && project.images.length > 0 ? project.images[0] : null;
    const remainingImages = project.images && project.images.length > 0 ? project.images.slice(1) : [];

    useEffect(() => {
        if (!sentinelRef.current || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { rootMargin: "0px 0px 500px 0px", threshold: 0 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <div
            className={`mb-20 relative portrait-center project-card-wrapper ${isLeft
                ? 'md:w-[calc(65%-2rem)] md:mr-auto'
                : 'md:w-[calc(65%-2rem)] md:ml-auto'
                }`}
            style={isLeft ? { transform: 'translateX(-3rem)' } : { transform: 'translateX(3rem)' }}
            data-project-card="true"
        >
            {/* Small sentinel at the very top - triggers when top edge enters viewport */}
            <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{
                    opacity: { duration: 0.3, ease: "easeOut" },
                    y: { duration: 0.3, ease: "easeOut" },
                    scale: { duration: 0.15, ease: "easeOut" },
                    default: { duration: 0.15, ease: "easeOut" }
                }}
                className={`relative cursor-pointer group portrait-text-left ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                data-project-card="true"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {/* Timeline dot - positioned at card edge closest to center line */}
                <div className={`absolute top-1.5 hidden md:block w-3 h-3 bg-blue-600 rounded-full group-hover:scale-110 transition z-10 portrait-hide ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                    }`} />

                {/* Card content */}
                <div className={`bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 shadow-md border border-zinc-200 dark:border-zinc-700 w-full relative`}>
                    {/* Logo image container - sticks out at the top center */}
                    {firstImage && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[85%] z-20">
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 shadow-lg border border-zinc-200 dark:border-zinc-700">
                                <img
                                    src={firstImage.src}
                                    alt={String(firstImage.alt || "")}
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                        </div>
                    )}
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-300">{project.description}</p>
                    {project.status && (
                        <p className="text-sm mt-1 text-blue-700 dark:text-blue-300 italic">{project.status}</p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{project.date}</p>

                    {remainingImages.length > 0 && (
                        <div className={`mt-2 flex flex-nowrap gap-4 items-start portrait-justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'
                            }`}>
                            {remainingImages.slice(0, 2).map((img, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 min-w-0">
                                    <img
                                        src={img.src}
                                        alt={String(img.alt || "")}
                                        className="w-full h-auto object-contain rounded-lg shadow-md"
                                        style={{ maxHeight: "250px", width: "auto" }}
                                    />
                                    {img.caption && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">{img.caption}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`mt-2 flex flex-wrap gap-1 text-xs portrait-justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'
                        }`}>
                        {project.tags.map(tag => (
                            <span
                                key={tag}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagStyles[tag] || "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

