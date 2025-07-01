// src/app/page.tsx
'use client';

import { useState } from "react";
import { motion } from "framer-motion";


const projects = [
  {
    title: "B.S. in Electrical Engineering",
    description: "Completed coursework, capstone project, and multiple research/startup initiatives.",
    tags: ["Academic"],
    details: "Studied electrical engineering at the Polytechnic University of Puerto Rico from 2020 to 2025. Took core and advanced courses in electronics, systems, and engineering design. Simultaneously led research in photonics, launched a startup, and collaborated with labs at UGA and UC Berkeley.",
    date: "2020 – 2025",
  },
  {
    title: "Knockout - Roblox Game",
    description: "Custom multiplayer experience with game logic scripting.",
    tags: ["Code", "Game Dev"],
    details: "Built a Roblox game focusing on multiplayer mechanics, using Lua for scripting and monetization features.",
    date: "2020",
  },
  {
    title: "ML & DL Projects",
    description: "OTDR-based fiber classification using SVM and KNN.",
    tags: ["Code", "AI", "Research"],
    details: "Built machine learning classifiers for physical unclonable functions using OTDR data from singlemode and multimode fibers.",
    date: "2021 – 2022",
  },
  {
    title: "Vienvo - Cable Management Startup",
    description: "Cable management startup with hardware prototypes.",
    tags: ["Entrepreneurship", "Electronics"],
    details: "Created a modular cable hub, conducted 500+ user interviews, and tested market demand. Shut down after validation phase.",
    date: "2022",
  },
  {
    title: "Quality Engineer Intern - Lutron Internship",
    description: "7-month quality engineering internship in automation.",
    tags: ["Electronics", "Industry"],
    details: "Automated QA procedures for lighting control hardware and wrote test software for product validation.",
    date: "2023 – 2024",
  },
  {
    title: "Year 4 Research - Baby Heat Death Prevention System",
    description: "Sensor system to detect and alert if a baby is left in a hot car.",
    tags: ["Electronics", "Research"],
    details: "Built an embedded system with heat/humidity sensors, microcontroller, and wireless alert features for infant safety.",
    date: "2023 – 2024",
  },
  {
    title: "Year 5 Research - UGA Photonics Project",
    description: "Photonic STDP neural circuit with machine learning.",
    tags: ["AI", "Electronics", "Research"],
    details: "Designed and simulated a photonic circuit implementing spike-timing-dependent plasticity with supervised ML.",
    date: "2024 – 2025",
  },
  {
    title: "Summer Research - UC Berkeley SUPERB Program",
    description: "DNA origami biosensor project for molecular detection.",
    tags: ["Research", "Bioengineering"],
    details: "Worked with Dr. Tikhomirov's lab on DNA origami and fluorescence-based molecule detection for biosensing applications.",
    date: "2024",
  },
  {
    title: "Startup",
    description: "Research Laboratory Automation",
    tags: ["Entrepreneurship"],
    details: "...",
    date: "2025 – Present",
  },
];

const tags = ["All", "Code", "Electronics", "AI", "Research", "Entrepreneurship", "Industry", "Game Dev", "Bioengineering"];

export default function Home() {

  const [activeTag, setActiveTag] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  type Project = {
    title: string;
    description: string;
    tags: string[];
    details: string;
    date: string;
  };

  const filtered = activeTag === "All" ? projects : projects.filter(p => p.tags.includes(activeTag));

  // Group projects by year for clustered view
  const groupedProjects: { [year: string]: Project[] } = filtered.reduce((groups, project) => {
    const year = project.date.split("–")[0].trim();
    if (!groups[year]) groups[year] = [];
    groups[year].push(project);
    return groups;
  }, {} as { [year: string]: Project[] });

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">Portfolio</h1>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        ⚙️ Electronics & Embedded Systems &nbsp;&nbsp;🧠 AI & Machine Learning &nbsp;&nbsp;🔬 Research & Innovation &nbsp;&nbsp;🚀 Entrepreneurship
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full border ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-600'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="relative border-l-2 border-zinc-300 dark:border-zinc-700 ml-4">
        {sortedYears.map((year) => (
          <div key={year} className="mb-6">
            <h3 className="ml-1 text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-4">{year}</h3>
            {groupedProjects[year].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="mb-8 ml-4 pl-4 relative cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="absolute -left-[10px] top-1.5 w-3 h-3 bg-blue-600 rounded-full group-hover:scale-110 transition" />
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-300">{project.description}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{project.date}</p>
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag === "AI"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        : tag === "Electronics"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          : tag === "Research"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : tag === "Entrepreneurship"
                              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              : tag === "Game Dev"
                                ? "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
                                : tag === "Academic"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                                  : tag === "Industry"
                                    ? "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                                    : tag === "Bioengineering"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                                      : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}

                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedProject(null)}>
          <div
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4">{selectedProject.details}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{selectedProject.date}</p>
            <button onClick={() => setSelectedProject(null)} className="text-blue-600 hover:underline text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
