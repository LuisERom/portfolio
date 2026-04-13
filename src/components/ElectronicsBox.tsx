'use client';

/**
 * Decorative canvas for the Electronics interest box: draws an IC-style package, animates pins, and shows
 * moving signals along traces. Resizes with its container; purely visual — no controls.
 */
import { useEffect, useRef } from 'react';

interface Pin {
    id: number;
    x: number;
    y: number;
    side: 'top' | 'right' | 'bottom' | 'left';
    index: number;
}

const ElectronicsBox = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const pinsRef = useRef<Pin[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: false,
        });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        let lastWidth = 0;
        let lastHeight = 0;
        let lastDPR = 0;
        let lastInitWidth = 0;
        let lastInitHeight = 0;
        const animationStartTime = Date.now();

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = rect.width;
            const height = rect.height;

            if (width === lastWidth && height === lastHeight && dpr === lastDPR) {
                return;
            }

            lastWidth = width;
            lastHeight = height;
            lastDPR = dpr;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        resizeObserver.observe(container);

        // Initialize pins based on container size
        const initializePins = (width: number, height: number) => {
            const centerX = width / 2;
            const centerY = height / 2;
            const chipSize = 25;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const pinLength = 4;
            const pinsPerSide = 4;

            pinsRef.current = [];

            // Top side pins - aligned with chip top edge
            for (let i = 0; i < pinsPerSide; i++) {
                const pinX = centerX - chipSize / 2 + (chipSize / (pinsPerSide + 1)) * (i + 1);
                pinsRef.current.push({
                    id: i,
                    x: pinX,
                    y: centerY - chipSize / 2,
                    side: 'top',
                    index: i,
                });
            }

            // Right side pins - aligned with chip right edge
            for (let i = 0; i < pinsPerSide; i++) {
                const pinY = centerY - chipSize / 2 + (chipSize / (pinsPerSide + 1)) * (i + 1);
                pinsRef.current.push({
                    id: pinsPerSide + i,
                    x: centerX + chipSize / 2,
                    y: pinY,
                    side: 'right',
                    index: i,
                });
            }

            // Bottom side pins - aligned with chip bottom edge
            for (let i = 0; i < pinsPerSide; i++) {
                const pinX = centerX - chipSize / 2 + (chipSize / (pinsPerSide + 1)) * (i + 1);
                pinsRef.current.push({
                    id: pinsPerSide * 2 + i,
                    x: pinX,
                    y: centerY + chipSize / 2,
                    side: 'bottom',
                    index: i,
                });
            }

            // Left side pins - aligned with chip left edge
            for (let i = 0; i < pinsPerSide; i++) {
                const pinY = centerY - chipSize / 2 + (chipSize / (pinsPerSide + 1)) * (i + 1);
                pinsRef.current.push({
                    id: pinsPerSide * 3 + i,
                    x: centerX - chipSize / 2,
                    y: pinY,
                    side: 'left',
                    index: i,
                });
            }
        };

        // Helper function to calculate total path length
        const calculatePathLength = (
            startX: number,
            startY: number,
            endX: number,
            endY: number,
            clearX: number | null,
            clearY: number | null,
            diagonalDist: number | null
        ): number => {
            if (!clearX && !clearY) {
                // Straight line
                return Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            }

            // Calculate segment lengths
            let segment1Length = 0;
            let segment2Length = 0;
            let segment3Length = 0;

            if (clearX !== null) {
                segment1Length = Math.abs(clearX - startX);
                if (diagonalDist !== null) {
                    segment2Length = diagonalDist * Math.sqrt(2);
                    // Calculate segment 3 length
                    const segment3StartX = clearX + (endX > clearX ? diagonalDist : -diagonalDist);
                    const segment3StartY = startY + (endY > startY ? diagonalDist : -diagonalDist);
                    segment3Length = Math.sqrt(
                        Math.pow(endX - segment3StartX, 2) +
                        Math.pow(endY - segment3StartY, 2)
                    );
                } else {
                    segment3Length = Math.sqrt(
                        Math.pow(endX - clearX, 2) +
                        Math.pow(endY - startY, 2)
                    );
                }
            } else if (clearY !== null) {
                segment1Length = Math.abs(clearY - startY);
                if (diagonalDist !== null) {
                    segment2Length = diagonalDist * Math.sqrt(2);
                    // Calculate segment 3 length
                    const segment3StartX = startX + (endX > startX ? diagonalDist : -diagonalDist);
                    const segment3StartY = clearY + (endY > clearY ? diagonalDist : -diagonalDist);
                    segment3Length = Math.sqrt(
                        Math.pow(endX - segment3StartX, 2) +
                        Math.pow(endY - segment3StartY, 2)
                    );
                } else {
                    segment3Length = Math.sqrt(
                        Math.pow(endX - startX, 2) +
                        Math.pow(endY - clearY, 2)
                    );
                }
            }

            return segment1Length + segment2Length + segment3Length;
        };

        // Helper function to get point along a path at progress (0-1)
        const getPointAlongPath = (
            startX: number,
            startY: number,
            endX: number,
            endY: number,
            clearX: number | null,
            clearY: number | null,
            diagonalDist: number | null,
            progress: number
        ): { x: number; y: number } => {
            if (!clearX && !clearY) {
                // Straight line
                return {
                    x: startX + (endX - startX) * progress,
                    y: startY + (endY - startY) * progress,
                };
            }

            // Calculate segment lengths
            let segment1Length = 0;
            let segment2Length = 0;
            let segment3Length = 0;

            if (clearX !== null) {
                segment1Length = Math.abs(clearX - startX);
                if (diagonalDist !== null) {
                    segment2Length = diagonalDist * Math.sqrt(2);
                    segment3Length = Math.abs(endX - (startX < clearX ? clearX + diagonalDist : clearX - diagonalDist)) ||
                        Math.abs(endY - (startY < clearY! ? clearY! + diagonalDist : clearY! - diagonalDist)) ||
                        Math.abs(endX - (startX < clearX ? clearX - diagonalDist : clearX + diagonalDist));
                } else {
                    segment3Length = Math.abs(endX - clearX) || Math.abs(endY - startY);
                }
            } else if (clearY !== null) {
                segment1Length = Math.abs(clearY - startY);
                if (diagonalDist !== null) {
                    segment2Length = diagonalDist * Math.sqrt(2);
                    segment3Length = Math.abs(endX - startX) || Math.abs(endY - (startY < clearY ? clearY + diagonalDist : clearY - diagonalDist));
                } else {
                    segment3Length = Math.abs(endX - startX) || Math.abs(endY - clearY);
                }
            }

            const totalLength = segment1Length + segment2Length + segment3Length;
            const distance = totalLength * progress;

            if (distance <= segment1Length) {
                // In segment 1
                const t = segment1Length > 0 ? distance / segment1Length : 0;
                if (clearX !== null) {
                    return { x: startX + (clearX - startX) * t, y: startY };
                } else {
                    return { x: startX, y: startY + (clearY! - startY) * t };
                }
            } else if (distance <= segment1Length + segment2Length) {
                // In segment 2 (diagonal)
                const t = segment2Length > 0 ? (distance - segment1Length) / segment2Length : 0;
                if (clearX !== null && diagonalDist !== null) {
                    const diagonalEndX = clearX + (endX > clearX ? diagonalDist : -diagonalDist);
                    const diagonalEndY = startY + (endY > startY ? diagonalDist : -diagonalDist);
                    return {
                        x: (clearX || startX) + (diagonalEndX - (clearX || startX)) * t,
                        y: startY + (diagonalEndY - startY) * t,
                    };
                } else if (clearY !== null && diagonalDist !== null) {
                    const diagonalEndX = startX + (endX > startX ? diagonalDist : -diagonalDist);
                    const diagonalEndY = (clearY || startY) + (endY > (clearY || startY) ? diagonalDist : -diagonalDist);
                    return {
                        x: startX + (diagonalEndX - startX) * t,
                        y: (clearY || startY) + (diagonalEndY - (clearY || startY)) * t,
                    };
                }
            } else {
                // In segment 3
                const t = segment3Length > 0 ? (distance - segment1Length - segment2Length) / segment3Length : 0;
                if (clearX !== null && diagonalDist !== null) {
                    const segment3StartX = clearX + (endX > clearX ? diagonalDist : -diagonalDist);
                    const segment3StartY = startY + (endY > startY ? diagonalDist : -diagonalDist);
                    return {
                        x: segment3StartX + (endX - segment3StartX) * t,
                        y: segment3StartY + (endY - segment3StartY) * t,
                    };
                } else if (clearY !== null && diagonalDist !== null) {
                    const segment3StartX = startX + (endX > startX ? diagonalDist : -diagonalDist);
                    const segment3StartY = clearY + (endY > clearY ? diagonalDist : -diagonalDist);
                    return {
                        x: segment3StartX + (endX - segment3StartX) * t,
                        y: segment3StartY + (endY - segment3StartY) * t,
                    };
                } else {
                    return {
                        x: (clearX || startX) + (endX - (clearX || startX)) * t,
                        y: (clearY || startY) + (endY - (clearY || startY)) * t,
                    };
                }
            }
            return { x: endX, y: endY };
        };

        const animate = () => {
            resizeCanvas();

            const rect = container.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const currentTime = Date.now();
            const elapsed = (currentTime - animationStartTime) / 1000; // in seconds

            // Reinitialize pins whenever container size changes
            if (pinsRef.current.length === 0 ||
                Math.abs(width - lastInitWidth) > 0.5 ||
                Math.abs(height - lastInitHeight) > 0.5) {
                initializePins(width, height);
                lastInitWidth = width;
                lastInitHeight = height;
            }

            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw central chip (outline only)
            const chipSize = 25;
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(100, 200, 255, 0.5)';
            ctx.strokeRect(
                centerX - chipSize / 2,
                centerY - chipSize / 2,
                chipSize,
                chipSize
            );
            ctx.shadowBlur = 0;

            // PCB component positions (relative to center chip)
            const pinLength = 4;
            const pinWidth = 2;
            const componentSize = 18;
            const componentX = centerX - chipSize / 2 - pinLength - 35; // Position to the left of chip
            const componentY = centerY;
            const componentPinsPerSide = 3;
            const componentPinSpacing = componentSize / (componentPinsPerSide + 1);
            const componentPinLength = 3;
            const componentPinWidth = 1.5;

            // Via/pad position (circuit hole)
            const viaX = componentX - componentSize / 2 - 20;
            const viaY = componentY;
            const viaRadius = 3.5;
            const viaHoleRadius = 1.5;

            // Get the middle 2 left pins (indices 1 and 2, which are 2nd and 3rd from top)
            const leftPins = pinsRef.current.filter(p => p.side === 'left').sort((a, b) => a.index - b.index);
            const middleLeftPin1 = leftPins[1]; // 2nd pin (index 1)
            const middleLeftPin2 = leftPins[2]; // 3rd pin (index 2)

            // Draw PCB traces first (behind everything) - using 45-degree diagonals with horizontal/vertical near pins
            if (middleLeftPin1 && middleLeftPin2) {
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)'; // Light gray
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Trace from middle left pin 1 to component pin 1
                const componentPin1Y = componentY - componentSize / 2 + componentPinSpacing * 1;
                const pin1StartX = centerX - chipSize / 2 - pinLength;
                const pin1StartY = middleLeftPin1.y;
                const pin1EndX = componentX + componentSize / 2;
                const pin1EndY = componentPin1Y;

                // Horizontal segment from pin (clear pin area - go left)
                const pin1ClearX = pin1StartX - 8;

                // Calculate distances
                const dy1 = pin1EndY - pin1StartY;

                ctx.beginPath();
                // Horizontal from pin (left to clear pin)
                ctx.moveTo(pin1StartX, pin1StartY);
                ctx.lineTo(pin1ClearX, pin1StartY);

                // 45-degree diagonal if needed (move equally in X and Y)
                if (Math.abs(dy1) > 1) {
                    const diagonalDist = Math.abs(dy1); // For 45 degrees, move same distance in both directions
                    // Determine if we go left or right based on where destination is
                    if (pin1EndX < pin1ClearX) {
                        // Destination is left, so diagonal goes left
                        if (dy1 > 0) {
                            // Going down and left
                            ctx.lineTo(pin1ClearX - diagonalDist, pin1StartY + diagonalDist);
                        } else {
                            // Going up and left
                            ctx.lineTo(pin1ClearX - diagonalDist, pin1StartY - diagonalDist);
                        }
                    } else {
                        // Destination is right, so diagonal goes right
                        if (dy1 > 0) {
                            // Going down and right
                            ctx.lineTo(pin1ClearX + diagonalDist, pin1StartY + diagonalDist);
                        } else {
                            // Going up and right
                            ctx.lineTo(pin1ClearX + diagonalDist, pin1StartY - diagonalDist);
                        }
                    }
                    // Horizontal into component pin
                    ctx.lineTo(pin1EndX, pin1EndY);
                } else {
                    // Straight horizontal if already aligned vertically
                    ctx.lineTo(pin1EndX, pin1EndY);
                }
                ctx.stroke();

                // Trace from middle left pin 2 to component pin 2
                const componentPin2Y = componentY - componentSize / 2 + componentPinSpacing * 2;
                const pin2StartX = centerX - chipSize / 2 - pinLength;
                const pin2StartY = middleLeftPin2.y;
                const pin2EndX = componentX + componentSize / 2;
                const pin2EndY = componentPin2Y;

                // Horizontal segment from pin (clear pin area - go left)
                const pin2ClearX = pin2StartX - 8;

                // Calculate distances
                const dy2 = pin2EndY - pin2StartY;

                ctx.beginPath();
                // Horizontal from pin (left to clear pin)
                ctx.moveTo(pin2StartX, pin2StartY);
                ctx.lineTo(pin2ClearX, pin2StartY);

                // 45-degree diagonal if needed (move equally in X and Y)
                if (Math.abs(dy2) > 1) {
                    const diagonalDist2 = Math.abs(dy2); // For 45 degrees, move same distance in both directions
                    // Determine if we go left or right based on where destination is
                    if (pin2EndX < pin2ClearX) {
                        // Destination is left, so diagonal goes left
                        if (dy2 > 0) {
                            // Going down and left
                            ctx.lineTo(pin2ClearX - diagonalDist2, pin2StartY + diagonalDist2);
                        } else {
                            // Going up and left
                            ctx.lineTo(pin2ClearX - diagonalDist2, pin2StartY - diagonalDist2);
                        }
                    } else {
                        // Destination is right, so diagonal goes right
                        if (dy2 > 0) {
                            // Going down and right
                            ctx.lineTo(pin2ClearX + diagonalDist2, pin2StartY + diagonalDist2);
                        } else {
                            // Going up and right
                            ctx.lineTo(pin2ClearX + diagonalDist2, pin2StartY - diagonalDist2);
                        }
                    }
                    // Horizontal into component pin
                    ctx.lineTo(pin2EndX, pin2EndY);
                } else {
                    // Straight horizontal if already aligned vertically
                    ctx.lineTo(pin2EndX, pin2EndY);
                }
                ctx.stroke();

                // Trace from component's left pin to via
                const componentLeftPinY = componentY;
                const viaStartX = componentX - componentSize / 2;
                const viaStartY = componentLeftPinY;

                // Horizontal segment from pin (clear pin area - go left)
                const viaClearX = viaStartX - 8;

                // Calculate distances
                const viaDy = viaY - viaStartY;

                ctx.beginPath();
                // Horizontal from pin (left to clear pin)
                ctx.moveTo(viaStartX, viaStartY);
                ctx.lineTo(viaClearX, viaStartY);

                // 45-degree diagonal if needed (move equally in X and Y)
                if (Math.abs(viaDy) > 1) {
                    const viaDiagonalDist = Math.abs(viaDy); // For 45 degrees, move same distance in both directions
                    // Determine if we go left or right based on where destination is
                    if (viaX < viaClearX) {
                        // Destination is left, so diagonal goes left
                        if (viaDy > 0) {
                            // Going down and left
                            ctx.lineTo(viaClearX - viaDiagonalDist, viaStartY + viaDiagonalDist);
                        } else {
                            // Going up and left
                            ctx.lineTo(viaClearX - viaDiagonalDist, viaStartY - viaDiagonalDist);
                        }
                    } else {
                        // Destination is right, so diagonal goes right
                        if (viaDy > 0) {
                            // Going down and right
                            ctx.lineTo(viaClearX + viaDiagonalDist, viaStartY + viaDiagonalDist);
                        } else {
                            // Going up and right
                            ctx.lineTo(viaClearX + viaDiagonalDist, viaStartY - viaDiagonalDist);
                        }
                    }
                    // Horizontal into via
                    ctx.lineTo(viaX, viaY);
                } else {
                    // Straight horizontal if already aligned vertically
                    ctx.lineTo(viaX, viaY);
                }
                ctx.stroke();
            }

            // Additional components and traces
            // Component 2 - Right side
            const component2Size = 16;
            const component2X = centerX + chipSize / 2 + pinLength + 30;
            const component2Y = centerY - 8;
            const component2PinsPerSide = 2;
            const component2PinSpacing = component2Size / (component2PinsPerSide + 1);

            // Component 3 - Top side
            const component3Size = 15;
            const component3X = centerX + 10;
            const component3Y = centerY - chipSize / 2 - pinLength - 25;
            const component3PinsPerSide = 2;
            const component3PinSpacing = component3Size / (component3PinsPerSide + 1);

            // Component 4 - Bottom side
            const component4Size = 14;
            const component4X = centerX - 12;
            const component4Y = centerY + chipSize / 2 + pinLength + 25;
            const component4PinsPerSide = 2;
            const component4PinSpacing = component4Size / (component4PinsPerSide + 1);

            // Additional vias
            const via2X = component2X + component2Size / 2 + 18;
            const via2Y = component2Y;
            const via3X = component3X;
            const via3Y = component3Y - component3Size / 2 - 7;

            // Draw additional traces
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Get pins for connections
            const rightPins = pinsRef.current.filter(p => p.side === 'right').sort((a, b) => a.index - b.index);
            const topPins = pinsRef.current.filter(p => p.side === 'top').sort((a, b) => a.index - b.index);
            const bottomPins = pinsRef.current.filter(p => p.side === 'bottom').sort((a, b) => a.index - b.index);

            // Trace from right pin 1 to component 2
            if (rightPins[1]) {
                const rPin1 = rightPins[1];
                const rPin1StartX = centerX + chipSize / 2 + pinLength;
                const rPin1StartY = rPin1.y;
                const rPin1EndX = component2X - component2Size / 2;
                const rPin1EndY = component2Y - component2Size / 2 + component2PinSpacing * 1;

                const rPin1ClearX = rPin1StartX + 8;
                const rDy1 = rPin1EndY - rPin1StartY;

                ctx.beginPath();
                ctx.moveTo(rPin1StartX, rPin1StartY);
                ctx.lineTo(rPin1ClearX, rPin1StartY);

                if (Math.abs(rDy1) > 1) {
                    const rDiagonalDist1 = Math.abs(rDy1);
                    if (rPin1EndX > rPin1ClearX) {
                        if (rDy1 > 0) {
                            ctx.lineTo(rPin1ClearX + rDiagonalDist1, rPin1StartY + rDiagonalDist1);
                        } else {
                            ctx.lineTo(rPin1ClearX + rDiagonalDist1, rPin1StartY - rDiagonalDist1);
                        }
                    } else {
                        if (rDy1 > 0) {
                            ctx.lineTo(rPin1ClearX - rDiagonalDist1, rPin1StartY + rDiagonalDist1);
                        } else {
                            ctx.lineTo(rPin1ClearX - rDiagonalDist1, rPin1StartY - rDiagonalDist1);
                        }
                    }
                    ctx.lineTo(rPin1EndX, rPin1EndY);
                } else {
                    ctx.lineTo(rPin1EndX, rPin1EndY);
                }
                ctx.stroke();
            }

            // Trace from top pin 2 to component 3
            if (topPins[2]) {
                const tPin2 = topPins[2];
                const tPin2StartX = tPin2.x;
                const tPin2StartY = centerY - chipSize / 2 - pinLength;
                const tPin2EndX = component3X - component3Size / 2 + component3PinSpacing * 2;
                const tPin2EndY = component3Y + component3Size / 2;

                const tPin2ClearY = tPin2StartY - 4;
                const tDx2 = tPin2EndX - tPin2StartX;

                ctx.beginPath();
                ctx.moveTo(tPin2StartX, tPin2StartY);
                ctx.lineTo(tPin2StartX, tPin2ClearY);

                if (Math.abs(tDx2) > 1) {
                    const tDiagonalDist2 = Math.abs(tDx2);
                    if (tPin2EndY < tPin2ClearY) {
                        if (tDx2 > 0) {
                            ctx.lineTo(tPin2StartX + tDiagonalDist2, tPin2ClearY - tDiagonalDist2);
                        } else {
                            ctx.lineTo(tPin2StartX - tDiagonalDist2, tPin2ClearY - tDiagonalDist2);
                        }
                    } else {
                        if (tDx2 > 0) {
                            ctx.lineTo(tPin2StartX + tDiagonalDist2, tPin2ClearY + tDiagonalDist2);
                        } else {
                            ctx.lineTo(tPin2StartX - tDiagonalDist2, tPin2ClearY + tDiagonalDist2);
                        }
                    }
                    ctx.lineTo(tPin2EndX, tPin2EndY);
                } else {
                    ctx.lineTo(tPin2EndX, tPin2EndY);
                }
                ctx.stroke();
            }

            // Trace from bottom pin 1 to component 4
            if (bottomPins[1]) {
                const bPin1 = bottomPins[1];
                const bPin1StartX = bPin1.x;
                const bPin1StartY = centerY + chipSize / 2 + pinLength;
                const bPin1EndX = component4X + component4Size / 2 - component4PinSpacing * 1;
                const bPin1EndY = component4Y - component4Size / 2;

                const bPin1ClearY = bPin1StartY + 8;
                const bDx1 = bPin1EndX - bPin1StartX;

                ctx.beginPath();
                ctx.moveTo(bPin1StartX, bPin1StartY);
                ctx.lineTo(bPin1StartX, bPin1ClearY);

                if (Math.abs(bDx1) > 1) {
                    const bDiagonalDist1 = Math.abs(bDx1);
                    if (bPin1EndY > bPin1ClearY) {
                        if (bDx1 > 0) {
                            ctx.lineTo(bPin1StartX + bDiagonalDist1, bPin1ClearY + bDiagonalDist1);
                        } else {
                            ctx.lineTo(bPin1StartX - bDiagonalDist1, bPin1ClearY + bDiagonalDist1);
                        }
                    } else {
                        if (bDx1 > 0) {
                            ctx.lineTo(bPin1StartX + bDiagonalDist1, bPin1ClearY - bDiagonalDist1);
                        } else {
                            ctx.lineTo(bPin1StartX - bDiagonalDist1, bPin1ClearY - bDiagonalDist1);
                        }
                    }
                    ctx.lineTo(bPin1EndX, bPin1EndY);
                } else {
                    ctx.lineTo(bPin1EndX, bPin1EndY);
                }
                ctx.stroke();
            }

            // Trace from component 2 to via 2
            const comp2RightPinX = component2X + component2Size / 2;
            const comp2RightPinY = component2Y;
            const comp2ViaClearX = comp2RightPinX + 8;
            const comp2ViaDy = via2Y - comp2RightPinY;

            ctx.beginPath();
            ctx.moveTo(comp2RightPinX, comp2RightPinY);
            ctx.lineTo(comp2ViaClearX, comp2RightPinY);

            if (Math.abs(comp2ViaDy) > 1) {
                const comp2ViaDiagonalDist = Math.abs(comp2ViaDy);
                if (via2X > comp2ViaClearX) {
                    if (comp2ViaDy > 0) {
                        ctx.lineTo(comp2ViaClearX + comp2ViaDiagonalDist, comp2RightPinY + comp2ViaDiagonalDist);
                    } else {
                        ctx.lineTo(comp2ViaClearX + comp2ViaDiagonalDist, comp2RightPinY - comp2ViaDiagonalDist);
                    }
                } else {
                    if (comp2ViaDy > 0) {
                        ctx.lineTo(comp2ViaClearX - comp2ViaDiagonalDist, comp2RightPinY + comp2ViaDiagonalDist);
                    } else {
                        ctx.lineTo(comp2ViaClearX - comp2ViaDiagonalDist, comp2RightPinY - comp2ViaDiagonalDist);
                    }
                }
                ctx.lineTo(via2X, via2Y);
            } else {
                ctx.lineTo(via2X, via2Y);
            }
            ctx.stroke();

            // Trace from component 3 to via 3
            const comp3TopPinX = component3X;
            const comp3TopPinY = component3Y - component3Size / 2;
            const comp3ViaClearY = comp3TopPinY;
            const comp3ViaDx = via3X - comp3TopPinX;

            ctx.beginPath();
            ctx.moveTo(comp3TopPinX, comp3TopPinY);
            ctx.lineTo(comp3TopPinX, comp3ViaClearY);

            if (Math.abs(comp3ViaDx) > 1) {
                const comp3ViaDiagonalDist = Math.abs(comp3ViaDx);
                if (via3Y < comp3ViaClearY) {
                    if (comp3ViaDx > 0) {
                        ctx.lineTo(comp3TopPinX + comp3ViaDiagonalDist, comp3ViaClearY - comp3ViaDiagonalDist);
                    } else {
                        ctx.lineTo(comp3TopPinX - comp3ViaDiagonalDist, comp3ViaClearY - comp3ViaDiagonalDist);
                    }
                } else {
                    if (comp3ViaDx > 0) {
                        ctx.lineTo(comp3TopPinX + comp3ViaDiagonalDist, comp3ViaClearY + comp3ViaDiagonalDist);
                    } else {
                        ctx.lineTo(comp3TopPinX - comp3ViaDiagonalDist, comp3ViaClearY + comp3ViaDiagonalDist);
                    }
                }
                ctx.lineTo(via3X, via3Y);
            } else {
                ctx.lineTo(via3X, via3Y);
            }
            ctx.stroke();

            // Additional vias (new PCB holes)
            const via4X = centerX + chipSize / 2 + 20;
            const via4Y = centerY + chipSize / 2 + 15;
            const via5X = centerX - chipSize / 2 - 25;
            const via5Y = centerY - chipSize / 2 - 18;
            const via6X = componentX - componentSize / 2 - 35;
            const via6Y = componentY + 20;
            // New via at the end of left pin 3 trace - at the original endpoint
            const via9X = via6X + 20;
            const via9Y = via6Y;
            const via7X = component2X + component2Size / 2 + 23;
            const via7Y = component2Y - 18;
            const via8X = centerX + 15;
            const via8Y = centerY + chipSize / 2 + 22;

            // Trace from top pin 0 to via 5
            if (topPins[0]) {
                const tPin0 = topPins[0];
                const tPin0StartX = tPin0.x;
                const tPin0StartY = centerY - chipSize / 2 - pinLength;
                const tPin0ClearY = tPin0StartY - 8;
                const tPin0Dx = via5X - tPin0StartX;
                const tPin0Dy = via5Y - tPin0ClearY;

                ctx.beginPath();
                ctx.moveTo(tPin0StartX, tPin0StartY);
                ctx.lineTo(tPin0StartX, tPin0ClearY);

                if (Math.abs(tPin0Dx) > 1 || Math.abs(tPin0Dy) > 1) {
                    const tPin0DiagonalDist = Math.min(Math.abs(tPin0Dx), Math.abs(tPin0Dy));
                    if (tPin0Dy < 0) {
                        // Going up
                        if (tPin0Dx > 0) {
                            ctx.lineTo(tPin0StartX + tPin0DiagonalDist, tPin0ClearY - tPin0DiagonalDist);
                        } else {
                            ctx.lineTo(tPin0StartX - tPin0DiagonalDist, tPin0ClearY - tPin0DiagonalDist);
                        }
                    } else {
                        // Going down
                        if (tPin0Dx > 0) {
                            ctx.lineTo(tPin0StartX + tPin0DiagonalDist, tPin0ClearY + tPin0DiagonalDist);
                        } else {
                            ctx.lineTo(tPin0StartX - tPin0DiagonalDist, tPin0ClearY + tPin0DiagonalDist);
                        }
                    }
                    ctx.lineTo(via5X, via5Y);
                } else {
                    ctx.lineTo(via5X, via5Y);
                }
                ctx.stroke();
            }

            // Trace from right pin 3 to via 4
            if (rightPins[3]) {
                const rPin3 = rightPins[3];
                const rPin3StartX = centerX + chipSize / 2 + pinLength;
                const rPin3StartY = rPin3.y;
                const rPin3ClearX = rPin3StartX + 8;
                const rPin3Dx = via4X - rPin3ClearX;
                const rPin3Dy = via4Y - rPin3StartY;

                ctx.beginPath();
                ctx.moveTo(rPin3StartX, rPin3StartY);
                ctx.lineTo(rPin3ClearX, rPin3StartY);

                if (Math.abs(rPin3Dx) > 1 || Math.abs(rPin3Dy) > 1) {
                    const rPin3DiagonalDist = Math.min(Math.abs(rPin3Dx), Math.abs(rPin3Dy));
                    if (rPin3Dx > 0) {
                        // Going right
                        if (rPin3Dy > 0) {
                            ctx.lineTo(rPin3ClearX + rPin3DiagonalDist, rPin3StartY + rPin3DiagonalDist);
                        } else {
                            ctx.lineTo(rPin3ClearX + rPin3DiagonalDist, rPin3StartY - rPin3DiagonalDist);
                        }
                    } else {
                        // Going left
                        if (rPin3Dy > 0) {
                            ctx.lineTo(rPin3ClearX - rPin3DiagonalDist, rPin3StartY + rPin3DiagonalDist);
                        } else {
                            ctx.lineTo(rPin3ClearX - rPin3DiagonalDist, rPin3StartY - rPin3DiagonalDist);
                        }
                    }
                    ctx.lineTo(via4X, via4Y);
                } else {
                    ctx.lineTo(via4X, via4Y);
                }
                ctx.stroke();
            }

            // Trace from left pin 3 to via 9
            if (leftPins[3]) {
                const lPin3 = leftPins[3];
                const lPin3StartX = centerX - chipSize / 2 - pinLength;
                const lPin3StartY = lPin3.y;
                const lPin3ClearX = lPin3StartX - 8;
                const lPin3Dx = via9X - lPin3ClearX;
                const lPin3Dy = via9Y - lPin3StartY;

                ctx.beginPath();
                ctx.moveTo(lPin3StartX, lPin3StartY);
                ctx.lineTo(lPin3ClearX, lPin3StartY);

                if (Math.abs(lPin3Dx) > 1 || Math.abs(lPin3Dy) > 1) {
                    const lPin3DiagonalDist = Math.min(Math.abs(lPin3Dx), Math.abs(lPin3Dy));
                    if (lPin3Dx < 0) {
                        // Going left
                        if (lPin3Dy > 0) {
                            ctx.lineTo(lPin3ClearX - lPin3DiagonalDist, lPin3StartY + lPin3DiagonalDist);
                        } else {
                            ctx.lineTo(lPin3ClearX - lPin3DiagonalDist, lPin3StartY - lPin3DiagonalDist);
                        }
                    } else {
                        // Going right
                        if (lPin3Dy > 0) {
                            ctx.lineTo(lPin3ClearX + lPin3DiagonalDist, lPin3StartY + lPin3DiagonalDist);
                        } else {
                            ctx.lineTo(lPin3ClearX + lPin3DiagonalDist, lPin3StartY - lPin3DiagonalDist);
                        }
                    }
                    ctx.lineTo(via9X, via9Y);
                } else {
                    ctx.lineTo(via9X, via9Y);
                }
                ctx.stroke();
            }

            // Trace from top pin 3 (top-right) to via 7
            if (topPins[3]) {
                const tPin3 = topPins[3];
                const tPin3StartX = tPin3.x;
                const tPin3StartY = centerY - chipSize / 2 - pinLength;
                const tPin3ClearY = tPin3StartY - 4;
                const tPin3Dx = via7X - tPin3StartX;
                const tPin3Dy = via7Y - tPin3ClearY;

                ctx.beginPath();
                ctx.moveTo(tPin3StartX, tPin3StartY);
                ctx.lineTo(tPin3StartX, tPin3ClearY);

                if (Math.abs(tPin3Dx) > 1 || Math.abs(tPin3Dy) > 1) {
                    const tPin3DiagonalDist = Math.min(Math.abs(tPin3Dx), Math.abs(tPin3Dy));
                    if (tPin3Dy > 0) {
                        // Going down
                        if (tPin3Dx > 0) {
                            ctx.lineTo(tPin3StartX + tPin3DiagonalDist, tPin3ClearY + tPin3DiagonalDist);
                        } else {
                            ctx.lineTo(tPin3StartX - tPin3DiagonalDist, tPin3ClearY + tPin3DiagonalDist);
                        }
                    } else {
                        // Going up
                        if (tPin3Dx > 0) {
                            ctx.lineTo(tPin3StartX + tPin3DiagonalDist, tPin3ClearY - tPin3DiagonalDist);
                        } else {
                            ctx.lineTo(tPin3StartX - tPin3DiagonalDist, tPin3ClearY - tPin3DiagonalDist);
                        }
                    }
                    ctx.lineTo(via7X, via7Y);
                } else {
                    ctx.lineTo(via7X, via7Y);
                }
                ctx.stroke();
            }

            // Trace from bottom pin 3 to via 8
            if (bottomPins[3]) {
                const bPin3 = bottomPins[3];
                const bPin3StartX = bPin3.x;
                const bPin3StartY = centerY + chipSize / 2 + pinLength;
                const bPin3ClearY = bPin3StartY + 8;
                const bPin3Dx = via8X - bPin3StartX;
                const bPin3Dy = via8Y - bPin3ClearY;

                ctx.beginPath();
                ctx.moveTo(bPin3StartX, bPin3StartY);
                ctx.lineTo(bPin3StartX, bPin3ClearY);

                if (Math.abs(bPin3Dx) > 1 || Math.abs(bPin3Dy) > 1) {
                    const bPin3DiagonalDist = Math.min(Math.abs(bPin3Dx), Math.abs(bPin3Dy));
                    if (bPin3Dy > 0) {
                        // Going down
                        if (bPin3Dx > 0) {
                            ctx.lineTo(bPin3StartX + bPin3DiagonalDist, bPin3ClearY + bPin3DiagonalDist);
                        } else {
                            ctx.lineTo(bPin3StartX - bPin3DiagonalDist, bPin3ClearY + bPin3DiagonalDist);
                        }
                    } else {
                        // Going up
                        if (bPin3Dx > 0) {
                            ctx.lineTo(bPin3StartX + bPin3DiagonalDist, bPin3ClearY - bPin3DiagonalDist);
                        } else {
                            ctx.lineTo(bPin3StartX - bPin3DiagonalDist, bPin3ClearY - bPin3DiagonalDist);
                        }
                    }
                    ctx.lineTo(via8X, via8Y);
                } else {
                    ctx.lineTo(via8X, via8Y);
                }
                ctx.stroke();
            }

            // Trace from component 4 bottom pin to via 8 (different via)
            const comp4BottomPinX = component4X;
            const comp4BottomPinY = component4Y + component4Size / 2;
            const via8AltX = centerX - 20;
            const via8AltY = component4Y + component4Size / 2 + 8;
            const comp4Via8ClearY = comp4BottomPinY + 5;
            const comp4Via8Dx = via8AltX - comp4BottomPinX;
            const comp4Via8Dy = via8AltY - comp4Via8ClearY;

            ctx.beginPath();
            ctx.moveTo(comp4BottomPinX, comp4BottomPinY);
            ctx.lineTo(comp4BottomPinX, comp4Via8ClearY);

            if (Math.abs(comp4Via8Dx) > 1 || Math.abs(comp4Via8Dy) > 1) {
                const comp4Via8DiagonalDist = Math.min(Math.abs(comp4Via8Dx), Math.abs(comp4Via8Dy));
                if (comp4Via8Dy > 0) {
                    // Going down
                    if (comp4Via8Dx > 0) {
                        ctx.lineTo(comp4BottomPinX + comp4Via8DiagonalDist, comp4Via8ClearY + comp4Via8DiagonalDist);
                    } else {
                        ctx.lineTo(comp4BottomPinX - comp4Via8DiagonalDist, comp4Via8ClearY + comp4Via8DiagonalDist);
                    }
                } else {
                    // Going up
                    if (comp4Via8Dx > 0) {
                        ctx.lineTo(comp4BottomPinX + comp4Via8DiagonalDist, comp4Via8ClearY - comp4Via8DiagonalDist);
                    } else {
                        ctx.lineTo(comp4BottomPinX - comp4Via8DiagonalDist, comp4Via8ClearY - comp4Via8DiagonalDist);
                    }
                }
                ctx.lineTo(via8AltX, via8AltY);
            } else {
                ctx.lineTo(via8AltX, via8AltY);
            }
            ctx.stroke();

            // Draw all new vias
            const viaPositions = [
                { x: via4X, y: via4Y },
                { x: via5X, y: via5Y },
                { x: via6X, y: via6Y },
                { x: via7X, y: via7Y },
                { x: via8X, y: via8Y },
                { x: via8AltX, y: via8AltY },
                { x: via9X, y: via9Y }
            ];

            ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            viaPositions.forEach(via => {
                ctx.beginPath();
                ctx.arc(via.x, via.y, viaRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
            viaPositions.forEach(via => {
                ctx.beginPath();
                ctx.arc(via.x, via.y, viaHoleRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw additional components
            // Component 2
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(
                component2X - component2Size / 2,
                component2Y - component2Size / 2,
                component2Size,
                component2Size
            );

            // Component 2 pins
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            for (let i = 1; i <= component2PinsPerSide; i++) {
                const pinY = component2Y - component2Size / 2 + component2PinSpacing * i;
                // Left side pins
                ctx.fillRect(
                    component2X - component2Size / 2 - componentPinLength,
                    pinY - componentPinWidth / 2,
                    componentPinLength,
                    componentPinWidth
                );
            }
            // Right side pin
            ctx.fillRect(
                component2X + component2Size / 2,
                component2Y - componentPinWidth / 2,
                componentPinLength,
                componentPinWidth
            );

            // Component 3
            ctx.strokeRect(
                component3X - component3Size / 2,
                component3Y - component3Size / 2,
                component3Size,
                component3Size
            );

            // Component 3 pins
            for (let i = 1; i <= component3PinsPerSide; i++) {
                const pinX = component3X - component3Size / 2 + component3PinSpacing * i;
                // Bottom side pins
                ctx.fillRect(
                    pinX - componentPinWidth / 2,
                    component3Y + component3Size / 2,
                    componentPinWidth,
                    componentPinLength
                );
            }
            // Top side pin
            ctx.fillRect(
                component3X - componentPinWidth / 2,
                component3Y - component3Size / 2 - componentPinLength,
                componentPinWidth,
                componentPinLength
            );

            // Component 4
            ctx.strokeRect(
                component4X - component4Size / 2,
                component4Y - component4Size / 2,
                component4Size,
                component4Size
            );

            // Component 4 pins
            for (let i = 1; i <= component4PinsPerSide; i++) {
                const pinX = component4X - component4Size / 2 + component4PinSpacing * i;
                // Top side pins
                ctx.fillRect(
                    pinX - componentPinWidth / 2,
                    component4Y - component4Size / 2 - componentPinLength,
                    componentPinWidth,
                    componentPinLength
                );
            }
            // Bottom side pin
            ctx.fillRect(
                component4X - componentPinWidth / 2,
                component4Y + component4Size / 2,
                componentPinWidth,
                componentPinLength
            );

            // Draw additional vias
            ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            ctx.beginPath();
            ctx.arc(via2X, via2Y, viaRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
            ctx.beginPath();
            ctx.arc(via2X, via2Y, viaHoleRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            ctx.beginPath();
            ctx.arc(via3X, via3Y, viaRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
            ctx.beginPath();
            ctx.arc(via3X, via3Y, viaHoleRadius, 0, Math.PI * 2);
            ctx.fill();

            // Draw component (outline only, like center chip)
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(
                componentX - componentSize / 2,
                componentY - componentSize / 2,
                componentSize,
                componentSize
            );

            // Draw component pins (small rectangles on right and left sides)
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';

            // Right side pins (3 pins)
            for (let i = 1; i <= componentPinsPerSide; i++) {
                const pinY = componentY - componentSize / 2 + componentPinSpacing * i;
                ctx.fillRect(
                    componentX + componentSize / 2,
                    pinY - componentPinWidth / 2,
                    componentPinLength,
                    componentPinWidth
                );
            }

            // Left side pin (1 pin, middle)
            const leftPinY = componentY;
            ctx.fillRect(
                componentX - componentSize / 2 - componentPinLength,
                leftPinY - componentPinWidth / 2,
                componentPinLength,
                componentPinWidth
            );

            // Draw via/pad (circuit hole) - outer ring and inner hole
            ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            ctx.beginPath();
            ctx.arc(viaX, viaY, viaRadius, 0, Math.PI * 2);
            ctx.fill();

            // Inner hole (clear/dark)
            ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
            ctx.beginPath();
            ctx.arc(viaX, viaY, viaHoleRadius, 0, Math.PI * 2);
            ctx.fill();

            // Animation: Draw glowing balls and component/via glows
            const ballSpeed = 50; // pixels per second (constant speed for all balls)

            // Helper to draw glowing ball
            const drawGlowingBall = (x: number, y: number, intensity: number) => {
                const radius = 1.5;
                const glowRadius = 4;

                // Outer glow
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
                gradient.addColorStop(0, `rgba(100, 200, 255, ${intensity * 0.8})`);
                gradient.addColorStop(0.5, `rgba(100, 200, 255, ${intensity * 0.4})`);
                gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                // Inner bright core
                ctx.fillStyle = `rgba(150, 220, 255, ${intensity})`;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            };

            // Helper to draw component glow
            const drawComponentGlow = (x: number, y: number, size: number, intensity: number) => {
                ctx.shadowBlur = 12 * intensity;
                ctx.shadowColor = `rgba(100, 200, 255, ${intensity * 0.8})`;
                ctx.strokeStyle = `rgba(150, 220, 255, ${0.8 + intensity * 0.2})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(x - size / 2, y - size / 2, size, size);
                ctx.shadowBlur = 0;
            };

            // Helper to draw via glow
            const drawViaGlow = (x: number, y: number, intensity: number) => {
                const glowRadius = viaRadius + 4;
                const gradient = ctx.createRadialGradient(x, y, viaRadius, x, y, glowRadius);
                gradient.addColorStop(0, `rgba(100, 200, 255, ${intensity * 0.6})`);
                gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            };

            // Calculate trace path information for animations
            // Store trace paths with their geometry for accurate ball following
            const traceAnimations: Array<{
                startTime: number;
                duration: number;
                getPathPoint: (progress: number) => { x: number; y: number } | null;
                component?: { x: number; y: number; size: number };
                via?: { x: number; y: number };
            }> = [];

            // Left pin 1 -> Component 1
            if (middleLeftPin1) {
                const pin1StartX = centerX - chipSize / 2 - pinLength;
                const pin1StartY = middleLeftPin1.y;
                const pin1EndX = componentX + componentSize / 2;
                const pin1EndY = componentY - componentSize / 2 + componentPinSpacing * 1;
                const pin1ClearX = pin1StartX - 8;
                const dy1 = pin1EndY - pin1StartY;
                const pin1DiagonalDist = Math.abs(dy1) > 1 ? Math.abs(dy1) : null;
                const pin1PathLength = calculatePathLength(
                    pin1StartX, pin1StartY, pin1EndX, pin1EndY,
                    pin1ClearX, null, pin1DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: pin1PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        pin1StartX, pin1StartY, pin1EndX, pin1EndY,
                        pin1ClearX, null, pin1DiagonalDist, progress
                    ),
                    component: { x: componentX, y: componentY, size: componentSize },
                });
            }

            // Left pin 2 -> Component 1
            if (middleLeftPin2) {
                const pin2StartX = centerX - chipSize / 2 - pinLength;
                const pin2StartY = middleLeftPin2.y;
                const pin2EndX = componentX + componentSize / 2;
                const pin2EndY = componentY - componentSize / 2 + componentPinSpacing * 2;
                const pin2ClearX = pin2StartX - 8;
                const dy2 = pin2EndY - pin2StartY;
                const pin2DiagonalDist = Math.abs(dy2) > 1 ? Math.abs(dy2) : null;
                const pin2PathLength = calculatePathLength(
                    pin2StartX, pin2StartY, pin2EndX, pin2EndY,
                    pin2ClearX, null, pin2DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: pin2PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        pin2StartX, pin2StartY, pin2EndX, pin2EndY,
                        pin2ClearX, null, pin2DiagonalDist, progress
                    ),
                    component: { x: componentX, y: componentY, size: componentSize },
                });
            }

            // Component 1 -> Via
            const viaStartX = componentX - componentSize / 2;
            const viaStartY = componentY;
            const viaClearX = viaStartX - 8;
            const viaDy = viaY - viaStartY;
            const viaDiagonalDist = Math.abs(viaDy) > 1 ? Math.abs(viaDy) : null;
            const viaPathLength = calculatePathLength(
                viaStartX, viaStartY, viaX, viaY,
                viaClearX, null, viaDiagonalDist
            );

            // Calculate when Component 1 -> Via should start (after the longest pin->component trace)
            const maxPinToCompDuration = Math.max(
                middleLeftPin1 ? calculatePathLength(
                    centerX - chipSize / 2 - pinLength, middleLeftPin1.y,
                    componentX + componentSize / 2, componentY - componentSize / 2 + componentPinSpacing * 1,
                    centerX - chipSize / 2 - pinLength - 8, null,
                    Math.abs(componentY - componentSize / 2 + componentPinSpacing * 1 - middleLeftPin1.y) > 1
                        ? Math.abs(componentY - componentSize / 2 + componentPinSpacing * 1 - middleLeftPin1.y) : null
                ) / ballSpeed : 0,
                middleLeftPin2 ? calculatePathLength(
                    centerX - chipSize / 2 - pinLength, middleLeftPin2.y,
                    componentX + componentSize / 2, componentY - componentSize / 2 + componentPinSpacing * 2,
                    centerX - chipSize / 2 - pinLength - 8, null,
                    Math.abs(componentY - componentSize / 2 + componentPinSpacing * 2 - middleLeftPin2.y) > 1
                        ? Math.abs(componentY - componentSize / 2 + componentPinSpacing * 2 - middleLeftPin2.y) : null
                ) / ballSpeed : 0
            );

            traceAnimations.push({
                startTime: maxPinToCompDuration,
                duration: viaPathLength / ballSpeed,
                getPathPoint: (progress) => getPointAlongPath(
                    viaStartX, viaStartY, viaX, viaY,
                    viaClearX, null, viaDiagonalDist, progress
                ),
                via: { x: viaX, y: viaY },
            });

            // Right pin 1 -> Component 2
            if (rightPins[1]) {
                const rPin1StartX = centerX + chipSize / 2 + pinLength;
                const rPin1StartY = rightPins[1].y;
                const rPin1EndX = component2X - component2Size / 2;
                const rPin1EndY = component2Y - component2Size / 2 + component2PinSpacing * 1;
                const rPin1ClearX = rPin1StartX + 8;
                const rDy1 = rPin1EndY - rPin1StartY;
                const rDiagonalDist1 = Math.abs(rDy1) > 1 ? Math.abs(rDy1) : null;
                const rPin1PathLength = calculatePathLength(
                    rPin1StartX, rPin1StartY, rPin1EndX, rPin1EndY,
                    rPin1ClearX, null, rDiagonalDist1
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: rPin1PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        rPin1StartX, rPin1StartY, rPin1EndX, rPin1EndY,
                        rPin1ClearX, null, rDiagonalDist1, progress
                    ),
                    component: { x: component2X, y: component2Y, size: component2Size },
                });
            }

            // Component 2 -> Via 2
            const animComp2ViaClearX = comp2RightPinX + 8;
            const animComp2ViaDy = via2Y - comp2RightPinY;
            const animComp2ViaDiagonalDist = Math.abs(animComp2ViaDy) > 1 ? Math.abs(animComp2ViaDy) : null;
            const comp2ViaPathLength = calculatePathLength(
                comp2RightPinX, comp2RightPinY, via2X, via2Y,
                animComp2ViaClearX, null, animComp2ViaDiagonalDist
            );
            const rPin1Duration = rightPins[1] ? calculatePathLength(
                centerX + chipSize / 2 + pinLength, rightPins[1].y,
                component2X - component2Size / 2, component2Y - component2Size / 2 + component2PinSpacing * 1,
                centerX + chipSize / 2 + pinLength + 8, null,
                Math.abs(component2Y - component2Size / 2 + component2PinSpacing * 1 - rightPins[1].y) > 1
                    ? Math.abs(component2Y - component2Size / 2 + component2PinSpacing * 1 - rightPins[1].y) : null
            ) / ballSpeed : 0;

            traceAnimations.push({
                startTime: rPin1Duration,
                duration: comp2ViaPathLength / ballSpeed,
                getPathPoint: (progress) => getPointAlongPath(
                    comp2RightPinX, comp2RightPinY, via2X, via2Y,
                    animComp2ViaClearX, null, animComp2ViaDiagonalDist, progress
                ),
                via: { x: via2X, y: via2Y },
            });

            // Top pin 2 -> Component 3
            if (topPins[2]) {
                const tPin2StartX = topPins[2].x;
                const tPin2StartY = centerY - chipSize / 2 - pinLength;
                const tPin2EndX = component3X - component3Size / 2 + component3PinSpacing * 2;
                const tPin2EndY = component3Y + component3Size / 2;
                const tPin2ClearY = tPin2StartY - 4;
                const tDx2 = tPin2EndX - tPin2StartX;
                const tDiagonalDist2 = Math.abs(tDx2) > 1 ? Math.abs(tDx2) : null;
                const tPin2PathLength = calculatePathLength(
                    tPin2StartX, tPin2StartY, tPin2EndX, tPin2EndY,
                    null, tPin2ClearY, tDiagonalDist2
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: tPin2PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        tPin2StartX, tPin2StartY, tPin2EndX, tPin2EndY,
                        null, tPin2ClearY, tDiagonalDist2, progress
                    ),
                    component: { x: component3X, y: component3Y, size: component3Size },
                });
            }

            // Component 3 -> Via 3
            const animComp3ViaClearY = comp3TopPinY;
            const animComp3ViaDx = via3X - comp3TopPinX;
            const animComp3ViaDiagonalDist = Math.abs(animComp3ViaDx) > 1 ? Math.abs(animComp3ViaDx) : null;
            const comp3ViaPathLength = calculatePathLength(
                comp3TopPinX, comp3TopPinY, via3X, via3Y,
                null, animComp3ViaClearY, animComp3ViaDiagonalDist
            );
            const tPin2Duration = topPins[2] ? calculatePathLength(
                topPins[2].x, centerY - chipSize / 2 - pinLength,
                component3X - component3Size / 2 + component3PinSpacing * 2, component3Y + component3Size / 2,
                null, centerY - chipSize / 2 - pinLength - 4,
                Math.abs(component3X - component3Size / 2 + component3PinSpacing * 2 - topPins[2].x) > 1
                    ? Math.abs(component3X - component3Size / 2 + component3PinSpacing * 2 - topPins[2].x) : null
            ) / ballSpeed : 0;

            traceAnimations.push({
                startTime: tPin2Duration,
                duration: comp3ViaPathLength / ballSpeed,
                getPathPoint: (progress) => getPointAlongPath(
                    comp3TopPinX, comp3TopPinY, via3X, via3Y,
                    null, animComp3ViaClearY, animComp3ViaDiagonalDist, progress
                ),
                via: { x: via3X, y: via3Y },
            });

            // Bottom pin 1 -> Component 4
            if (bottomPins[1]) {
                const bPin1StartX = bottomPins[1].x;
                const bPin1StartY = centerY + chipSize / 2 + pinLength;
                const bPin1EndX = component4X + component4Size / 2 - component4PinSpacing * 1;
                const bPin1EndY = component4Y - component4Size / 2;
                const bPin1ClearY = bPin1StartY + 8;
                const bDx1 = bPin1EndX - bPin1StartX;
                const bDiagonalDist1 = Math.abs(bDx1) > 1 ? Math.abs(bDx1) : null;
                const bPin1PathLength = calculatePathLength(
                    bPin1StartX, bPin1StartY, bPin1EndX, bPin1EndY,
                    null, bPin1ClearY, bDiagonalDist1
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: bPin1PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        bPin1StartX, bPin1StartY, bPin1EndX, bPin1EndY,
                        null, bPin1ClearY, bDiagonalDist1, progress
                    ),
                    component: { x: component4X, y: component4Y, size: component4Size },
                });
            }

            // Component 4 -> Via 8Alt
            const animComp4Via8ClearY = comp4BottomPinY + 5;
            const animComp4Via8Dx = via8AltX - comp4BottomPinX;
            const animComp4Via8Dy = via8AltY - animComp4Via8ClearY;
            const animComp4Via8DiagonalDist = (Math.abs(animComp4Via8Dx) > 1 || Math.abs(animComp4Via8Dy) > 1)
                ? Math.min(Math.abs(animComp4Via8Dx), Math.abs(animComp4Via8Dy)) : null;
            const comp4Via8PathLength = calculatePathLength(
                comp4BottomPinX, comp4BottomPinY, via8AltX, via8AltY,
                null, animComp4Via8ClearY, animComp4Via8DiagonalDist
            );
            const bPin1Duration = bottomPins[1] ? calculatePathLength(
                bottomPins[1].x, centerY + chipSize / 2 + pinLength,
                component4X + component4Size / 2 - component4PinSpacing * 1, component4Y - component4Size / 2,
                null, centerY + chipSize / 2 + pinLength + 8,
                Math.abs(component4X + component4Size / 2 - component4PinSpacing * 1 - bottomPins[1].x) > 1
                    ? Math.abs(component4X + component4Size / 2 - component4PinSpacing * 1 - bottomPins[1].x) : null
            ) / ballSpeed : 0;

            traceAnimations.push({
                startTime: bPin1Duration,
                duration: comp4Via8PathLength / ballSpeed,
                getPathPoint: (progress) => getPointAlongPath(
                    comp4BottomPinX, comp4BottomPinY, via8AltX, via8AltY,
                    null, animComp4Via8ClearY, animComp4Via8DiagonalDist, progress
                ),
                via: { x: via8AltX, y: via8AltY },
            });

            // Top pin 0 -> Via 5
            if (topPins[0]) {
                const tPin0StartX = topPins[0].x;
                const tPin0StartY = centerY - chipSize / 2 - pinLength;
                const tPin0ClearY = tPin0StartY - 8;
                const tPin0Dx = via5X - tPin0StartX;
                const tPin0Dy = via5Y - tPin0ClearY;
                const tPin0DiagonalDist = (Math.abs(tPin0Dx) > 1 || Math.abs(tPin0Dy) > 1)
                    ? Math.min(Math.abs(tPin0Dx), Math.abs(tPin0Dy)) : null;
                const tPin0PathLength = calculatePathLength(
                    tPin0StartX, tPin0StartY, via5X, via5Y,
                    null, tPin0ClearY, tPin0DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: tPin0PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        tPin0StartX, tPin0StartY, via5X, via5Y,
                        null, tPin0ClearY, tPin0DiagonalDist, progress
                    ),
                    via: { x: via5X, y: via5Y },
                });
            }

            // Right pin 3 -> Via 4
            if (rightPins[3]) {
                const rPin3StartX = centerX + chipSize / 2 + pinLength;
                const rPin3StartY = rightPins[3].y;
                const rPin3ClearX = rPin3StartX + 8;
                const rPin3Dx = via4X - rPin3ClearX;
                const rPin3Dy = via4Y - rPin3StartY;
                const rPin3DiagonalDist = (Math.abs(rPin3Dx) > 1 || Math.abs(rPin3Dy) > 1)
                    ? Math.min(Math.abs(rPin3Dx), Math.abs(rPin3Dy)) : null;
                const rPin3PathLength = calculatePathLength(
                    rPin3StartX, rPin3StartY, via4X, via4Y,
                    rPin3ClearX, null, rPin3DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: rPin3PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        rPin3StartX, rPin3StartY, via4X, via4Y,
                        rPin3ClearX, null, rPin3DiagonalDist, progress
                    ),
                    via: { x: via4X, y: via4Y },
                });
            }

            // Left pin 3 -> Via 9
            if (leftPins[3]) {
                const lPin3StartX = centerX - chipSize / 2 - pinLength;
                const lPin3StartY = leftPins[3].y;
                const lPin3ClearX = lPin3StartX - 8;
                const lPin3Dx = via9X - lPin3ClearX;
                const lPin3Dy = via9Y - lPin3StartY;
                const lPin3DiagonalDist = (Math.abs(lPin3Dx) > 1 || Math.abs(lPin3Dy) > 1)
                    ? Math.min(Math.abs(lPin3Dx), Math.abs(lPin3Dy)) : null;
                const lPin3PathLength = calculatePathLength(
                    lPin3StartX, lPin3StartY, via9X, via9Y,
                    lPin3ClearX, null, lPin3DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: lPin3PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        lPin3StartX, lPin3StartY, via9X, via9Y,
                        lPin3ClearX, null, lPin3DiagonalDist, progress
                    ),
                    via: { x: via9X, y: via9Y },
                });
            }

            // Top pin 3 -> Via 7
            if (topPins[3]) {
                const tPin3StartX = topPins[3].x;
                const tPin3StartY = centerY - chipSize / 2 - pinLength;
                const tPin3ClearY = tPin3StartY - 4;
                const tPin3Dx = via7X - tPin3StartX;
                const tPin3Dy = via7Y - tPin3ClearY;
                const tPin3DiagonalDist = (Math.abs(tPin3Dx) > 1 || Math.abs(tPin3Dy) > 1)
                    ? Math.min(Math.abs(tPin3Dx), Math.abs(tPin3Dy)) : null;
                const tPin3PathLength = calculatePathLength(
                    tPin3StartX, tPin3StartY, via7X, via7Y,
                    null, tPin3ClearY, tPin3DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: tPin3PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        tPin3StartX, tPin3StartY, via7X, via7Y,
                        null, tPin3ClearY, tPin3DiagonalDist, progress
                    ),
                    via: { x: via7X, y: via7Y },
                });
            }

            // Bottom pin 3 -> Via 8
            if (bottomPins[3]) {
                const bPin3StartX = bottomPins[3].x;
                const bPin3StartY = centerY + chipSize / 2 + pinLength;
                const bPin3ClearY = bPin3StartY + 8;
                const bPin3Dx = via8X - bPin3StartX;
                const bPin3Dy = via8Y - bPin3ClearY;
                const bPin3DiagonalDist = (Math.abs(bPin3Dx) > 1 || Math.abs(bPin3Dy) > 1)
                    ? Math.min(Math.abs(bPin3Dx), Math.abs(bPin3Dy)) : null;
                const bPin3PathLength = calculatePathLength(
                    bPin3StartX, bPin3StartY, via8X, via8Y,
                    null, bPin3ClearY, bPin3DiagonalDist
                );

                traceAnimations.push({
                    startTime: 0,
                    duration: bPin3PathLength / ballSpeed,
                    getPathPoint: (progress) => getPointAlongPath(
                        bPin3StartX, bPin3StartY, via8X, via8Y,
                        null, bPin3ClearY, bPin3DiagonalDist, progress
                    ),
                    via: { x: via8X, y: via8Y },
                });
            }

            // Calculate cycle duration based on longest trace animation
            const maxDuration = Math.max(...traceAnimations.map(a => a.startTime + a.duration), 0);
            const cycleDuration = maxDuration + 1; // Add 1 second pause before restarting

            // Track active components and vias for glow
            const activeComponents = new Set<string>();
            const activeVias = new Set<string>();

            traceAnimations.forEach((anim) => {
                const cycleElapsed = elapsed % cycleDuration;
                let animTime = cycleElapsed - anim.startTime;

                // Handle wrap-around (negative time means we're in the next cycle)
                if (animTime < 0) {
                    animTime += cycleDuration;
                }

                if (animTime < 0 || animTime > anim.duration) return;

                const progress = Math.min(animTime / anim.duration, 1);

                try {
                    // Get ball position along the actual trace path
                    const pathPoint = anim.getPathPoint(progress);
                    if (!pathPoint) return;

                    const ballX = pathPoint.x;
                    const ballY = pathPoint.y;

                    // Draw ball
                    const intensity = 0.8 + 0.2 * Math.sin(progress * Math.PI * 4);
                    drawGlowingBall(ballX, ballY, intensity);

                    // Check if ball is near component
                    if (anim.component) {
                        const dist = Math.sqrt(
                            Math.pow(ballX - anim.component.x, 2) +
                            Math.pow(ballY - anim.component.y, 2)
                        );
                        if (dist < anim.component.size) {
                            activeComponents.add(`${anim.component.x},${anim.component.y}`);
                        }
                    }

                    // Check if ball is near via
                    if (anim.via) {
                        const dist = Math.sqrt(
                            Math.pow(ballX - anim.via.x, 2) +
                            Math.pow(ballY - anim.via.y, 2)
                        );
                        if (dist < viaRadius * 2) {
                            activeVias.add(`${anim.via.x},${anim.via.y}`);
                        }
                    }
                } catch {
                    // Skip if coordinates aren't available
                }
            });

            // Draw component glows
            activeComponents.forEach(compKey => {
                const [x, y] = compKey.split(',').map(Number);
                const comp = traceAnimations.find(a =>
                    a.component && a.component.x === x && a.component.y === y
                )?.component;
                if (comp) {
                    drawComponentGlow(x, y, comp.size, 0.8);
                }
            });

            // Draw via glows
            activeVias.forEach(viaKey => {
                const [x, y] = viaKey.split(',').map(Number);
                drawViaGlow(x, y, 0.8);
            });

            // Draw all 16 pins (4 on each side) - white pins aligned with chip sides
            pinsRef.current.forEach((pin) => {
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';

                if (pin.side === 'top') {
                    // Top pins extend upward, aligned with chip top edge
                    ctx.fillRect(pin.x - pinWidth / 2, centerY - chipSize / 2 - pinLength, pinWidth, pinLength);
                } else if (pin.side === 'bottom') {
                    // Bottom pins extend downward, aligned with chip bottom edge
                    ctx.fillRect(pin.x - pinWidth / 2, centerY + chipSize / 2, pinWidth, pinLength);
                } else if (pin.side === 'right') {
                    // Right pins extend rightward, aligned with chip right edge
                    ctx.fillRect(centerX + chipSize / 2, pin.y - pinWidth / 2, pinLength, pinWidth);
                } else if (pin.side === 'left') {
                    // Left pins extend leftward, aligned with chip left edge
                    ctx.fillRect(centerX - chipSize / 2 - pinLength, pin.y - pinWidth / 2, pinLength, pinWidth);
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            resizeObserver.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[120px] rounded overflow-hidden"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
};

export default ElectronicsBox;
