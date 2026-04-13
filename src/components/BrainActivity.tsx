'use client';

/**
 * Stylized brain diagram (SVG): fixed nodes and links between them; a timed sequence highlights nodes and edges
 * to look like activity spreading through the brain. Watches the root `dark` class so lines and fills stay readable.
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Node {
    id: number;
    x: number;
    y: number;
    connections: number[];
}

interface Connection {
    from: number;
    to: number;
}

const BrainActivity = () => {
    const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
    const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
    const [fadingNodes, setFadingNodes] = useState<Set<number>>(new Set());
    const [fadingConnections, setFadingConnections] = useState<Set<string>>(new Set());
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        // Check initially
        checkDarkMode();

        // Watch for changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Brain outline path - more realistic brain shape with two hemispheres
    // Left hemisphere (more detailed, wavy surface)
    //const leftHemisphere = "M 110 50 Q 100 45 90 50 Q 80 55 75 65 Q 70 75 68 88 Q 66 100 70 115 Q 74 130 78 145 Q 82 160 88 175 Q 94 190 102 200 Q 110 210 120 218 Q 130 223 140 222 Q 150 221 158 216 Q 166 211 172 203 Q 178 195 182 185 Q 186 175 187 165 Q 188 155 186 145 Q 184 135 180 127 Q 176 119 170 113 Q 164 107 157 102 Q 150 97 160 94 Q 160 91 150 88 Q 145 85 140 80 Q 150 75 140 68 Q 140 61 120 50 Z";
    // Right hemisphere (mirrored, more detailed)
    //const rightHemisphere = "M 290 50 Q 300 45 310 50 Q 320 55 325 65 Q 330 75 332 88 Q 334 100 330 115 Q 326 130 322 145 Q 318 160 312 175 Q 306 190 298 200 Q 290 210 280 218 Q 270 223 260 222 Q 250 221 242 216 Q 234 211 228 203 Q 222 195 218 185 Q 214 175 213 165 Q 212 155 214 145 Q 216 135 220 127 Q 224 119 230 113 Q 236 107 243 102 Q 250 97 258 94 Q 266 91 275 88 Q 284 85 290 80 Q 296 75 300 68 Q 304 61 290 50 Z";
    // Brain stem and cerebellum
    //const brainStem = "M 185 218 Q 190 230 195 245 Q 195 255 192 265 Q 189 272 195 275 Q 201 272 198 265 Q 201 255 201 245 Q 206 230 211 218 Q 208 220 185 218 Z";
    //const brainPath = `${leftHemisphere} ${rightHemisphere} ${brainStem}`;

    // Define nodes (neurons) positioned throughout the brain
    // Left hemisphere nodes (frontal, parietal, temporal, occipital)
    // Right hemisphere nodes (frontal, parietal, temporal, occipital)
    // Central nodes (corpus callosum connections)
    const nodes: Node[] = useMemo(() => [
        // Left frontal lobe (top-left)
        { id: 0, x: 175, y: 55, connections: [1, 2, 10, 11] },
        { id: 1, x: 150, y: 65, connections: [0, 2, 3, 11] },
        { id: 2, x: 180, y: 95, connections: [0, 1, 3, 4] },
        { id: 3, x: 155, y: 90, connections: [1, 2, 4, 12] },
        { id: 4, x: 130, y: 92, connections: [2, 3, 5, 12] },

        // Left parietal lobe (top-middle-left)
        { id: 5, x: 115, y: 130, connections: [4, 6, 12, 13] },
        { id: 6, x: 140, y: 120, connections: [5, 7, 13, 14] },
        { id: 7, x: 175, y: 120, connections: [6, 8, 12, 15] },
        { id: 8, x: 150, y: 150, connections: [7, 9, 14, 15] },

        // Left temporal lobe (middle-bottom-left)
        { id: 9, x: 110, y: 170, connections: [8, 10, 14, 16] },
        { id: 10, x: 145, y: 187, connections: [0, 9, 11, 16] },
        { id: 11, x: 181, y: 162, connections: [0, 1, 10, 17] },
        { id: 33, x: 180, y: 195, connections: [0, 1, 10, 17] },

        // Left occipital lobe (bottom-left)
        { id: 12, x: 135, y: 220, connections: [3, 4, 5, 13] },
        { id: 13, x: 177, y: 225, connections: [5, 6, 12, 14] },
        { id: 14, x: 160, y: 245, connections: [6, 8, 9, 13] },

        // Central connections (corpus callosum area)
        { id: 15, x: 200, y: 130, connections: [7, 8, 18, 19, 20] },
        { id: 16, x: 200, y: 155, connections: [9, 10, 17, 21] },
        { id: 17, x: 200, y: 185, connections: [11, 16, 21, 22] },

        // Right frontal lobe (top-right)
        { id: 18, x: 225, y: 55, connections: [15, 19, 27, 28] },
        { id: 19, x: 250, y: 65, connections: [15, 18, 20, 28] },
        { id: 20, x: 220, y: 95, connections: [15, 19, 21, 29] },
        { id: 21, x: 245, y: 90, connections: [16, 20, 22, 29] },
        { id: 22, x: 270, y: 92, connections: [17, 21, 23, 29] },

        // Right parietal lobe (top-middle-right)
        { id: 23, x: 285, y: 130, connections: [22, 24, 29, 30] },
        { id: 24, x: 260, y: 120, connections: [23, 25, 30, 31] },
        { id: 25, x: 225, y: 120, connections: [24, 26, 29, 32] },
        { id: 26, x: 250, y: 150, connections: [25, 27, 31, 32] },

        // Right temporal lobe (middle-bottom-right)
        { id: 27, x: 290, y: 170, connections: [18, 26, 28, 31] },
        { id: 28, x: 255, y: 187, connections: [18, 19, 27] },
        { id: 29, x: 219, y: 162, connections: [20, 21, 22] },
        { id: 34, x: 220, y: 195, connections: [20, 21, 22] },

        // Right occipital lobe (bottom-right)
        { id: 30, x: 265, y: 220, connections: [23, 24, 31, 32] },
        { id: 31, x: 223, y: 225, connections: [24, 26, 30, 32] },
        { id: 32, x: 240, y: 245, connections: [25, 26, 34] },
    ], []);

    // Generate connections from nodes (only valid connections where both nodes exist)
    const connections: Connection[] = useMemo(() => {
        const conns: Connection[] = [];
        const nodeIds = new Set(nodes.map(n => n.id));

        nodes.forEach(node => {
            node.connections.forEach(targetId => {
                // Only create connection if target node exists
                if (nodeIds.has(targetId)) {
                    const connectionId = `${Math.min(node.id, targetId)}-${Math.max(node.id, targetId)}`;
                    if (!conns.find(c => `${Math.min(c.from, c.to)}-${Math.max(c.from, c.to)}` === connectionId)) {
                        conns.push({ from: node.id, to: targetId });
                    }
                }
            });
        });
        return conns;
    }, [nodes]);

    const activateNode = useCallback((nodeId: number) => {
        // Clear any existing states to prevent stuck animations
        setActiveNodes(new Set());
        setActiveConnections(new Set());
        setFadingNodes(new Set());
        setFadingConnections(new Set());

        const newActiveNodes = new Set<number>([nodeId]);
        const newActiveConnections = new Set<string>();

        // Activate connected nodes with delay
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        node.connections.forEach((targetId, index) => {
            // Only activate if target node exists
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return;

            setTimeout(() => {
                newActiveNodes.add(targetId);
                const connectionId = `${Math.min(nodeId, targetId)}-${Math.max(nodeId, targetId)}`;
                newActiveConnections.add(connectionId);
                setActiveNodes(new Set(newActiveNodes));
                setActiveConnections(new Set(newActiveConnections));

                // Second-level activation (optional)
                if (Math.random() > 0.5) {
                    setTimeout(() => {
                        const secondNode = nodes.find(n => n.id === targetId);
                        if (!secondNode) return;
                        secondNode.connections.forEach(secondTargetId => {
                            const secondTargetNode = nodes.find(n => n.id === secondTargetId);
                            if (secondTargetNode && secondTargetId !== nodeId && Math.random() > 0.6) {
                                newActiveNodes.add(secondTargetId);
                                const secondConnectionId = `${Math.min(targetId, secondTargetId)}-${Math.max(targetId, secondTargetId)}`;
                                newActiveConnections.add(secondConnectionId);
                                setActiveNodes(new Set(newActiveNodes));
                                setActiveConnections(new Set(newActiveConnections));
                            }
                        });
                    }, 300);
                }
            }, index * 100 + 50);
        });

        setActiveNodes(newActiveNodes);
        setActiveConnections(newActiveConnections);

        // Start fade-out after most of the animation (700ms into the 1200ms cycle)
        setTimeout(() => {
            // Move active nodes/connections to fading state
            setFadingNodes(new Set(newActiveNodes));
            setFadingConnections(new Set(newActiveConnections));
            setActiveNodes(new Set());
            setActiveConnections(new Set());
        }, 700);

        // Fully reset after fade completes (1200ms total)
        setTimeout(() => {
            setFadingNodes(new Set());
            setFadingConnections(new Set());
        }, 1200);
    }, [nodes]);

    // Trigger neural activity
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly select a starting node by ID
            const randomIndex = Math.floor(Math.random() * nodes.length);
            const startNodeId = nodes[randomIndex]?.id;
            if (startNodeId !== undefined) {
                activateNode(startNodeId);
            }
        }, 1500); // Trigger every 1.5 seconds

        return () => clearInterval(interval);
    }, [activateNode, nodes]);

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-full h-[120px] flex items-center justify-center">
                <svg
                    width="400"
                    height="300"
                    viewBox="0 0 400 300"
                    className="w-full h-full max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Brain circuitry background image */}
                    <image
                        href="/images/Brain_Circuitry_Img.png"
                        x="0"
                        y="0"
                        width="400"
                        height="300"
                        preserveAspectRatio="xMidYMid meet"
                        opacity={isDarkMode ? "0.2" : "0.4"}
                        style={!isDarkMode ? { filter: 'brightness(0.4) contrast(1.2)' } : { filter: 'brightness(1.2)' }}
                    />

                    {/* Circuit connections (lines) */}
                    {connections.map((conn, idx) => {
                        const fromNode = nodes.find(n => n.id === conn.from);
                        const toNode = nodes.find(n => n.id === conn.to);
                        const connectionId = `${Math.min(conn.from, conn.to)}-${Math.max(conn.from, conn.to)}`;
                        const isActive = activeConnections.has(connectionId);
                        const isFading = fadingConnections.has(connectionId);

                        // Skip if either node doesn't exist
                        if (!fromNode || !toNode) return null;

                        // Active connections should be dark gray
                        const activeStrokeColor = "#4b5563";
                        const inactiveStrokeColor = "#e5e7eb";

                        return (
                            <motion.line
                                key={idx}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={isActive || isFading ? activeStrokeColor : inactiveStrokeColor}
                                strokeWidth={isActive || isFading ? "2.5" : "1"}
                                className="dark:stroke-zinc-700"
                                initial={{ pathLength: 0, opacity: 0.3 }}
                                animate={{
                                    pathLength: 1,
                                    opacity: isActive ? 1 : isFading ? [1, 0.3] : 0.3,
                                    stroke: isActive || isFading ? activeStrokeColor : inactiveStrokeColor,
                                }}
                                transition={{
                                    duration: isFading ? 0.5 : 0.4,
                                    ease: isFading ? "easeOut" : "easeOut",
                                }}
                            />
                        );
                    })}

                    {/* Neural nodes with glow effects */}
                    {nodes.map((node) => {
                        const isActive = activeNodes.has(node.id);
                        const isFading = fadingNodes.has(node.id);
                        return (
                            <g key={node.id}>
                                {/* Glow effect for active nodes */}
                                {(isActive || isFading) && (
                                    <motion.circle
                                        key={`glow-${node.id}-${isActive}`}
                                        cx={node.x}
                                        cy={node.y}
                                        r={12}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isActive ? [0.8, 0] : isFading ? [0.8, 0] : 0,
                                            scale: isActive || isFading ? [0.8, 1.5] : 0.8,
                                        }}
                                        transition={{
                                            duration: isFading ? 0.5 : 0.6,
                                            ease: "easeOut",
                                            repeat: isActive ? Infinity : 0,
                                        }}
                                    />
                                )}
                                {/* Node circle */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={isActive || isFading ? 6 : 4}
                                    fill={isActive || isFading
                                        ? (isDarkMode ? "#e0f2fe" : "#1e293b")
                                        : "#9ca3af"}
                                    className="dark:fill-zinc-600"
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{
                                        scale: isActive ? 1.2 : isFading ? [1.2, 1] : 1,
                                        opacity: isActive ? 1 : isFading ? [1, 0.5] : 0.5,
                                        fill: isActive || isFading
                                            ? (isDarkMode ? "#e0f2fe" : "#1e293b")
                                            : "#9ca3af",
                                    }}
                                    transition={{
                                        duration: isFading ? 0.5 : 0.3,
                                        ease: "easeOut",
                                    }}
                                />
                                {/* Bright white overlay for active/fading nodes (only in dark mode) */}
                                {(isActive || isFading) && isDarkMode && (
                                    <motion.circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={5}
                                        fill="#ffffff"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: isFading ? [0.8, 0] : 0.8 }}
                                        transition={{
                                            duration: isFading ? 0.5 : 0.2,
                                            ease: "easeOut",
                                        }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default BrainActivity;

