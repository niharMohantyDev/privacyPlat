import { CtaBanner } from '@/components/marketing/CtaBanner'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { Hero } from '@/components/marketing/Hero'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { TestimonialCarousel } from '@/components/marketing/TestimonialCarousel'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <MarketingHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <TestimonialCarousel />
        <CtaBanner />
      </main>
      <MarketingFooter />
    </div>
  )
}
