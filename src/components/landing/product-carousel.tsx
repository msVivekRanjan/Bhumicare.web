'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DotButton, PrevButton, NextButton } from './carousel-buttons';
import { cn } from '@/lib/utils';

const productImages = [
    'product-testing-1',
    'product-testing-2',
    'product-testing-3',
    'product-testing-4',
    'product-testing-5',
].map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);


const emblaOptions: EmblaOptionsType = {
    loop: true,
    align: 'center',
    skipSnaps: false,
};

export const ProductCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [Autoplay({ delay: 4000, stopOnInteraction: true })]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<typeof productImages[0] | null>(null);

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setPrevBtnEnabled(emblaApi.canScrollPrev())
        setNextBtnEnabled(emblaApi.canScrollNext())
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, setScrollSnaps, onSelect])

    const openLightbox = (image: typeof productImages[0]) => {
        setLightboxImage(image);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="relative w-full max-w-5xl mx-auto">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {productImages.map((image, index) => (
                            <div className="flex-grow-0 flex-shrink-0 basis-[80%] sm:basis-[60%] md:basis-[45%] min-w-0 pl-4" key={image!.id}>
                                <button
                                    onClick={() => openLightbox(image!)}
                                    className={cn(
                                        "block w-full h-full rounded-xl transition-transform duration-300 ease-in-out",
                                        index === selectedIndex ? 'scale-105' : 'scale-95 opacity-60'
                                    )}
                                >
                                    <Image
                                        src={image!.imageUrl}
                                        alt={image!.description}
                                        width={600}
                                        height={400}
                                        className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
                                        data-ai-hint={image!.imageHint}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="flex items-center justify-center gap-4 mt-8">
                    <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                    <div className="flex items-center justify-center gap-3">
                        {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            selected={index === selectedIndex}
                            onClick={() => scrollTo(index)}
                        />
                        ))}
                    </div>
                    <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                </div>
            </div>

            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-4xl p-2 bg-background/80 backdrop-blur-xl border-white/20">
                    {lightboxImage && (
                        <Image
                            src={lightboxImage.imageUrl}
                            alt={lightboxImage.description}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-contain rounded-lg"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
