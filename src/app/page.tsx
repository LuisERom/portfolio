// src/app/page.tsx
'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
//import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";

type Project = {
  title: string;
  description: string;
  status: string;
  tags: string[];
  details: string;
  date: string;
  techStack?: string[];
  images?: { src: string; alt: string; caption?: string }[];
  role?: string;
  link?: string;
  video?: string;
};

const tagStyles: { [key: string]: string } = {
  AI: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  Hardware: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
  Research: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  Entrepreneurship: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  Software: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
  Academic: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
  Industry: "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100",
  "3D Design": "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100",
};

const projects = [
  {
    title: "B.S. in Electrical Engineering",
    workimage: "/images/PUPR.jpeg",
    description: "Completed coursework, capstone project, and multiple research/startup initiatives at the same time.",
    status: "Completed — Graduated in 2025 with a 3.7 GPA",
    tags: ["Academic"],
    details: "Earned a B.S. in Electrical Engineering at the Polytechnic University of Puerto Rico. Focused on Communications, Signals & Control Systems. During my time there, I launched my first startup (Vienvo), led multiple projects, and collaborated on hardware/software research at PUPR, photonics research at UGA and DNA origami research at UC Berkeley.",
    date: "2020 – 2025",
    images: [
      {
        src: "/images/PUPR.jpeg",
        alt: "Vienvo logo"
      }
    ],
  },
  {
    title: "Year 5 Research - UGA Photonics Project",
    description: "Photonic STDP neural circuit with machine learning.",
    status: "Completed - Built and tested the STDP response simulation circuit",
    tags: ["AI", "Research", "Academic"],
    details: "Designed and simulated a photonic circuit implementing spike-timing-dependent plasticity.",
    techStack: ["Python", "Machine Learning", "Photonics"],
    role: "Solo developer — handled all coding and circuit design",
    link: "https://wavelab.engr.uga.edu/",
    date: "2024 – 2025",
    images: [
      {
        src: "/images/WaveLab.jpeg",
        alt: "WaveLab logo"
      },
      {
        src: "/images/STDP_SimCirc.png",
        alt: "Simulation circuit diagram",
        caption: "Simulation circuit diagram for photonic STDP"
      },
      {
        src: "/images/STDP_Depression.png",
        alt: "Depression curve",
        caption: "Depression curve for photonic STDP"
      },
      {
        src: "/images/STDP_Potentiation.png",
        alt: "Potentiation curve",
        caption: "Potentiation curve for photonic STDP"
      }
    ],
  },
  {
    title: "Capstone Project – Psyche Asteroid Regolith Processing",
    description: "Designed a metal extraction system for the Psyche asteroid using in-situ resource strategies.",
    date: "2024 – 2025",
    tags: ["Research", "3D Design", "Academic"],
    details: "Capstone project focused on enabling in-situ resource utilization (ISRU) for the Psyche asteroid. Investigated environmental conditions and regolith properties to design a system for extracting metals like iron, aluminum, and silicon. Explored analogs from lunar and Martian missions and proposed a vapor deposition-based build system for microgravity applications.",
    status: "Completed — Created the solution and CAD model of the capstone project",
    images: [
      {
        src: "/images/UGA_CapstoneLogos.png",
        alt: "Vienvo logo"
      },
      {
        src: "/images/3D_Print_Capstone.jpg",
        alt: "Prototype on desk",
        caption: "3D printed prototype of the regolith processing system"
      },
      {
        src: "/images/UGA_Capstone_Poster.png",
        alt: "Testing session with user",
        caption: "UGA Capstone project poster"
      }
    ],
  },
  {
    title: "Summer Research - UC Berkeley SUPERB Program",
    description: "DNA origami biosensor project for molecular detection.",
    status: "Completed — Realized the experiments and proved the attachment of fluorescent molecules to DNA origami",
    tags: ["Research", "Academic"],
    details: "Worked with Dr. Tikhomirov's lab on DNA origami and fluorescence-based molecule detection for biosensing applications.",
    techStack: ["Python", "Fluorescence Microscopy"],
    role: "Team member — contributed to experimental design and data analysis",
    link: "https://superb.berkeley.edu/",
    date: "2024",
    images: [
      {
        src: "/images/UC_Berkeley_Embleme.jpg",
        alt: "UC Berkeley logo"
      },
      {
        src: "/images/Berkeley_Poster.png",
        alt: "Research poster",
        caption: "Research poster for DNA origami biosensor project"
      },
    ],
  },
  {
    title: "Year 4 Research - Baby & Pet Heat Stroke Death Prevention System for Vehicles",
    description: "Sensor system to detect and alert if a baby is left in a hot car.",
    status: "Completed — Built the prototype circuit and a large part of the codebase",
    tags: ["Hardware", "Research", "Software", "Academic"],
    details: "Built an embedded system with heat/humidity sensors, microcontroller, and wireless alert features for infant safety.",
    techStack: ["Arduino", "Embedded Systems"],
    role: "Solo developer — handled all coding and prototyping",
    link: "https://www.youtube.com/watch?v=FDJzQJS0elk",
    date: "2023 – 2024",
    images: [
      {
        src: "/images/PUPR_ResearchFinalCirc.jpg",
        alt: "PUPR Research Final Circuit",
        caption: "Complete prototype circuit for the heat stroke death prevention system"
      },
      {
        src: "/images/PUPR_ResearchPCB_Schematic.png",
        alt: "Prototype on desk",
        caption: "First hardware prototype of the modular hub"
      }
    ],
  },
  {
    title: "Quality Engineer Intern - Lutron Internship",
    description: "7-month quality engineering internship in automation.",
    status: "Completed — Built and tested a 100% analogous locking mechanism for a HIPOT testing machine",
    tags: ["Hardware", "Industry"],
    details: "Automated QA procedures for lighting control hardware and wrote test software for product validation.",
    techStack: ["Python", "Test Automation"],
    role: "Intern — assisted in automation and quality assurance",
    date: "2023 – 2024",
    images: [
      {
        src: "/images/LutronLogo.jpg",
        alt: "Lutron logo"
      },
      {
        src: "/images/Lutron_PCB3D_Top.png",
        alt: "3D PCB design",
        caption: "3D view of the PCB design for the locking mechanism"
      },
      {
        src: "/images/LutronPCB_Schematic.png",
        alt: "PCB schematic",
        caption: "Schematic view of the PCB design"
      }
    ]
  },
  {
    title: "NASA Competition Student Rocket Launch",
    description: "Built the payload system circuit for a student research rocket as part of a NASA launch competition.",
    status: "Completed — Built the rocket's payload sensor system circuit and software",
    tags: ["Hardware", "Software", "Academic"],
    details: "Collaborated on the NASA Student Launch Project at PUPR, contributing to the design and integration of electrical systems and telemetry for a research rocket. Focused on data acquisition, safety protocols, and launch readiness in a competitive engineering environment.",
    techStack: ["Arduino", "Embedded Systems"],
    role: "Team member — contributed to system design and integration",
    date: "2023 – 2024",
    images: [
      {
        src: "/images/NASA.png",
        alt: "NASA logo"
      },
      {
        src: "/images/NASA_PCB.png",
        alt: "PCB design",
        caption: "3D view of the PCB design for the rocket payload system"
      },
      {
        src: "/images/NASA_PCBWiring.png",
        alt: "PCB wiring",
        caption: "Wiring diagram for the PCB design"
      }
    ],
  },
  {
    title: "Vienvo - Cable Management Startup (www.vienvo.com)",
    description: "Cable management startup with hardware prototypes.",
    status: "Completed — Discontinued after contacting 500+ hypothesized clients — low customer urgency validated",
    tags: ["Entrepreneurship", "Hardware", "Software", "3D Design"],
    details: "Created a modular cable hub, conducted 500+ user interviews, and tested market demand. Shut down after validation phase. Webpage: www.vienvo.com",
    techStack: ["Arduino", "3D Printing", "Electronics Prototyping"],
    role: "Solo founder — handled all coding, prototyping, and business development",
    link: "https://www.vienvo.com",
    date: "2022 – 2024",
    video: "https://youtu.be/jcyw4VqWE5A",
    images: [
      {
        src: "/images/Vienvo_LogoT.png",
        alt: "Vienvo logo"
      },
      {
        src: "/images/VienvoHub_SideNoLidC2.png",
        alt: "Vienvo Hub Side View",
        caption: "Side view of the Vienvo modular hub without lid"
      }
    ],
  },
  {
    title: "Knockout - Roblox Game",
    description: "Custom multiplayer experience with game logic scripting.",
    status: "Completed — Built the game and monetization features",
    tags: ["Software"],
    details: "Built a Roblox game focusing on multiplayer mechanics, using Lua for scripting and monetization features. Play at: https://www.roblox.com/games/5214994542/Knockout#!/game-instances",
    techStack: ["Lua", "Roblox Studio"],
    role: "Solo developer — handled all coding and asset design",
    link: "https://www.roblox.com/games/5214994542/Knockout#!/game-instances",
    date: "2020",
    images: [
      {
        src: "/images/Knockout_Logo.png",
        alt: "Vienvo logo"
      }
    ],
  },
];

