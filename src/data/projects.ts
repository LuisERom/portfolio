import { Project } from "@/types";

export const tagStyles: { [key: string]: string } = {
    AI: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    Hardware: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
    Research: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    Entrepreneurship: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    Software: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
    Academic: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    Industry: "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100",
    "3D Design": "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100",
};

export const projects: Project[] = [
    {
        title: "NSF I-Corps Program - AI-Powered Research Assistant",
        workimage: "/images/NSF-I-CORPS-Logo.png",
        description: "NSF-funded entrepreneurship program focused on translating lab technologies to the market through customer discovery.",
        status: "Completed — Led 100 structured customer discovery interviews with PIs and graduate students",
        tags: ["Entrepreneurship"],
        details: "Selected for the NSF I-Corps Puerto Rico 20th cohort to test whether a lab-automation concept (LabOS) solved real problems in academic research environments. Over six weeks, I led 100 customer discovery interviews with PIs and graduate students to map experimental workflows, surface pain points, and understand how human error and protocol variability contribute to failed experiments. \n\n" +
            "Through the I-Corps curriculum, I refined our problem and customer hypotheses, iterated on the value proposition, and evaluated the potential academic use cases for LabOS. The program strengthened my skills in evidence-based entrepreneurship, customer discovery, and early business model design grounded in real researcher feedback.",
        date: "Oct 2025 – Nov 2025",
        images: [
            {
                src: "/images/NSF-I-CORPS-Logo.png",
                alt: "NSF I-Corps logo"
            },
            {
                src: "/images/I-Corps_Certificate_LuisRoman.jpg",
                alt: "I-Corps program completion certificate",
                caption: "I-Corps program completion certificate"
            }
        ],
    },
    {
        title: "B.S. in Electrical Engineering",
        workimage: "/images/PUPR.jpeg",
        description: "Completed coursework, capstone project, and multiple research/startup initiatives at the same time.",
        status: "Completed — Graduated in 2025 with a 3.7 GPA",
        tags: ["Academic"],
        details: "Earned a B.S. in Electrical Engineering at the Polytechnic University of Puerto Rico. Focused on Communications, Signals and Control Systems. During my time there, I launched my first startup (Vienvo), led multiple projects, and collaborated on hardware/software research at PUPR, photonics research at UGA and DNA origami research at UC Berkeley.",
        date: "Aug 2020 – May 2025",
        images: [
            {
                src: "/images/PUPR.jpeg",
                alt: "PUPR logo"
            },
            {
                src: "/images/Grad_Img.jpg",
                alt: "Graduation Photo",
                caption: "Graduation photo"
            }
        ],
    },
    {
        title: "Psyche Asteroid ISRU Regolith Refinement Processing Capstone Project",
        description: "University of Georgia – Capstone Researcher",
        institution: "University of Georgia * Sponsored by NASA Psyche Mission, Arizona State University * Advisor: Dr. Jorge I. Rodriguez",
        date: "Aug 2024 – May 2025",
        tags: ["Research", "3D Design", "Academic"],
        details: "Developed a concept for an in-situ resource utilization (ISRU) system capable of refining metallic regolith from the Psyche asteroid to support future additive manufacturing missions. The project simulated and modeled particle crushing, separation, and magnetic filtration under Psyche’s low gravity and extreme temperature conditions. I led the mechanical-electrical interface and CAD modeling of the system in Fusion 360, incorporating energy efficiency and DFM constraints into subsystem designs. The final concept demonstrated a feasible method for reducing deep-space mission weight and cost through on-site material processing, presented at the NASA-sponsored UGA Capstone Expo (2025).\n\n More information can be found here: https://psyche.ssl.berkeley.edu/get-involved/capstone-projects/capstone-projects-iridium-class/additive-manufacturing-with-hypothesized-surface-materials-uga-c/",
        status: "Completed — Created the solution and CAD model of the capstone project",
        images: [
            {
                src: "/images/UGA_CapstoneLogos.png",
                alt: "UGA, NASA, and Psyche Mission Logos"
            },
            {
                src: "/images/3D_Print_Capstone.jpg",
                alt: "3D Printed Regolith Processing Concept Design",
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
        title: "Optical STDP Simulation — Research Exploration ",
        description: "University of Georgia – Undergraduate Researcher",
        status: "Completed - Built and tested the STDP response simulation circuit",
        tags: ["Research", "Academic"],
        details: "Simulated spike-timing-dependent plasticity (STDP) in photonic hardware using OptiSystem, replicating and extending findings from a WAVE Lab study on semiconductor optical amplifier (SOA)-based learning dynamics. The setup used Mach–Zehnder modulators and a traveling-wave SOA to generate pre- and post-synaptic optical pulses at different frequencies. By adjusting pulse timing, I modeled potentiation and depression behavior analogous to neuronal learning. The simulation produced distinct STDP curves—potentiation and depression windows—demonstrating the timing-dependent gain response of the SOA. This project deepened my understanding of optical neuromorphic computing principles and exposed limitations in parameter sensitivity and response stability of the modeled system.\n\n\n Reference paper: Photonic implementation of a neuronal learning algorithm based on spike timing dependent plasticity \n Reference link: https://ieeexplore.ieee.org/document/7121946",
        techStack: ["Python", "Machine Learning", "Photonics"],
        role: "",
        link: "https://wavelab.engr.uga.edu/",
        institution: "University of Georgia * Advisor: Dr. Mable Fok (WAVE Lab)",
        date: "Aug 2024 - Dec 2024",
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
            },
            {
                src: "/images/STDP_Paper_Curve.png",
                alt: "STDP Reference Curve",
                caption: "STDP response reference curve from lab paper"
            },
        ],
    },
    {
        title: "Vienvo, LLC – Co-founder and President",
        description: "Cable management startup with hardware prototypes.",
        status: "Completed — Discontinued after contacting 500+ hypothesized clients — low customer urgency validated",
        tags: ["Entrepreneurship", "Hardware", "Software", "3D Design"],
        details: "Led the design and prototyping of an electronic cable-management system that automated cable retraction through motorized control. Designed the circuit in EasyEDA, modeled the housing in Fusion 360, and built a working prototype using Arduino-based programming. Conducted 500+ user interviews across two entrepreneurship programs to validate market demand and manufacturing feasibility. Ended the project after confirming that the problem did not justify production cost, gaining experience in hardware development, system integration, and user validation.\n\n Concept video: https://youtu.be/Q6_grfdx7ss \n\n Webpage: www.vienvo.com",
        techStack: ["Arduino", "3D Printing", "Electronics Prototyping"],
        role: "",
        link: "https://www.vienvo.com",
        date: "Dec 2022 – Oct 2024",
        images: [
            {
                src: "/images/Vienvo_LogoT.png",
                alt: "Vienvo logo"
            },
            {
                src: "/images/VienvoHub_SideNoLidC2.png",
                alt: "Vienvo Hub Side View",
                caption: "Side view of the Vienvo modular hub without lid"
            },
            {
                src: "/images/Vienvo_ButtonDeck.png",
                alt: "Vienvo Button Deck",
                caption: "Side view of the Vienvo button deck"
            }
        ],
    },
    {
        title: "Detection of Fluorescent Dye Binding to Basket-Shaped DNA Origami",
        description: "University of California, Berkeley – Summer Undergraduate Researcher",
        status: "Completed — Realized the experiments and proved the attachment of fluorescent molecules to DNA origami",
        tags: ["Research", "Academic"],
        details: "This project explored how fluorescent molecules can be integrated into DNA origami nanostructures for potential use in continuous biomarker detection. I fabricated basket-shaped DNA origami with 23- and 46-site adaptor configurations, which act as bridges between the DNA structure and fluorescent dyes (Cy3 and Cy5). The structural integrity of the origami was confirmed through gel electrophoresis, and fluorescence imaging verified strong Cy3 binding to its complementary adaptors. These results demonstrated stable fluorophore incorporation and established a foundation for future biosensing applications. Limitations in Cy5 detection, due to equipment wavelength range, were also identified. The findings were presented at the UC Berkeley SUPERB-AI4E Tech Talk (2024).",
        techStack: ["Python", "Fluorescence Microscopy"],
        role: "Team member — contributed to experimental design and data analysis",
        institution: "University of California, Berkeley * SUPERB Program * Advisors: Dr. Grigory Tikhomirov, Dr. Soyeon Lee",
        link: "https://superb.berkeley.edu/",
        date: "Jun 2024 - Aug 2024",
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
        title: "Multi-Sensor Vehicle System for Infant and Pet Heatstroke Prevention",
        description: "Polytechnic University of Puerto Rico – Undergraduate Researcher",
        status: "Completed — Built the prototype circuit and a large part of the codebase",
        tags: ["Hardware", "Research", "Software", "Academic"],
        details: "Designed and tested an embedded system that detects infants or pets left inside vehicles and activates preventive safety measures. I first conducted temperature experiments to characterize interior heat-rise behavior, confirming cabin temperatures can exceed 120 °F within minutes. Using these results, I led the electronics design and Arduino programming of a prototype integrating seat-occupancy, infrared, Hall-effect, and temperature sensors. The system triggers alerts through a Bluetooth beeper and powers auxiliary ventilation using a solar-assisted battery circuit. The project demonstrated a functional proof-of-concept for a low-cost, adaptable solution to prevent heatstroke-related fatalities in vehicles.",
        techStack: ["Arduino", "Embedded Systems"],
        institution: "Polytechnic University of Puerto Rico * URP-HOS Project * Advisor: Prof. Wilfredo Torres-Vélez * Lead Researcher: Elvis J. Sánchez Robles",
        link: "https://www.youtube.com/watch?v=FDJzQJS0elk",
        date: "Aug 2023 - Aug 2024",
        images: [
            {
                src: "/images/PUPR.jpeg",
                alt: "PUPR logo"
            },
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
        title: "Lutron Electronics – Quality Engineer CO-OP",
        description: "9-month quality engineering CO-OP at a lighting control manufacturing facility.",
        status: "Completed — Built and tested a 100% analogous locking mechanism for a HIPOT testing machine",
        tags: ["Hardware", "Industry"],
        details: "Worked as a Quality Engineer Co-op at Lutron Electronics, contributing to both process and hardware improvement initiatives. I designed an analog locking circuit to prevent premature lid opening on a HIPOT tester, improving testing reliability and safety. The circuit was built and validated on breadboard, simulated in LTSpice, and converted to a PCB design in EasyEDA for manufacturing. I also organized component data from product manuals to create a unified reference system for assembly operations. This experience strengthened my understanding of hardware validation, analog control design, and data organization in large-scale production environments.",
        techStack: ["Python", "Test Automation"],
        role: "Intern — assisted in automation and quality assurance",
        date: "Jul 2023 – Mar 2024",
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
        title: "NASA Student Launch – Payload Sensors Electronics Engineer",
        description: "Built the payload system circuit for a student research rocket as part of a NASA launch competition.",
        status: "Completed — Built the rocket's payload sensor system circuit and software",
        tags: ["Hardware", "Software", "Academic"],
        details: "Developed the payload sensor and data acquisition system for a rocket-based drone payload in the NASA Student Launch Competition. Designed schematics and PCB layouts in EasyEDA and implemented the system using Arduino Nano 33 IoT for sensor control and data logging. The payload captured acceleration, air quality, temperature, pressure, vibration, and GPS data during flight and stored results to an onboard SD card. I also programmed the activation logic to trigger data collection automatically once the payload was released from the rocket. Testing and breadboard validation confirmed successful data acquisition and system response throughout simulated flight conditions.",
        techStack: ["Arduino", "Embedded Systems"],
        role: "Team member — system design and integration",
        date: "Aug 2023 - May 2024",
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
        title: "Knockout - Roblox Game",
        description: "Custom multiplayer experience with game logic scripting.",
        status: "Completed — Built the game and monetization features",
        tags: ["Software"],
        details: "Developed a multiplayer Roblox game featuring several competitive minigames and dynamic environments. Programmed in Lua, implementing game logic, player matchmaking, and real-time scoring systems. Designed multiple interactive modes—such as obstacle courses, survival challenges, and team-based rounds—and built all maps and assets within Roblox Studio. Integrated an inventory and currency system that saves player data across sessions, along with an in-game store and leaderboard tracking. The project combined game design, scripting, and database management, resulting in a fully functional multiplayer experience.\n\n Play at: https://www.roblox.com/games/5214994542/Knockout#!/game-instances",
        techStack: ["Lua", "Roblox Studio"],
        role: "Solo developer — handled all coding and asset design",
        link: "https://www.roblox.com/games/5214994542/Knockout#!/game-instances",
        date: "Mar 2020 - Dec 2020",
        images: [
            {
                src: "/images/Knockout_Logo.png",
                alt: "Knockout logo",
                caption: "Knockout logo"
            }
        ],
    },
];

export const tags = ["All", "AI", "Hardware", "Research", "Entrepreneurship", "Software", "Academic", "Industry", "3D Design"];

