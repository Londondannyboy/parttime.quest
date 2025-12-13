'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
  className?: string
}

export function FAQ({ items, title = 'Frequently Asked Questions', className = '' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <section className={`${className}`}>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
              <span className="flex-shrink-0 ml-4">
                <svg
                  className={`w-5 h-5 text-purple-600 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Pre-defined FAQ sets for common pages
export const CMO_FAQS: FAQItem[] = [
  {
    question: 'What is a Fractional CMO?',
    answer: 'A Fractional CMO (Chief Marketing Officer) is an experienced marketing executive who works with companies on a part-time or contract basis, typically 1-3 days per week. They provide strategic marketing leadership without the commitment and cost of a full-time hire, making senior marketing expertise accessible to startups, scale-ups, and SMEs.',
  },
  {
    question: 'How much do Fractional CMO jobs pay in the UK?',
    answer: 'Fractional CMO day rates in the UK typically range from £700 to £1,400 per day, depending on experience, industry, and location. London-based roles often command premium rates of £900-£1,400/day, while regional positions average £700-£1,000/day. Annual earnings for fractional CMOs working with multiple clients can range from £100,000 to £250,000+.',
  },
  {
    question: 'What qualifications do I need for Fractional CMO jobs?',
    answer: 'Successful Fractional CMO candidates typically have 12-15+ years of marketing experience with at least 5 years in senior leadership roles. Key requirements include a proven track record of driving revenue growth, expertise in specific marketing channels (performance, brand, PLG, ABM), experience building and managing teams, and strong stakeholder management skills.',
  },
  {
    question: 'How many days per week do Fractional CMOs work?',
    answer: 'Most Fractional CMO engagements involve 1-3 days per week per client. Many fractional CMOs work with 2-4 clients simultaneously, totaling 4-5 working days per week. Engagement intensity often varies based on company needs - increasing during product launches or fundraising and reducing during steady-state periods.',
  },
  {
    question: 'What industries hire Fractional CMOs in the UK?',
    answer: 'The highest demand for Fractional CMOs in the UK comes from B2B SaaS companies, FinTech, DTC/E-commerce, HealthTech, and Professional Services. Startups post-Series A frequently hire fractional CMOs to establish marketing foundations, while established SMEs use them for specific initiatives like rebranding or market expansion.',
  },
  {
    question: 'What is the difference between a Fractional CMO and a Marketing Consultant?',
    answer: 'A Fractional CMO is an embedded executive who takes ownership of marketing strategy and typically manages teams, attends leadership meetings, and is accountable for results. A Marketing Consultant typically provides advice and recommendations on specific projects without the ongoing leadership responsibilities. Fractional CMOs are often seen as part of the executive team.',
  },
]

export const CFO_FAQS: FAQItem[] = [
  {
    question: 'What is a Fractional CFO?',
    answer: 'A Fractional CFO (Chief Financial Officer) is an experienced finance executive who works with companies on a part-time basis, typically 1-3 days per week. They provide strategic financial leadership, fundraising support, and financial operations expertise without the cost of a full-time CFO hire.',
  },
  {
    question: 'How much do Fractional CFO jobs pay in the UK?',
    answer: 'Fractional CFO day rates in the UK typically range from £800 to £1,500 per day, with London roles often at the higher end. Annual earnings for experienced fractional CFOs with multiple clients can exceed £200,000.',
  },
  {
    question: 'What qualifications do I need for Fractional CFO jobs?',
    answer: 'Fractional CFOs typically need ACA, ACCA, or CIMA qualifications, 15+ years of finance experience including senior leadership roles, and expertise in areas like fundraising, M&A, or financial transformation. Industry-specific knowledge (e.g., SaaS metrics, e-commerce) is highly valued.',
  },
  {
    question: 'What do Fractional CFOs do?',
    answer: 'Fractional CFOs handle strategic financial planning, fundraising and investor relations, financial reporting and compliance, cash flow management, building finance teams, M&A support, and board reporting. They act as a strategic partner to the CEO and leadership team.',
  },
]

export const CTO_FAQS: FAQItem[] = [
  {
    question: 'What is a Fractional CTO?',
    answer: 'A Fractional CTO (Chief Technology Officer) is an experienced technology leader who works with companies on a part-time basis. They provide technical strategy, architecture guidance, and engineering leadership without the commitment of a full-time CTO hire.',
  },
  {
    question: 'How much do Fractional CTO jobs pay in the UK?',
    answer: 'Fractional CTO day rates in the UK typically range from £800 to £1,600 per day, with highly specialized roles (AI, security) commanding premium rates. London-based and FinTech roles often pay at the higher end of this range.',
  },
  {
    question: 'When should a company hire a Fractional CTO?',
    answer: 'Companies typically hire Fractional CTOs when they need technical leadership but cannot justify or afford a full-time CTO. Common scenarios include early-stage startups building their first product, companies needing technical due diligence for fundraising, or businesses undergoing digital transformation.',
  },
]

export const COO_FAQS: FAQItem[] = [
  {
    question: 'What is a Fractional COO?',
    answer: 'A Fractional COO (Chief Operating Officer) is an experienced operations executive who works with companies on a part-time basis. They focus on operational efficiency, process optimization, scaling operations, and implementing systems to support growth.',
  },
  {
    question: 'How much do Fractional COO jobs pay in the UK?',
    answer: 'Fractional COO day rates in the UK typically range from £700 to £1,300 per day. Rates vary based on industry, company stage, and specific operational challenges being addressed.',
  },
  {
    question: 'What does a Fractional COO do?',
    answer: 'Fractional COOs focus on operational strategy, process improvement, team structure optimization, implementing operational systems, managing key initiatives, and ensuring the business can scale efficiently. They often work closely with the CEO to execute on strategic priorities.',
  },
]
