'use client';
import Image from 'next/image';

export default function MascotClock() {
  return (
    <Image
      src="/Roger.png"
      alt="Roger mascot"
      width={96}
      height={96}
      className="object-contain select-none pointer-events-none float-slow"
      priority
    />
  );
}
