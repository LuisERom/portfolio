'use client';

/**
 * Decorative canvas inside the Photonics interest box: draws a curved “fiber” and animates bright pulses
 * traveling along it on a short loop. Sized to the container; no user input — visual flair only.
 */
import { useEffect, useRef } from 'react';

interface Pulse {
    id: number;
    progress: number; // 0 to 1 along the fiber
    opacity: number;
}

interface Wave {
    id: number;
    x: number;
    y: number;
    timestamp: number;
}

const PhotonicsBox = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const pulsesRef = useRef<Pulse[]>([]);
    const wavesRef = useRef<Wave[]>([]);
    const pulseIdRef = useRef(0);
    const waveIdRef = useRef(0);

    useEffect(() => {
        // Create new pulses periodically
        const interval = setInterval(() => {
            pulsesRef.current.push({
                id: pulseIdRef.current++,
                progress: 0,
                opacity: 1,
            });

            // Limit number of pulses
            if (pulsesRef.current.length > 5) {
                pulsesRef.current.shift();
            }
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: false,
        });
        if (!ctx) return;

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        let lastWidth = 0;
        let lastHeight = 0;
        let lastDPR = 0;

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = rect.width;
            const height = rect.height;

            // Only resize if dimensions actually changed
            if (width === lastWidth && height === lastHeight && dpr === lastDPR) {
                return;
            }

            lastWidth = width;
            lastHeight = height;
            lastDPR = dpr;

            // Set display size (CSS pixels)
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Set actual size in memory (scaled by device pixel ratio)
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            // Reset transformation matrix and scale the context to match device pixel ratio
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // Re-enable high-quality rendering after scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Use ResizeObserver for more reliable size detection (catches zoom changes)
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        resizeObserver.observe(container);

        // Calculate point on curved fiber path (bezier curve)
        const getPointOnFiber = (t: number, width: number, height: number) => {
            // Start point (left)
            const startX = width * 0.1;
            const startY = height * 0.5;

            // End point (right)
            const endX = width * 0.9;
            const endY = height * 0.5;

            // Control points for smooth curve
            const control1X = width * 0.3;
            const control1Y = height * 0.3;
            const control2X = width * 0.7;
            const control2Y = height * 0.7;

            // Cubic Bezier curve
            const mt = 1 - t;
            const x = mt * mt * mt * startX +
                3 * mt * mt * t * control1X +
                3 * mt * t * t * control2X +
                t * t * t * endX;
            const y = mt * mt * mt * startY +
                3 * mt * mt * t * control1Y +
                3 * mt * t * t * control2Y +
                t * t * t * endY;

            // Calculate tangent for direction
            const dx = 3 * mt * mt * (control1X - startX) +
                6 * mt * t * (control2X - control1X) +
                3 * t * t * (endX - control2X);
            const dy = 3 * mt * mt * (control1Y - startY) +
                6 * mt * t * (control2Y - control1Y) +
                3 * t * t * (endY - control2Y);
            const angle = Math.atan2(dy, dx);

            return { x, y, angle };
        };

        const animate = () => {
            // Check and resize if needed (handles zoom changes)
            resizeCanvas();

            // Get display dimensions (accounting for DPR scaling)
            const rect = container.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // Clear canvas with transparent background
            ctx.clearRect(0, 0, width, height);

            // Draw the fiber (curved transparent line)
            ctx.beginPath();
            const startX = width * 0.1;
            const startY = height * 0.5;
            const endX = width * 0.9;
            const endY = height * 0.5;
            const control1X = width * 0.3;
            const control1Y = height * 0.3;
            const control2X = width * 0.7;
            const control2Y = height * 0.7;

            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY);

            // Outer glow
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
            ctx.lineWidth = 16;
            ctx.stroke();

            // Inner fiber
            ctx.strokeStyle = 'rgba(150, 200, 255, 0.5)';
            ctx.lineWidth = 6;
            ctx.stroke();

            // Core (bright center)
            ctx.strokeStyle = 'rgba(200, 220, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Update and draw pulses
            const currentPulses = pulsesRef.current;
            const speed = 0.015; // Progress per frame
            const endPoint = getPointOnFiber(1, width, height);

            for (let i = currentPulses.length - 1; i >= 0; i--) {
                const pulse = currentPulses[i];
                const wasBeforeEnd = pulse.progress < 1;
                pulse.progress += speed;

                // If pulse just reached or passed the end, emit a wave
                if (wasBeforeEnd && pulse.progress >= 1) {
                    wavesRef.current.push({
                        id: waveIdRef.current++,
                        x: endPoint.x,
                        y: endPoint.y,
                        timestamp: Date.now(),
                    });

                    // Limit number of waves
                    if (wavesRef.current.length > 5) {
                        wavesRef.current.shift();
                    }
                }

                // Remove pulse if it's past the end
                if (pulse.progress > 1.1) {
                    currentPulses.splice(i, 1);
                    continue;
                }

                // Fade out slightly as it travels
                pulse.opacity = Math.max(0.6, 1 - pulse.progress * 0.3);

                // Get position on fiber
                const point = getPointOnFiber(pulse.progress, width, height);

                // Draw pulse with glow effect
                const gradient = ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, 18
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${pulse.opacity})`);
                gradient.addColorStop(0.3, `rgba(150, 200, 255, ${pulse.opacity * 0.8})`);
                gradient.addColorStop(0.6, `rgba(100, 150, 255, ${pulse.opacity * 0.4})`);
                gradient.addColorStop(1, `rgba(100, 150, 255, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 18, 0, Math.PI * 2);
                ctx.fill();

                // Bright center core
                ctx.fillStyle = `rgba(255, 255, 255, ${pulse.opacity})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill();

                // Trailing glow effect
                const trailPoint = getPointOnFiber(Math.max(0, pulse.progress - 0.05), width, height);
                const trailGradient = ctx.createRadialGradient(
                    trailPoint.x, trailPoint.y, 0,
                    trailPoint.x, trailPoint.y, 12
                );
                trailGradient.addColorStop(0, `rgba(150, 200, 255, ${pulse.opacity * 0.3})`);
                trailGradient.addColorStop(1, `rgba(150, 200, 255, 0)`);

                ctx.fillStyle = trailGradient;
                ctx.beginPath();
                ctx.arc(trailPoint.x, trailPoint.y, 12, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw emitted waves at the end of the fiber
            const currentWaves = wavesRef.current;
            const now = Date.now();
            const waveSpeed = 80; // pixels per second
            const maxRadius = Math.max(width, height) * 0.9;

            for (let i = currentWaves.length - 1; i >= 0; i--) {
                const wave = currentWaves[i];
                const elapsed = now - wave.timestamp;
                const currentRadius = Math.min((elapsed / 1000) * waveSpeed, maxRadius);

                if (currentRadius <= 0) continue;

                if (currentRadius >= maxRadius) {
                    currentWaves.splice(i, 1);
                    continue;
                }

                // Draw multiple concentric wave rings
                for (let ring = 0; ring < 3; ring++) {
                    const ringRadius = currentRadius - ring * 12;
                    const ringOpacity = Math.max(0, 0.9 - ring * 0.15 - elapsed / 2000);

                    if (ringRadius <= 0 || ringOpacity <= 0) continue;

                    // Outer glow (blue)
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, ringRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(150, 200, 255, ${ringOpacity * 0.6})`;
                    ctx.lineWidth = 4;
                    ctx.stroke();

                    // Inner bright ring (white)
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, ringRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${ringOpacity * 0.8})`;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }
            }

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

export default PhotonicsBox;
