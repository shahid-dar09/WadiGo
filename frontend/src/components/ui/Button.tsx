import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]';

  const variants = {
    // Deep Indigo → on hover glow violet (light) / Rose (dark)
    primary:
      'bg-brand-primary text-white hover:bg-indigo-900 shadow-md hover:shadow-lg focus:ring-brand-primary dark:bg-brand-rose dark:hover:bg-rose-600 dark:focus:ring-brand-rose dark:shadow-glow-rose',
    // Vibrant Violet
    secondary:
      'bg-brand-secondary text-white hover:bg-violet-700 shadow-md hover:shadow-glow-violet focus:ring-brand-secondary',
    // Gold accent
    accent:
      'bg-brand-accent text-white hover:bg-yellow-500 shadow-md hover:shadow-lg focus:ring-brand-accent dark:bg-brand-teal dark:hover:bg-cyan-500 dark:shadow-glow-teal dark:focus:ring-brand-teal',
    // Gradient — animated
    gradient:
      'btn-gradient-indigo text-white shadow-md hover:shadow-glow-violet focus:ring-brand-secondary dark:btn-gradient-rose dark:shadow-glow-rose dark:focus:ring-brand-rose',
    outline:
      'border-2 border-brand-secondary/40 text-brand-secondary hover:bg-brand-secondary/8 hover:border-brand-secondary focus:ring-brand-secondary dark:border-brand-rose/40 dark:text-brand-rose dark:hover:bg-brand-rose/8 dark:hover:border-brand-rose dark:focus:ring-brand-rose',
    ghost:
      'text-brand-primary hover:bg-indigo-50 hover:text-brand-secondary focus:ring-brand-secondary dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-brand-rose dark:focus:ring-brand-rose',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
