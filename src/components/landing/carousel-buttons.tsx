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
    <button type="button" {...restProps} className={`w-3 h-3 rounded-full transition-colors ${selected ? 'bg-primary' : 'bg-muted'}`} />
  )
}

export const PrevButton: React.FC<PropType & {enabled: boolean}> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
    <button
      className="h-10 w-10 flex items-center justify-center rounded-full bg-background/50 border border-border disabled:opacity-50 transition-opacity"
      type="button"
      {...restProps}
      disabled={!enabled}
    >
      <ChevronLeft className="h-6 w-6 text-primary" />
      {children}
    </button>
  )
}

export const NextButton: React.FC<PropType & {enabled: boolean}> = (props) => {
  const { children, enabled, ...restProps } = props

  return (
     <button
      className="h-10 w-10 flex items-center justify-center rounded-full bg-background/50 border border-border disabled:opacity-50 transition-opacity"
      type="button"
      {...restProps}
      disabled={!enabled}
    >
      <ChevronRight className="h-6 w-6 text-primary" />
      {children}
    </button>
  )
}
