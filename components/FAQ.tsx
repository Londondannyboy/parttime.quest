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
    question: 'What is a Part-Time CMO?',
    answer: 'A Part-Time CMO (Chief Marketing Officer) is an experienced marketing executive who works with companies on a part-time or contract basis, typically 1-3 days per week. They provide strategic marketing leadership without the commitment and cost of a full-time hire, making senior marketing expertise accessible to startups, scale-ups, and SMEs.',
  },
  {
    question: 'How much do Part-Time CMO jobs pay in the UK?',
    answer: 'Part-Time CMO day rates in the UK typically range from £700 to £1,400 per day, depending on experience, industry, and location. London-based roles often command premium rates of £900-£1,400/day, while regional positions average £700-£1,000/day. Annual earnings for part-time CMOs working with multiple clients can range from £100,000 to £250,000+.',
  },
  {
    question: 'What qualifications do I need for Part-Time CMO jobs?',
    answer: 'Successful Part-Time CMO candidates typically have 12-15+ years of marketing experience with at least 5 years in senior leadership roles. Key requirements include a proven track record of driving revenue growth, expertise in specific marketing channels (performance, brand, PLG, ABM), experience building and managing teams, and strong stakeholder management skills.',
  },
  {
    question: 'How many days per week do Part-Time CMOs work?',
    answer: 'Most Part-Time CMO engagements involve 1-3 days per week per client. Many part-time CMOs work with 2-4 clients simultaneously, totaling 4-5 working days per week. Engagement intensity often varies based on company needs - increasing during product launches or fundraising and reducing during steady-state periods.',
  },
  {
    question: 'What industries hire Part-Time CMOs in the UK?',
    answer: 'The highest demand for Part-Time CMOs in the UK comes from B2B SaaS companies, FinTech, DTC/E-commerce, HealthTech, and Professional Services. Startups post-Series A frequently hire part-time CMOs to establish marketing foundations, while established SMEs use them for specific initiatives like rebranding or market expansion.',
  },
  {
    question: 'What is the difference between a Part-Time CMO and a Marketing Consultant?',
    answer: 'A Part-Time CMO is an embedded executive who takes ownership of marketing strategy and typically manages teams, attends leadership meetings, and is accountable for results. A Marketing Consultant typically provides advice and recommendations on specific projects without the ongoing leadership responsibilities. Part-Time CMOs are often seen as part of the executive team.',
  },
]

export const CFO_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time CFO?',
    answer: 'A Part-Time CFO (Chief Financial Officer) is an experienced finance executive who works with companies on a part-time basis, typically 1-3 days per week. They provide strategic financial leadership, fundraising support, and financial operations expertise without the cost of a full-time CFO hire.',
  },
  {
    question: 'How much do Part-Time CFO jobs pay in the UK?',
    answer: 'Part-Time CFO day rates in the UK typically range from £800 to £1,500 per day, with London roles often at the higher end. Annual earnings for experienced part-time CFOs with multiple clients can exceed £200,000.',
  },
  {
    question: 'What qualifications do I need for Part-Time CFO jobs?',
    answer: 'Part-Time CFOs typically need ACA, ACCA, or CIMA qualifications, 15+ years of finance experience including senior leadership roles, and expertise in areas like fundraising, M&A, or financial transformation. Industry-specific knowledge (e.g., SaaS metrics, e-commerce) is highly valued.',
  },
  {
    question: 'What do Part-Time CFOs do?',
    answer: 'Part-Time CFOs handle strategic financial planning, fundraising and investor relations, financial reporting and compliance, cash flow management, building finance teams, M&A support, and board reporting. They act as a strategic partner to the CEO and leadership team.',
  },
]

