"use client";

import Image from "next/image";
import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui";

interface TestimonialsCarouselProps {
  testimonials: {
    id: number;
    text: string;
    author: string;
    role: string;
    image: string;
  }[];
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTestimonial = testimonials[currentIndex];

  return (
    <>
      <figure className="relative">
        <blockquote className="italic px-10 relative">
          <span className="absolute left-0 top-[-20px] text-[70px] text-primary font-young-serif">
            &quot;
          </span>
          <span className="inline-block">{currentTestimonial.text}</span>
          <span className="absolute right-[20px] top-[-20px] text-[70px] text-primary font-young-serif">
            &quot;
          </span>
        </blockquote>
        <figcaption className="flex justify-center items-center gap-2 mt-4">
          <Image
            src={currentTestimonial.image}
            alt={`Foto de ${currentTestimonial.author}`}
            width={40}
            height={40}
            className="rounded-full border-1 border-p-xanthous p-0.25 w-12 h-12"
          />
          <div>
            <p className="font-bold">{currentTestimonial.author}</p>
            <p className="text-sm">{currentTestimonial.role}</p>
          </div>
        </figcaption>
      </figure>
      <RadioGroup
        className="flex justify-center mt-4"
        value={currentIndex.toString()}
        onValueChange={(value) => setCurrentIndex(Number(value))}
      >
        {testimonials.map((_, index) => (
          <RadioGroupItem key={index} value={index.toString()} />
        ))}
      </RadioGroup>
    </>
  );
}
