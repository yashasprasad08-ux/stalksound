import type { PropsWithChildren, HTMLAttributes } from 'react'

export default function Card({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={`card-cyber ${className}`} {...props}>
      {children}
    </div>
  )
}
