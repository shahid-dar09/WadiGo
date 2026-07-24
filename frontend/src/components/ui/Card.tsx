import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverable = true,
  glow = false,
  className = '',
  ...props
}) => {
  const baseCard = glass
    ? 'glass-panel rounded-2xl p-5 shadow-glass transition-all duration-300'
    : 'bg-white dark:bg-brand-darkSurface rounded-2xl p-5 border border-indigo-100/60 dark:border-brand-rose/10 shadow-sm transition-all duration-300';

  const hoverEffects = hoverable ? 'card-hover-violet cursor-pointer' : '';
  const glowEffect   = glow
    ? 'shadow-glow-violet dark:shadow-glow-rose'
    : '';

  return (
    <div
      className={`${baseCard} ${hoverEffects} ${glowEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
