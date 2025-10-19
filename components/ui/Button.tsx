'use client'
import { motion, type HTMLMotionProps } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type Props = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  loading,
  ...props
}: PropsWithChildren<Props>) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus:outline-none active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary: 'bg-emerald-500/90 hover:bg-emerald-400 text-slate-900 shadow-neon',
    secondary: 'bg-violet-500/90 hover:bg-violet-400 text-slate-900 shadow-violet',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          Generating...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
