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
import Image from 'next/image'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { useTranslation } from '@/hooks/use-translation'

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);


const useEndorsements = () => {
    const { t } = useTranslation();
    return [
        {
            quote: t('testimonial_1_quote'),
            author: t('testimonial_1_author'),
            title: t('testimonial_1_title'),
            avatar: getImage('endorsement-scientist')?.imageUrl!
        },
        {
            quote: t('testimonial_2_quote'),
            author: t('testimonial_2_author'),
            title: t('testimonial_2_title'),
            avatar: getImage('endorsement-mentor')?.imageUrl!
        },
        {
            quote: t('testimonial_3_quote'),
            author: t('testimonial_3_author'),
            title: t('testimonial_3_title'),
            avatar: getImage('endorsement-farmer')?.imageUrl!
        }
    ];
}

export const EndorsementCarousel = () => {
  const endorsements = useEndorsements();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })])
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {endorsements.map((endorsement, index) => (
            <div className="flex-grow-0 flex-shrink-0 basis-full min-w-0 pl-6" key={index}>
              <div className="p-8 rounded-2xl text-center flex flex-col items-center bg-background-secondary border border-white/10">
                 <Image src={endorsement.avatar} alt={endorsement.author} width={80} height={80} className="rounded-full mb-6 border-2 border-primary/50" />
                <blockquote className="border-l-0 pl-0 italic text-muted-foreground text-lg md:text-xl max-w-2xl">
                  "{endorsement.quote}"
                </blockquote>
                <div className="mt-8">
                    <p className="font-semibold text-lg">{endorsement.author}</p>
                    <p className="text-sm text-muted-foreground">{endorsement.title}</p>
                </div>
              </div>
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
  )
}
