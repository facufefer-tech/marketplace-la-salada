"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
  "https://images.unsplash.com/photo-1573408301185-9519f94f8be5?w=800",
];

export function HeroRotator() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((v) => (v + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Moda argentina"
          fill
          className={`object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          priority={i === 0}
          sizes="100vw"
        />
      ))}
    </>
  );
}
