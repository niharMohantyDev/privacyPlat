import { useState } from 'react'

import { Card } from '@/components/ui/Card'

import { TESTIMONIALS, type Testimonial } from './marketingData'

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[]
}

export function TestimonialCarousel({ testimonials = TESTIMONIALS }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const current = testimonials[index]

  const goTo = (next: number) => {
    setIndex((next + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900">
        What teams are saying
      </h2>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => goTo(index - 1)}
          className="rounded-full border border-neutral-300 p-2 text-neutral-500 hover:bg-neutral-50"
        >
          ←
        </button>

        <Card className="flex-1 text-center">
          <p className="text-lg text-neutral-700">“{current.quote}”</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials(current.name)}
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-900">{current.name}</p>
              <p className="text-xs text-neutral-500">
                {current.title}, {current.company}
              </p>
            </div>
          </div>
        </Card>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => goTo(index + 1)}
          className="rounded-full border border-neutral-300 p-2 text-neutral-500 hover:bg-neutral-50"
        >
          →
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((testimonial, i) => (
          <button
            key={testimonial.name}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => goTo(i)}
            className={
              i === index
                ? 'h-2 w-6 rounded-full bg-indigo-600 transition-all'
                : 'h-2 w-2 rounded-full bg-neutral-300 transition-all'
            }
          />
        ))}
      </div>
    </section>
  )
}
