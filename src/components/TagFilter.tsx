/**
 * Filter bar for the projects area: one pill button per tag from `@/data/projects` (e.g. “All”, topic tags).
 * Clicking a pill calls `onTagChange` so the parent can recompute which projects to show; the active pill gets distinct styling.
 */
import React from "react";
import { motion } from "framer-motion";
import { tags } from "@/data/projects";

interface TagFilterProps {
    activeTag: string;
    onTagChange: (tag: string) => void;
}

export default function TagFilter({ activeTag, onTagChange }: TagFilterProps) {
    return (
        <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {tags.map(tag => (
                <button
                    key={tag}
                    onClick={() => onTagChange(tag)}
                    className={`px-3 py-1 rounded-full border ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-600'}`}
                >
                    {tag}
                </button>
            ))}
        </motion.div>
    );
}