export const CTO_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time CTO?',
    answer: 'A Part-Time CTO (Chief Technology Officer) is an experienced technology leader who works with companies on a part-time basis. They provide technical strategy, architecture guidance, and engineering leadership without the commitment of a full-time CTO hire.',
  },
  {
    question: 'How much do Part-Time CTO jobs pay in the UK?',
    answer: 'Part-Time CTO day rates in the UK typically range from £800 to £1,600 per day, with highly specialized roles (AI, security) commanding premium rates. London-based and FinTech roles often pay at the higher end of this range.',
  },
  {
    question: 'When should a company hire a Part-Time CTO?',
    answer: 'Companies typically hire Part-Time CTOs when they need technical leadership but cannot justify or afford a full-time CTO. Common scenarios include early-stage startups building their first product, companies needing technical due diligence for fundraising, or businesses undergoing digital transformation.',
  },
]

export const COO_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time COO?',
    answer: 'A Part-Time COO (Chief Operating Officer) is an experienced operations executive who works with companies on a part-time basis. They focus on operational efficiency, process optimization, scaling operations, and implementing systems to support growth.',
  },
  {
    question: 'How much do Part-Time COO jobs pay in the UK?',
    answer: 'Part-Time COO day rates in the UK typically range from £700 to £1,300 per day. Rates vary based on industry, company stage, and specific operational challenges being addressed.',
  },
  {
    question: 'What does a Part-Time COO do?',
    answer: 'Part-Time COOs focus on operational strategy, process improvement, team structure optimization, implementing operational systems, managing key initiatives, and ensuring the business can scale efficiently. They often work closely with the CEO to execute on strategic priorities.',
  },
]

// Location-based FAQs
export const LONDON_FAQS: FAQItem[] = [
  {
    question: 'How much do part-time executives earn in London?',
    answer: 'London part-time executives typically earn £800-£1,500 per day, which is 15-25% higher than national UK averages. Most professionals work with 2-4 clients simultaneously, earning £150,000-£300,000+ annually.',
  },
  {
    question: 'Which London areas have the most part-time jobs?',
    answer: 'The City of London has the most opportunities, followed by Shoreditch/Tech City. Canary Wharf, Kings Cross, and Westminster also have strong part-time markets. Each area tends to specialize: City for finance, Shoreditch for tech startups, Canary Wharf for corporate.',
  },
  {
    question: 'Do I need to commute to London for part-time roles?',
    answer: 'Most London part-time roles are hybrid, requiring 1-2 days per week in the office. Around 65% of positions offer remote working for the remaining days. Some roles are fully remote with occasional in-person meetings.',
  },
  {
    question: 'What industries hire part-time executives in London?',
    answer: 'FinTech, SaaS/Cloud, and HealthTech lead part-time hiring in London. E-commerce, PropTech, and EdTech are also growing rapidly. The City attracts finance-focused roles while Shoreditch dominates tech hiring.',
  },
  {
    question: 'Is London competitive for part-time roles?',
    answer: 'Yes, but the market is large enough for experienced executives. London accounts for around 60% of UK part-time opportunities. Building a niche specialism (industry or function) and strong network are key to standing out.',
  },
]

export const MANCHESTER_FAQS: FAQItem[] = [
  {
    question: 'How much do part-time executives earn in Manchester?',
    answer: 'Manchester part-time executives typically earn £650-£1,200 per day. While lower than London rates, the lower cost of living means comparable purchasing power. Many executives work with a mix of Manchester and remote London clients.',
  },
  {
    question: 'What industries hire part-time executives in Manchester?',
    answer: 'Manchester has strong demand in digital/ecommerce, media, and professional services. The growing tech scene in MediaCityUK and the Northern Quarter creates opportunities for part-time CTOs and CMOs.',
  },
  {
    question: 'Is Manchester a good base for part-time work?',
    answer: 'Yes. Manchester offers excellent transport links, lower living costs than London, and a growing business ecosystem. Many part-time executives are based in Manchester and work with clients across the North and remotely with London companies.',
  },
]

