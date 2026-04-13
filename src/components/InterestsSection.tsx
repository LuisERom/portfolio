'use client';

/**
 * Section wrapper with the heading “I’m interested in…” and a 2×2 grid of small themed panels.
 * Each cell imports its own animated widget (brain, fiber, chip, terminal) so this file mostly handles layout and motion on scroll.
 */
import { motion } from 'framer-motion';
import BrainActivity from './BrainActivity';
import PhotonicsBox from './PhotonicsBox';
import ElectronicsBox from './ElectronicsBox';
import ProgrammingBox from './ProgrammingBox';

const InterestsSection = () => {
    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <h2 className="text-lg font-bold mb-3 text-center">I&apos;m interested in...</h2>

            <div className="grid grid-cols-2 gap-2">
                {/* Top Left - Neuroscience/AI */}
                <motion.div
                    className="border border-zinc-700 rounded-lg p-2 bg-zinc-900"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <h3 className="text-xs font-semibold mb-1 text-center">Artificial Intelligence</h3>
                    <BrainActivity />
                </motion.div>

                {/* Top Right - Photonics */}
                <motion.div
                    className="border border-zinc-700 rounded-lg p-2 bg-zinc-900"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <h3 className="text-xs font-semibold mb-1 text-center">Photonics</h3>
                    <PhotonicsBox />
                </motion.div>

                {/* Bottom Left - Electronics */}
                <motion.div
                    className="border border-zinc-700 rounded-lg p-2 bg-zinc-900"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h3 className="text-xs font-semibold mb-1 text-center">Electronics</h3>
                    <ElectronicsBox />
                </motion.div>

                {/* Bottom Right - Programming */}
                <motion.div
                    className="border border-zinc-700 rounded-lg p-2 bg-zinc-900"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <h3 className="text-xs font-semibold mb-1 text-center">Programming</h3>
                    <ProgrammingBox />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default InterestsSection;
