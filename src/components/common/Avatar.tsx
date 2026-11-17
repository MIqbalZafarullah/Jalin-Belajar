import React, { useState } from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'Pengguna',
  src,
  size = 'sm',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'JB';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold'
  };

  // Consistent hue generator based on name
  const hues = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-teal-600 text-white',
    'bg-emerald-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white'
  ];
  const charCodeSum = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const colorClass = hues[charCodeSum % hues.length];

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover ring-1 ring-slate-200 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold tracking-tight shrink-0 shadow-2xs ${colorClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
