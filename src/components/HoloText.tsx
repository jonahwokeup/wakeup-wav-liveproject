import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

export default function HoloText({ className = '', children }: Props) {
  return (
    <span
      className={[
        'holo-text',
        'bg-gradient-to-r from-pink-500 via-purple-500 via-30% to-cyan-400',
        'bg-clip-text text-transparent',
        'animate-holo-sheen',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
