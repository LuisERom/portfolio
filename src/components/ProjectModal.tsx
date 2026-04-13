/**
 * Modal layer for one project: title, narrative text, tech tags, external links, image carousel, and optional logo.
 * Gallery images can open in a lightbox (zoom + captions); lightbox slides/index state are lifted to the parent so one lightbox instance can be shared.
 * While mounted, forces dark theme, adds `modal-open` on <body> to hide the site chrome, and cleans up on close.
 */
import React, { useState, useEffect, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import { Project } from "@/types";
import { tagStyles } from "@/data/projects";
import Link from "next/link";

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    lightboxImages: { src: string; description?: string }[];
    setLightboxImages: (images: { src: string; description?: string }[]) => void;
    lightboxIndex: number;
    setLightboxIndex: (index: number) => void;
}

export default function ProjectModal({
    project,
    onClose,
    lightboxImages,
    setLightboxImages,
    lightboxIndex,
    setLightboxIndex
}: ProjectModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [maxImageHeight, setMaxImageHeight] = useState(300); // Default max height

    // Always enforce dark mode when modal opens and hide main header
    useEffect(() => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");

        // Add class to body to hide main header
        document.body.classList.add("modal-open");

        // Watch for any theme changes and force dark mode
        const observer = new MutationObserver(() => {
            if (!document.documentElement.classList.contains("dark")) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => {
            observer.disconnect();
            // Remove class when modal closes
            document.body.classList.remove("modal-open");
        };
    }, []);

    // Get the first image as logo (if available)
    const logoImage = project.images && project.images.length > 0 ? project.images[0] : null;
    // Get remaining images for carousel (skip first if it's the logo)
    const carouselImages = React.useMemo(() => {
        return project.images && project.images.length > 1 ? project.images.slice(1) : project.images || [];
    }, [project.images]);


    // Calculate maximum image height from all carousel images
    useEffect(() => {
        if (carouselImages.length === 0) return;

        const imagePromises = carouselImages.map((img) => {
            return new Promise<number>((resolve) => {
                const imageElement = new Image();
                imageElement.onload = () => {
                    // Calculate the height if image was constrained to max-width of 800px (max-w-2xl)
                    const maxWidth = 800;
                    const aspectRatio = imageElement.height / imageElement.width;
                    const constrainedHeight = Math.min(
                        imageElement.height,
                        maxWidth * aspectRatio,
                        280 // max-h-[280px] - reduced to prevent overlap with text
                    );
                    resolve(constrainedHeight);
                };
                imageElement.onerror = () => resolve(280); // Default on error
                imageElement.src = img.src;
            });
        });

        Promise.all(imagePromises).then((heights) => {
            const maxHeight = Math.max(...heights, 150); // At least 150px for side images
            setMaxImageHeight(maxHeight + 20); // Add some padding
        });
    }, [carouselImages]);


    // Auto-slide functionality
    useEffect(() => {
        if (carouselImages.length <= 2) return;

        autoSlideIntervalRef.current = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000); // Change image every 5 seconds (slightly longer for smoother feel)

        return () => {
            if (autoSlideIntervalRef.current) {
                clearInterval(autoSlideIntervalRef.current);
            }
        };
    }, [carouselImages.length]);

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
        if (autoSlideIntervalRef.current) {
            clearInterval(autoSlideIntervalRef.current);
            autoSlideIntervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
            }, 5000);
        }
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        if (autoSlideIntervalRef.current) {
            clearInterval(autoSlideIntervalRef.current);
            autoSlideIntervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
            }, 5000);
        }
    };

    const hasMultipleImages = carouselImages.length > 2;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black bg-opacity-50"
                onClick={() => {
                    onClose();
                    setLightboxImages([]);
                }}
            >
                {/* Fixed Header Bar - Same as layout navigation */}
                <div className="fixed top-0 left-0 right-0 z-[60] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-md">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
                        {/* Left side - Name */}
                        <h1 className="text-xl font-semibold">Luis E. Román Lizasoain</h1>

                        {/* Center - Logo */}
                        {logoImage && (
                            <div className="absolute left-1/2 -translate-x-1/2">
                                <img
                                    src={logoImage.src}
                                    alt={String(logoImage.alt || "")}
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        )}

                        {/* Right side - Navigation links and X button */}
                        <div className="flex items-center gap-4">
                            <ul className="flex gap-4 text-sm items-center">
                                <li><Link href="/" className="hover:underline" onClick={(e) => { e.stopPropagation(); onClose(); }}>Projects</Link></li>
                                <li><Link href="/contact" className="hover:underline" onClick={(e) => e.stopPropagation()}>Contact</Link></li>
                            </ul>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    setLightboxImages([]);
                                }}
                                className="text-2xl font-bold text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="pt-24 pb-8 overflow-y-auto h-full max-h-screen">
                    <div
                        className="max-w-7xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Project Tags */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                            {project.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${tagStyles[tag] || "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Project Title - Centered and Large */}
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-100">
                            {project.title}
                        </h2>

                        {/* Institution Information */}
                        {project.institution && (
                            <div className="text-center mb-8 text-zinc-600 dark:text-zinc-400">
                                <p className="text-lg font-semibold">{project.institution}</p>
                            </div>
                        )}

                        {/* Image Carousel */}
                        {carouselImages.length > 0 && (
                            <div className="mb-8">
                                <div className="relative">
                                    {/* Images Container - Fixed height container */}
                                    <div className="relative flex items-center justify-center min-h-[320px]">
                                        {/* Left Arrow */}
                                        {hasMultipleImages && (
                                            <button
                                                onClick={handlePrevious}
                                                className="absolute left-4 z-10 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Images Container - All images rendered with copies for smooth wrapping */}
                                        <div className="relative flex items-center justify-center w-full" style={{ height: `${maxImageHeight}px` }}>
                                            {hasMultipleImages ? (
                                                <>
                                                    {/* Render all images at their positions */}
                                                    {carouselImages.map((image, imgIdx) => {
                                                        // Calculate position relative to current center
                                                        let positionOffset = imgIdx - currentImageIndex;

                                                        // Handle wrapping for circular carousel
                                                        if (positionOffset > carouselImages.length / 2) {
                                                            positionOffset -= carouselImages.length;
                                                        } else if (positionOffset < -carouselImages.length / 2) {
                                                            positionOffset += carouselImages.length;
                                                        }

                                                        const isCenter = positionOffset === 0;
                                                        const isLeft = positionOffset === -1;
                                                        const isRight = positionOffset === 1;
                                                        const isVisible = Math.abs(positionOffset) <= 1;

                                                        // Position calculations
                                                        let translateX = 0;
                                                        let scale = 0.3;
                                                        let opacity = 0;

                                                        if (isCenter) {
                                                            translateX = 0;
                                                            scale = 1;
                                                            opacity = 1;
                                                        } else if (isLeft) {
                                                            translateX = -35; // Side image visible on the left
                                                            scale = 0.5;
                                                            opacity = 0.5;
                                                        } else if (isRight) {
                                                            translateX = 35; // Side image visible on the right
                                                            scale = 0.5;
                                                            opacity = 0.5;
                                                        } else {
                                                            translateX = positionOffset > 0 ? 100 : -100;
                                                            scale = 0.2;
                                                            opacity = 0;
                                                        }

                                                        return (
                                                            <div
                                                                key={`img-${imgIdx}`}
                                                                className="absolute flex items-center justify-center"
                                                                style={{
                                                                    left: '50%',
                                                                    transform: `translate(calc(-50% + ${translateX}vw), 0)`,
                                                                    opacity: opacity,
                                                                    width: isCenter ? '60%' : '25%',
                                                                    maxWidth: isCenter ? '800px' : '400px',
                                                                    zIndex: isCenter ? 10 : isVisible ? 5 : 0,
                                                                    pointerEvents: isCenter ? 'auto' : 'none'
                                                                }}
                                                            >
                                                                <img
                                                                    src={image.src}
                                                                    alt={String(image.alt || "")}
                                                                    className="h-auto object-contain rounded-lg shadow-lg cursor-zoom-in"
                                                                    style={{
                                                                        maxHeight: isCenter ? '280px' : '200px',
                                                                        width: isCenter ? '100%' : `${scale * 100}%`,
                                                                        height: 'auto',
                                                                        imageRendering: 'auto'
                                                                    }}
                                                                    onClick={() => {
                                                                        if (isCenter) {
                                                                            setLightboxImages(
                                                                                carouselImages.map((img) => ({
                                                                                    src: img.src,
                                                                                    description: img.caption || "",
                                                                                }))
                                                                            );
                                                                            setLightboxIndex(imgIdx);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}

                                                </>
                                            ) : (
                                                // Show single or two images without carousel
                                                carouselImages.map((image, idx) => (
                                                    <div key={idx} className="flex flex-col items-center justify-center flex-1">
                                                        <img
                                                            src={image.src}
                                                            alt={String(image.alt || "")}
                                                            className="w-full h-auto object-contain rounded-lg shadow-lg cursor-zoom-in max-h-[280px]"
                                                            onClick={() => {
                                                                setLightboxImages(
                                                                    carouselImages.map((img) => ({
                                                                        src: img.src,
                                                                        description: img.caption || "",
                                                                    }))
                                                                );
                                                                setLightboxIndex(idx);
                                                            }}
                                                        />
                                                        {/* Show caption below each image when there are 2 images */}
                                                        {carouselImages.length === 2 && (
                                                            <div className="mt-2 text-center w-full">
                                                                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                                                    Figure {idx + 1}: {image.caption || ""}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Right Arrow */}
                                        {hasMultipleImages && (
                                            <button
                                                onClick={handleNext}
                                                className="absolute right-4 z-10 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                                aria-label="Next image"
                                            >
                                                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Fixed Text Container - Always in the same position */}
                                    {hasMultipleImages && (
                                        <div className="mt-4 text-center min-h-[80px]">
                                            {(() => {
                                                const currentImage = carouselImages[currentImageIndex];
                                                const currentActualIndex = currentImageIndex;
                                                return (
                                                    <>
                                                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                                            Figure {currentActualIndex + 1}: {currentImage?.caption || ""}
                                                        </p>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Fixed Text for single image only (when there's 1 image, not 2) */}
                                    {!hasMultipleImages && carouselImages.length === 1 && (
                                        <div className="mt-4 text-center min-h-[80px]">
                                            {carouselImages.map((image, idx) => (
                                                <div key={idx}>
                                                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                                        Figure {idx + 1}: {image.caption || ""}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video (if available) */}
                        {project.video && (
                            <div className="w-full aspect-video mb-8">
                                <iframe
                                    src={project.video}
                                    className="w-full h-full rounded-md shadow"
                                    title="Project video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {/* Project Description */}
                        <div className="mb-6">
                            <div className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {project.details.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 last:mb-0">
                                        {paragraph.split('\n').map((line, lineIdx) => (
                                            <React.Fragment key={lineIdx}>
                                                {line}
                                                {lineIdx < paragraph.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{project.date}</p>
                            {project.status && (
                                <p className="text-sm text-blue-700 dark:text-blue-300 italic mb-2">{project.status}</p>
                            )}
                        </div>
                    </div>
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
                />
            )}
        </>
    );
}

