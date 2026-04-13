'use client';

/**
 * Fake terminal window for the Programming interest box: cycles through sample commands, types them out,
 * then prints mock “build output” lines on a timer. Loops forever for a screensaver-like effect — not a real shell.
 */
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const ProgrammingBox = () => {
    const [command, setCommand] = useState('');
    const [commandComplete, setCommandComplete] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const animationRef = useRef<number | undefined>(undefined);

    // Color palette
    const colors = {
        cyan: '#00E5FF',
        lightCyan: '#7DF9FF',
        green: '#00ff88',
        darkBg: '#0a0a0a',
    };

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);

    // Terminal commands and logs
    const commands = useMemo(() => [
        '> npm run build',
        '> python app.py',
        '> cargo build',
    ], []);

    const logLines = [
        '✔ Compiling modules...',
        '✔ Build complete',
        '✔ Tests passed',
    ];

    // Main animation cycle
    useEffect(() => {
        const startTime = Date.now();
        let currentCommandIndex = 0;

        const animate = () => {
            const now = Date.now();
            const elapsed = (now - startTime) % 8000; // 8 second loop

            // Determine which cycle we're in based on elapsed time
            const cycleNumber = Math.floor((now - startTime) / 8000);
            const newCommandIndex = cycleNumber % commands.length;

            // Update command index if changed
            if (newCommandIndex !== currentCommandIndex) {
                currentCommandIndex = newCommandIndex;
                setCommand('');
                setCommandComplete(false);
                setShowLogs(false);
            }

            // Phase 1: Type command (0-2500ms)
            if (elapsed < 2500) {
                const currentCmd = commands[currentCommandIndex];
                const typingProgress = elapsed / 2000; // Type over 2 seconds
                const charsToType = Math.floor(typingProgress * currentCmd.length);

                setCommand(currentCmd.substring(0, charsToType));

                if (charsToType >= currentCmd.length) {
                    setCommandComplete(true);
                }

                setShowLogs(false);
            }
            // Phase 2: Show logs (2500-5500ms)
            else if (elapsed < 5500) {
                setCommandComplete(true);
                const logProgress = (elapsed - 2500) / 2000;

                // Show logs with staggered fade-in
                if (logProgress > 0.3) {
                    setShowLogs(true);
                }
            }
            // Phase 3: Hold (5500-7500ms)
            else if (elapsed < 7500) {
                setCommandComplete(true);
                setShowLogs(true);
            }
            // Phase 4: Fade out (7500-8000ms)
            else {
                setCommandComplete(true);
                // Logs fade out
                const fadeProgress = (elapsed - 7500) / 500;
                if (fadeProgress > 0.5) {
                    setShowLogs(false);
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [commands]);

    // Cursor blink effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 530);

        return () => clearInterval(blinkInterval);
    }, []);

    const promptColor = isDarkMode ? colors.lightCyan : colors.cyan;
    const successColor = isDarkMode ? colors.green : '#00cc66';

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-full h-[120px] flex items-center justify-center">
                <svg
                    width="160"
                    height="120"
                    viewBox="0 0 160 220"
                    className="w-full h-full max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Terminal content */}
                    <g>
                        {/* Command line */}
                        <motion.text
                            x="15"
                            y="50"
                            fontSize="14"
                            fill={promptColor}
                            fontFamily="monospace"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: commandComplete ? 1 : 1 }}
                        >
                            {command}
                            {/* Blinking cursor */}
                            {cursorVisible && (
                                <tspan fill={colors.cyan}>█</tspan>
                            )}
                        </motion.text>

                        {/* Log lines - positioned right below command */}
                        {showLogs && logLines.map((line, idx) => {
                            const lineY = 70 + idx * 13; // Start at 102 (12px below command at y=90), 13px spacing
                            return (
                                <motion.text
                                    key={idx}
                                    x="15"
                                    y={lineY}
                                    fontSize="10"
                                    fill={successColor}
                                    fontFamily="monospace"
                                    initial={{ opacity: 0, y: lineY - 5 }}
                                    animate={{ opacity: 1, y: lineY }}
                                    transition={{
                                        delay: idx * 0.15,
                                        duration: 0.4,
                                        ease: "easeOut"
                                    }}
                                >
                                    {line}
                                </motion.text>
                            );
                        })}

                        {/* Subtle glow effect on text */}
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default ProgrammingBox;
