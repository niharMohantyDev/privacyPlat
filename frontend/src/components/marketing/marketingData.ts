export interface PillarFeature {
  code: string
  title: string
  question: string
  description: string
  status: 'live' | 'soon'
  href?: string
}

// The six product pillars — status reflects what's actually built so
// far, not aspirational marketing copy. Consent and Rights are real;
// the rest are the roadmap's next phases.
export const PILLAR_FEATURES: PillarFeature[] = [
  {
    code: 'discover',
    title: 'Discover',
    question: 'Where is personal data?',
    description:
      'Automatically scan databases, cloud storage, and SaaS apps to build a live inventory of every place personal data lives.',
    status: 'soon',
  },
  {
    code: 'consent',
    title: 'Consent',
    question: 'What did the person allow?',
    description:
      'Cookie banners, granular purpose-based consent, and a preference center — with GDPR, DPDP, and CCPA-aware rules built in.',
    status: 'live',
    href: '/demo',
  },
  {
    code: 'rights',
    title: 'Rights',
    question: 'What do they want us to do?',
    description:
      'A full data-subject request workflow from submission to resolution, with jurisdiction-aware SLA deadlines tracked automatically.',
    status: 'live',
    href: '/rights',
  },
  {
    code: 'govern',
    title: 'Govern',
    question: 'Are we processing data correctly?',
    description:
      'Records of processing, DPIAs, vendor and retention management — generated from what your systems actually show, not spreadsheets.',
    status: 'soon',
  },
  {
    code: 'protect',
    title: 'Protect',
    question: 'Can we prevent misuse?',
    description:
      'Masking, anonymization, and AI-prompt PII detection to stop sensitive data leaking where it shouldn’t.',
    status: 'soon',
  },
  {
    code: 'prove',
    title: 'Prove',
    question: 'Can we demonstrate compliance?',
    description:
      'Live compliance dashboards and audit trails, mapped once across every framework you’re held to.',
    status: 'soon',
  },
]

export interface Testimonial {
  quote: string
  name: string
  title: string
  company: string
}

// Placeholder copy — real customer quotes go here once we have them.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Avery Chen',
    title: 'Head of Privacy',
    company: 'Northwind Retail',
  },
  {
    quote:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    name: 'Priya Nair',
    title: 'General Counsel',
    company: 'Fenwick & Vale',
  },
  {
    quote:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    name: 'Marcus Obi',
    title: 'VP Engineering',
    company: 'Latchkey Health',
  },
  {
    quote:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    name: 'Sofia Ramirez',
    title: 'Data Protection Officer',
    company: 'Bramble & Co.',
  },
]
