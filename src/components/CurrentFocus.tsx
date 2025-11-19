import React from "react";
import { motion } from "framer-motion";

export default function CurrentFocus() {
    const focuses = [
        {
            title: "AI-Powered Research Assistant",
            description: "Working on an early-stage project that brings together AI, robotics, and life sciences. I’m exploring how automation can transform scientific research and open new possibilities for discovery in the lab.",
            tags: ["Entrepreneurship", "Research", "AI"],
            link: "mailto:luiseroman21@gmail.com",
            linkText: "Want to share your lab frustrations?",
            emoji: "🔍"
        },
        {
            title: "Applying to Graduate School",
            description: "Applying to PhD programs in Electrical Engineering.",
            tags: ["Academic"],
            emoji: "🎓"
        },
        {
            title: "UGA OTDR Fiber Authentication",
            description: "Developing a machine learning and rule-based system to identify and authenticate single-mode optical fibers using OTDR backscatter data. Built a Python pipeline with SVM classification, achieving 98.5% accuracy across eight fibers. Currently enhancing feature extraction to define unique rule-based patterns for improved authentication reliability.",
            tags: ["Research", "Hardware", "Academic"],
            emoji: "🔬"
        }
    ];

    return (
        <>
            <motion.h2
                className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
                Current Focus
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {focuses.map((focus, index) => (
                    <motion.div
                        key={index}
                        className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 shadow-md border border-zinc-200 dark:border-zinc-700 relative cursor-pointer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        viewport={{ once: true, amount: 0.1, margin: "-100px" }}
                        transition={{
                            opacity: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
                            y: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
                            scale: { duration: 0.15, ease: "easeOut" },
                            default: { duration: 0.15, ease: "easeOut" }
                        }}
                    >
                        <div className="absolute -top-2 -right-2 text-2xl">{focus.emoji}</div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 pr-8">
                            {focus.title}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-3">
                            {focus.description}
                        </p>
                        {focus.link && (
                            <p className="mb-3 text-sm">
                                <a href={focus.link} className="text-blue-600 dark:text-blue-400 underline">
                                    {focus.linkText}
                                </a>
                            </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1 text-xs">
                            {focus.tags.map((tag, tagIndex) => {
                                const tagColors: { [key: string]: string } = {
                                    "Entrepreneurship": "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                                    "Research": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                                    "AI": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
                                    "Academic": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
                                    "Hardware": "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
                                };
                                return (
                                    <span key={tagIndex} className={`px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"}`}>
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
