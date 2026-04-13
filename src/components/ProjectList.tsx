/**
 * Project timeline view: takes projects already grouped by year and prints one year block at a time.
 * Each year shows a divider label, then a zig-zag column of ProjectCards (left/right for readability).
 * When the user picks a project, this component only forwards the click — the parent opens the modal.
 */
import React from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
    groupedProjects: { [year: string]: Project[] };
    sortedYears: string[];
    onProjectClick: (project: Project) => void;
}

export default function ProjectList({ groupedProjects, sortedYears, onProjectClick }: ProjectListProps) {
    let globalProjectIndex = 0;

    return (
        <div className="relative pt-14">
            {sortedYears.map((year) => (
                <motion.div
                    key={year}
                    className="mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="relative -top-16 mb-4 flex items-center gap-4 px-8">
                        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                        <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{year}</h3>
                        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                    </div>
                    {groupedProjects[year].map((project, i) => {
                        const currentGlobalIndex = globalProjectIndex++;
                        const isLeft = currentGlobalIndex % 2 === 0;

                        return (
                            <ProjectCard
                                key={i}
                                project={project}
                                isLeft={isLeft}
                                onClick={() => onProjectClick(project)}
                            />
                        );
                    })}
                </motion.div>
            ))}
        </div>
    );
}

