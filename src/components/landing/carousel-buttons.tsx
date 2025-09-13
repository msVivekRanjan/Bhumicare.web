'use client'

import React, { PropsWithChildren } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>

export const DotButton: React.FC<PropType & { selected: boolean }> = (
  props,
) => {
  const { children, selected, ...restProps } = props

  return (
    <button type="button" {...restProps} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${selected ? 'bg-primary scale-110' : 'bg-muted/50'}`} />
  )
}

export const PrevButton: React.FC<PropType & {enabled: boolean}> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
    <button
      className="h-10 w-10 flex items-center justify-center rounded-full bg-background-secondary border border-white/10 disabled:opacity-50 transition-all hover:border-primary/50 hover:bg-primary/10"
      type="button"
      {...restProps}
      disabled={!enabled}
    >
      <ChevronLeft className="h-5 w-5 text-primary" />
      {children}
    </button>
  )
}

export const NextButton: React.FC<PropType & {enabled: boolean}> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
     <button
      className="h-10 w-10 flex items-center justify-center rounded-full bg-background-secondary border border-white/10 disabled:opacity-50 transition-all hover:border-primary/50 hover:bg-primary/10"
      type="button"
      {...restProps}
      disabled={!enabled}
    >
      <ChevronRight className="h-5 w-5 text-primary" />
      {children}
    </button>
  )
}