export const BIRMINGHAM_FAQS: FAQItem[] = [
  {
    question: 'How much do part-time executives earn in Birmingham?',
    answer: 'Birmingham part-time executives typically earn £600-£1,100 per day. The Midlands market is growing, with opportunities in manufacturing, automotive, and professional services sectors.',
  },
  {
    question: 'What sectors hire part-time executives in Birmingham?',
    answer: 'Birmingham has strong demand in manufacturing, automotive, logistics, and professional services. The city is also seeing growth in FinTech and tech startups, creating new opportunities for part-time leaders.',
  },
]

// Industry-based FAQs
export const TECH_FAQS: FAQItem[] = [
  {
    question: 'How much do Part-Time CTOs earn in the UK?',
    answer: 'Part-Time CTOs in the UK typically earn £1,000-£1,500 per day. Those with expertise in AI/ML, cloud architecture, or cybersecurity command the highest rates. Working 2-3 days per week across 2-3 clients, annual earnings of £200,000-£350,000 are achievable.',
  },
  {
    question: 'What experience do I need for part-time tech roles?',
    answer: 'Most part-time tech leadership roles require 15+ years of experience with at least 5 years in senior positions (CTO, VP Engineering, Tech Director). Startup or scale-up experience is highly valued, as is experience with technical due diligence and team scaling.',
  },
  {
    question: 'Are part-time tech roles mostly remote?',
    answer: 'Yes - approximately 65% of part-time tech roles offer remote or hybrid working. Tech leadership is well-suited to remote work, though most clients prefer some in-person time for team building and strategic sessions.',
  },
  {
    question: 'What tech skills are most in demand for part-time roles?',
    answer: 'Cloud architecture (AWS/GCP/Azure), AI/ML implementation, DevOps, security/compliance, and team scaling are the most sought-after skills. Experience with technical due diligence for fundraising and M&A is also highly valued.',
  },
]

export const SAAS_FAQS: FAQItem[] = [
  {
    question: 'Why do SaaS companies hire part-time executives?',
    answer: 'SaaS companies often need specialized expertise at different growth stages. Part-Time executives provide experienced leadership for challenges like scaling ARR, building teams, preparing for fundraising, or expanding into new markets - without full-time costs.',
  },
  {
    question: 'What part-time roles are most common in SaaS?',
    answer: 'Part-Time CMOs and CTOs are most common, followed by CFOs. SaaS companies particularly value part-time executives with experience in product-led growth, demand generation, SaaS metrics, and preparing for venture funding.',
  },
  {
    question: 'What SaaS experience do part-time roles require?',
    answer: 'Most SaaS part-time roles require proven experience with SaaS metrics (ARR, MRR, churn, CAC/LTV), understanding of subscription business models, and track record of scaling SaaS companies through different growth stages.',
  },
]

export const FINANCE_FAQS: FAQItem[] = [
  {
    question: 'What part-time roles are available in financial services?',
    answer: 'Financial services companies hire part-time executives across finance, technology, compliance, and operations. Part-Time CFOs, CTOs, and Chief Risk Officers are particularly common in FinTech and growing financial services firms.',
  },
  {
    question: 'Do I need financial services experience for these roles?',
    answer: 'Most roles in financial services require sector-specific experience, particularly around regulatory compliance (FCA), risk management, and financial product development. FinTech roles often value both traditional finance and tech backgrounds.',
  },
]

export const HEALTHCARE_FAQS: FAQItem[] = [
  {
    question: 'What part-time opportunities exist in healthcare?',
    answer: 'Healthcare and HealthTech companies hire part-time executives in technology, commercial, operations, and clinical leadership. Part-Time CTOs, CMOs, and COOs are common, along with specialist roles like Chief Medical Officers.',
  },
  {
    question: 'What qualifications are needed for healthcare part-time roles?',
    answer: 'Healthcare part-time roles typically require sector experience, understanding of NHS/private healthcare landscapes, and knowledge of healthcare regulations. HealthTech roles often seek executives who can bridge clinical and commercial expertise.',
  },
]