const tags = ["All", "AI", "Hardware", "Research", "Entrepreneurship", "Software", "Academic", "Industry", "3D Design"];

export default function Home() {

  const [activeTag, setActiveTag] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [lightboxImages, setLightboxImages] = useState<
    { src: string; description?: string }[]
  >([]);

  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const filtered = activeTag === "All" ? projects : projects.filter(p => p.tags.includes(activeTag));

  // Group projects by year for clustered view
  const groupedProjects: { [year: string]: Project[] } = filtered.reduce((groups, project) => {
    const year = (project.date.split("–")[1] || project.date).trim();
    if (!groups[year]) groups[year] = [];
    groups[year].push(project);
    return groups;
  }, {} as { [year: string]: Project[] });

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => b.localeCompare(a));

  useEffect(() => {
    if (lightboxImages.length === 0) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      const isSlide = target.classList.contains("yarl__slide");
      const isImage = target.closest(".yarl__slide_image");
      const isControl = target.closest(".yarl__toolbar, .yarl__button");

      if (isSlide && !isImage && !isControl) {
        setLightboxImages([]);
      }
    };

    const interval = setInterval(() => {
      const container = document.querySelector(".yarl__container");
      if (container) {
        container.addEventListener("click", handleClick);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      const container = document.querySelector(".yarl__container");
      if (container) {
        container.removeEventListener("click", handleClick);
      }
    };
  }, [lightboxImages]);


  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">Portfolio</h1>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        ⚙️ Hardware & Embedded Systems &nbsp;&nbsp;🧠 AI & Intelligent Systems &nbsp;&nbsp;🔬 Scientific Research & Innovation &nbsp;&nbsp;🚀 Startups & Product Building
      </p>

      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-wide">
        Current Focus
      </h2>

      {/* Current Focus as Timeline Style Entry */}
      <div className="relative border-l-2 border-zinc-300 dark:border-zinc-700 ml-4 mb-12">
        <h3 className="ml-1 text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-4">2025 – Present</h3>

        <div className="mb-6 ml-4 pl-4 relative">
          <div className="absolute -left-[10px] top-1.5 w-3 h-3 bg-green-600 rounded-full" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Lab Automation Copilot
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Currently surveying scientists to map out pain points in real-world lab workflows.
          </p>
          <p className="mt-2 text-sm">
            🔍 <a href="mailto:you@example.com" className="text-blue-600 dark:text-blue-400 underline">Want to share your lab frustrations?</a>
          </p>

          {/* Tags and Date */}
          <div className="mt-2 flex flex-wrap gap-1 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Entrepreneurship</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Research</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">AI</span>
          </div>
        </div>
      </div>

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

      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 mt-12 uppercase tracking-wide">
        Past Accomplishments
      </h2>

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
                {project.status && (
                  <p className="text-sm mt-1 text-blue-700 dark:text-blue-300 italic">{project.status}</p>
                )}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{project.date}</p>

                {project.images && (
                  <div className="mt-2 flex flex-wrap md:flex-nowrap gap-4 items-start">
                    {project.images.slice(0, 2).map((img, idx) => (
                      <div key={idx} className="flex flex-col items-center max-w-md">
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


                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagStyles[tag] || "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"}`}
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
        <>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => {
              setSelectedProject(null);
              setLightboxImages([]);
            }}
          >
            <div
              className="bg-white dark:bg-zinc-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* IMAGES PREVIEW (CLICK TO ENLARGE) */}
              {selectedProject.images && (
                <div className="flex flex-col items-center space-y-6 mb-6">
                  {selectedProject.images.map((image, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img
                        src={image.src}
                        alt={String(image.alt || "")}
                        className="max-w-full max-h-[500px] object-contain rounded-md shadow cursor-zoom-in"
                        onClick={() => {
                          setLightboxImages(
                            selectedProject.images!.map((img) => ({
                              src: img.src,
                              description: img.caption || "",
                            }))
                          );
                          setLightboxIndex(idx);
                        }}
                      />
                      {image.caption && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedProject.video && (
                <div className="w-full aspect-video mb-6">
                  <iframe
                    src={selectedProject.video}
                    className="w-full h-full rounded-md shadow"
                    title="Project video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* TEXT CONTENT */}
              <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4">{selectedProject.details}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{selectedProject.date}</p>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-blue-600 hover:underline text-sm"
              >
                Close
              </button>
            </div>
          </div>

          {lightboxImages.length > 0 && (
            <Lightbox
              open={true}
              close={() => {
                setLightboxImages([]);
                setLightboxIndex(0);
              }}
              slides={lightboxImages}
              index={lightboxIndex}
              plugins={[Zoom, Captions]}
              zoom={{
                scrollToZoom: true,
                maxZoomPixelRatio: 5,
                zoomInMultiplier: 1.5,
                doubleTapDelay: 300,
              }}
              controller={{
                closeOnBackdropClick: true,
              }}
            // 💡 Close on black backdrop (anywhere outside image)
            />
          )}

        </>
      )
      }
    </div >
  );
}
