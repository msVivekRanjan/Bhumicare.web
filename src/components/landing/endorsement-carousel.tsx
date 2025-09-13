'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  DotButton,
  PrevButton,
  NextButton,
} from './carousel-buttons'
import { motion } from 'framer-motion'

const endorsements = [
  {
    quote: "Bhumicare's ground-level data is the missing piece in precision agriculture. It has the potential to revolutionize how we manage soil health at scale.",
    author: "— Agricultural Scientist"
  },
  {
    quote: "A brilliant application of IoT and AI to solve a real-world problem for millions. This is the future of sustainable farming.",
    author: "— Startup Mentor"
  },
  {
    quote: "The simplicity of receiving advice in my own dialect makes all the difference. It's like having an expert in my pocket.",
    author: "— Farmer, Odisha"
  }
]

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeInOut' },
};


export const EndorsementCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })])
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  )
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, setScrollSnaps, onSelect])

  return (
    <motion.div className="w-full max-w-4xl mx-auto" variants={fadeIn}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {endorsements.map((endorsement, index) => (
            <div className="flex-grow-0 flex-shrink-0 basis-full min-w-0 pl-4" key={index}>
              <div className="glass-card p-8 rounded-2xl text-left">
                <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground text-lg md:text-xl">
                  {endorsement.quote}
                </blockquote>
                <p className="mt-6 font-semibold text-right text-lg">{endorsement.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
       <div className="flex items-center justify-center gap-4 mt-6">
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
           <div className="flex items-center justify-center gap-2">
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
    </motion.div>
  )
}

    