export const ECOMMERCE_FAQS: FAQItem[] = [
  {
    question: 'What part-time roles do ecommerce companies hire?',
    answer: 'Ecommerce and DTC brands commonly hire part-time CMOs (for customer acquisition and retention), CTOs (for platform scaling), and CFOs (for unit economics and funding). Part-Time COOs help with fulfilment and operations scaling.',
  },
  {
    question: 'What skills are valued in ecommerce part-time roles?',
    answer: 'Experience with performance marketing, marketplace management (Amazon, Shopify), conversion optimization, and unit economics are highly valued. Understanding seasonal planning, inventory management, and logistics is also important.',
  },
]

export const STARTUPS_FAQS: FAQItem[] = [
  {
    question: 'When should a startup hire a part-time executive?',
    answer: 'Startups typically hire part-time executives when they need senior expertise but cannot afford or justify full-time C-suite hires. Common triggers include preparing for fundraising, scaling after Series A, or addressing specific growth challenges.',
  },
  {
    question: 'What do part-time executives cost vs full-time hires?',
    answer: 'Part-Time executives typically cost 30-50% less than equivalent full-time hires when factoring in salary, equity, benefits, and overhead. A part-time CFO at £1,000/day for 2 days/week costs around £100k/year vs £150-180k for a full-time CFO.',
  },
  {
    question: 'How do startups structure part-time engagements?',
    answer: 'Most startup part-time engagements are 1-2 days per week on retainer, with flexibility to scale up during critical periods (fundraising, launches). Typical engagement lengths are 6-12 months, though many become ongoing relationships.',
  },
]

// Service-focused FAQs (for company/employer audience)
export const CFO_SERVICE_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time CFO?',
    answer: 'A Part-Time CFO is an experienced Chief Financial Officer who works with your company on a part-time basis, typically 1-3 days per week. You get senior-level financial leadership, strategic guidance, and hands-on expertise at a fraction of the cost of a full-time CFO.',
  },
  {
    question: 'When should my company hire a Part-Time CFO?',
    answer: 'Consider hiring a part-time CFO when: you\'re preparing for fundraising or due diligence; your finance function needs professionalising; you need strategic financial guidance but can\'t justify a full-time CFO; you\'re scaling rapidly and need to build financial infrastructure; or you\'re navigating a major transition (M&A, restructuring, IPO prep).',
  },
  {
    question: 'How much does a Part-Time CFO cost?',
    answer: 'Part-Time CFOs typically charge £800-£1,500 per day in the UK, depending on experience and specialisation. At 2 days per week, this translates to roughly £80,000-£150,000 annually—compared to £180,000-£300,000+ for a full-time CFO (including salary, benefits, and overhead).',
  },
  {
    question: 'What does a Part-Time CFO do?',
    answer: 'A Part-Time CFO handles strategic financial planning, cash flow management, fundraising support, financial reporting and board packs, budgeting and forecasting, team building, investor relations, compliance, and financial process improvement. They act as a strategic partner to the CEO and leadership team.',
  },
  {
    question: 'How is a Part-Time CFO different from a Finance Director or Financial Controller?',
    answer: 'A Part-Time CFO operates at the strategic level—they focus on capital strategy, fundraising, M&A, and board-level reporting. Finance Directors and Financial Controllers focus more on operational finance, day-to-day accounting, and financial controls. Many companies use a part-time CFO alongside an internal FD or FC.',
  },
  {
    question: 'How long do Part-Time CFO engagements typically last?',
    answer: 'Most part-time CFO engagements start with a 6-month commitment and extend based on mutual fit. Many become ongoing relationships lasting 2-3+ years. Engagements can flex up (during fundraising) or down (during steady periods) based on your needs.',
  },
  {
    question: 'What should I look for when hiring a Part-Time CFO?',
    answer: 'Look for: relevant industry experience (SaaS metrics, e-commerce, etc.); track record with companies at your stage; specific expertise you need (fundraising, M&A, international expansion); cultural fit with your team; professional qualifications (ACA, ACCA, CIMA); and strong communication skills for board and investor interactions.',
  },
  {
    question: 'Can a Part-Time CFO help with fundraising?',
    answer: 'Yes—fundraising support is one of the most common reasons to hire a part-time CFO. They can build financial models, prepare data rooms, create investor presentations, manage due diligence, negotiate terms, and provide credibility with investors. Many part-time CFOs have raised hundreds of millions across multiple deals.',
  },
]

