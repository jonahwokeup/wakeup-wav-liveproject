import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  className?: string;
};

export default function Button({ variant = 'primary', className = '', ...rest }: Props) {
  const base = 'px-4 py-2 rounded-xl text-sm font-medium transition';
  const styles = variant === 'primary'
    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-black hover:opacity-90'
    : 'bg-transparent text-zinc-300 hover:text-white border border-zinc-800';
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}
