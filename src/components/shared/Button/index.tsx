import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'details' | 'destructive' | 'send'
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
    destructive: 'rounded-full border border-red-600 bg-red-100 text-red-600 transition hover:bg-red-200',
    send: 'rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50',
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