export const CMO_SERVICE_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time CMO?',
    answer: 'A Part-Time CMO is an experienced Chief Marketing Officer who works with your company part-time, typically 1-3 days per week. You get strategic marketing leadership, team management, and growth expertise without the cost of a full-time executive hire.',
  },
  {
    question: 'When should my company hire a Part-Time CMO?',
    answer: 'Consider hiring a part-time CMO when: you need to build or rebuild your marketing strategy; your marketing team needs senior leadership; you\'re scaling and need to professionalise marketing; you\'re launching into new markets or segments; your current marketing isn\'t delivering results; or you need expertise in specific areas (PLG, demand gen, brand).',
  },
  {
    question: 'How much does a Part-Time CMO cost?',
    answer: 'Part-Time CMOs typically charge £700-£1,400 per day in the UK. At 2 days per week, this translates to roughly £70,000-£140,000 annually—compared to £150,000-£250,000+ for a full-time CMO (including salary, benefits, and overhead). You save 40-60% while getting equivalent expertise.',
  },
  {
    question: 'What does a Part-Time CMO do?',
    answer: 'A Part-Time CMO develops marketing strategy, manages and mentors your marketing team, oversees campaigns and channels, builds marketing infrastructure, tracks performance metrics, manages agency relationships, aligns marketing with sales, and reports to the board on marketing performance and ROI.',
  },
  {
    question: 'How is a Part-Time CMO different from a marketing agency?',
    answer: 'A Part-Time CMO is an embedded leader—they join your team, attend leadership meetings, manage your people, and take ownership of results. Agencies execute specific campaigns or channels but don\'t provide strategic leadership or team management. Many companies use both: a part-time CMO to lead strategy with agencies handling execution.',
  },
  {
    question: 'What experience should a Part-Time CMO have?',
    answer: 'Look for: 12-15+ years of marketing experience with 5+ years in leadership roles; proven track record of driving growth; expertise relevant to your business (B2B, DTC, PLG, ABM); experience at companies similar to your stage; team building and management experience; and strong analytical skills.',
  },
  {
    question: 'Can a Part-Time CMO work with my existing marketing team?',
    answer: 'Yes—managing and mentoring existing teams is a core part of the role. A part-time CMO can provide the leadership and direction your team needs, help develop team members, identify skill gaps, and make hiring recommendations. They provide the "CMO layer" that many marketing teams are missing.',
  },
  {
    question: 'How quickly can a Part-Time CMO make an impact?',
    answer: 'Most part-time CMOs can begin adding value within the first 2-4 weeks—conducting audits, identifying quick wins, and developing initial strategy. Significant results typically emerge within 3-6 months as strategies are implemented. The key is that part-time CMOs are experienced and can move fast.',
  },
]

