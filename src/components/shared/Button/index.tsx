import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'details'
  icon?: LucideIcon
}

export function Button({
  variant,
  icon: Icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'flex cursor-pointer items-center justify-center font-medium text-sm gap-2 px-4 py-3 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80'

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground font-semibold rounded-xl',
    secondary: 'bg-secondary-button border border-border rounded-3xl',
    ghost: 'rounded-lg text-foreground',
    details: 'rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
  }

  return (
    <button
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      {...props}
    >
      {Icon && <Icon />}
      {children}
    </button>
  )
}