export const CTO_SERVICE_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time CTO?',
    answer: 'A Part-Time CTO is an experienced Chief Technology Officer who works with your company part-time, typically 1-3 days per week. You get technical leadership, architecture guidance, and engineering strategy without the cost of a full-time CTO.',
  },
  {
    question: 'When should my company hire a Part-Time CTO?',
    answer: 'Consider hiring a part-time CTO when: you\'re building your first product and need technical direction; your engineering team needs senior leadership; you\'re preparing for fundraising and need technical credibility; you\'re scaling and need to evolve your architecture; or you need expertise in specific areas (AI, security, cloud migration).',
  },
  {
    question: 'How much does a Part-Time CTO cost?',
    answer: 'Part-Time CTOs typically charge £850-£1,600 per day in the UK, with specialised expertise (AI, security) at the higher end. At 2 days per week, this translates to roughly £85,000-£160,000 annually—compared to £180,000-£350,000+ for a full-time CTO.',
  },
  {
    question: 'What does a Part-Time CTO do?',
    answer: 'A Part-Time CTO sets technical strategy, makes architecture decisions, leads and mentors engineering teams, conducts code and security reviews, manages technical debt, oversees vendor selection, supports fundraising with technical credibility, and reports to the board on technology matters.',
  },
  {
    question: 'Can a Part-Time CTO help with technical due diligence?',
    answer: 'Yes—technical due diligence is a common reason to engage a part-time CTO. They can prepare your technology for investor scrutiny, address technical debt concerns, document architecture, and represent your technical capabilities during fundraising or M&A processes.',
  },
  {
    question: 'What\'s the difference between a Part-Time CTO and a technical consultant?',
    answer: 'A Part-Time CTO takes ownership and accountability—they lead your technical function, make decisions, manage people, and are responsible for outcomes. Technical consultants typically advise on specific problems without ongoing leadership responsibility. A part-time CTO is part of your team.',
  },
  {
    question: 'What experience should a Part-Time CTO have?',
    answer: 'Look for: 15+ years of engineering experience with significant leadership roles; experience at companies similar to your stage and scale; relevant technical expertise (your stack, your challenges); track record of building and scaling teams; strong communication skills for board and investor interactions.',
  },
  {
    question: 'How does a Part-Time CTO work with existing developers?',
    answer: 'A Part-Time CTO provides the technical leadership layer your developers need. They set technical direction, remove blockers, make architecture decisions, conduct code reviews, mentor senior engineers, and create the processes and standards that help teams work effectively. They elevate your whole engineering function.',
  },
]

export const COO_SERVICE_FAQS: FAQItem[] = [
  {
    question: 'What is a Part-Time COO?',
    answer: 'A Part-Time COO is an experienced Chief Operating Officer who works with your company part-time, typically 1-3 days per week. You get operational leadership, process optimisation, and scaling expertise without the cost of a full-time COO.',
  },
  {
    question: 'When should my company hire a Part-Time COO?',
    answer: 'Consider hiring a part-time COO when: you\'re scaling rapidly and operations are struggling to keep up; your processes are inefficient or undocumented; you need to build operational infrastructure; you\'re experiencing growing pains; or the CEO is spending too much time on operations instead of strategy.',
  },
  {
    question: 'How much does a Part-Time COO cost?',
    answer: 'Part-Time COOs typically charge £750-£1,400 per day in the UK. At 2 days per week, this translates to roughly £75,000-£140,000 annually—compared to £160,000-£250,000+ for a full-time COO.',
  },
  {
    question: 'What does a Part-Time COO do?',
    answer: 'A Part-Time COO optimises operations and processes, implements systems and tools, manages key initiatives and projects, builds operational teams, creates playbooks and SOPs, oversees vendor relationships, drives cross-functional alignment, and frees the CEO to focus on strategy and growth.',
  },
  {
    question: 'How is a Part-Time COO different from an Operations Manager?',
    answer: 'A Part-Time COO operates at the strategic level—they design the operating model, make decisions about systems and structure, and work across all departments. Operations Managers focus on day-to-day execution within specific areas. A part-time COO often builds the framework that operations managers then run.',
  },
  {
    question: 'What experience should a Part-Time COO have?',
    answer: 'Look for: 15+ years of operations experience with senior leadership roles; experience scaling companies similar to yours; track record of building systems and processes; cross-functional experience (operations touches everything); project management and implementation skills; and change management expertise.',
  },
]
