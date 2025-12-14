// Types for real-time profile extraction

export interface ExtractedSkill {
  name: string
  category?: string
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsExperience?: number
  context?: string // "Used Python for data analysis at Deloitte"
  needsDepth?: boolean // Should we ask follow-up questions?
  depthQuestions?: string[] // ["Which Python frameworks?", "What version?"]
  confidence: number // 0-1
}

export interface ExtractedCompany {
  name: string
  normalizedName?: string // For matching
  role?: string
  roleType?: 'part-time' | 'fulltime' | 'contract' | 'consulting'
  startYear?: number
  endYear?: number
  isCurrent?: boolean
  achievements?: string[]
  teamSize?: number
  needsValidation: boolean
  confidence: number
}

export interface ExtractedQualification {
  type: 'degree' | 'certification' | 'course' | 'award'
  name: string
  institution?: string
  year?: number
  confidence: number
}

export interface ExtractedPreference {
  type: 'role' | 'location' | 'availability' | 'rate' | 'industry' | 'companyStage'
  value: string
  confidence: number
}

export interface ExtractionResult {
  skills: ExtractedSkill[]
  companies: ExtractedCompany[]
  qualifications: ExtractedQualification[]
  preferences: ExtractedPreference[]
  narrative?: string // Free-form career story
  suggestedFollowUps?: string[] // Questions to ask next
}

export interface PendingConfirmation {
  id: string
  type: 'skill' | 'company' | 'qualification' | 'preference'
  data: ExtractedSkill | ExtractedCompany | ExtractedQualification | ExtractedPreference
  sourceText: string
  confidence: number
  status: 'pending' | 'confirmed' | 'rejected' | 'edited'
}

export interface ExtractionSession {
  id: string
  userId: string
  transcript: string
  pendingItems: PendingConfirmation[]
  confirmedItems: PendingConfirmation[]
  status: 'active' | 'completed'
  startedAt: Date
}

// Skill depth mapping - when we detect a high-level skill, ask about specifics
export const SKILL_DEPTH_MAP: Record<string, { children: string[], questions: string[] }> = {
  'Python': {
    children: ['Python 3', 'Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch'],
    questions: ['Which Python frameworks do you use?', 'What version are you most familiar with?', 'Do you use it for web, data science, or automation?']
  },
  'JavaScript': {
    children: ['TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Next.js', 'Express'],
    questions: ['Do you use TypeScript?', 'Which frontend frameworks?', 'Any backend Node.js experience?']
  },
  'Finance': {
    children: ['Financial Modeling', 'M&A', 'Due Diligence', 'Fundraising', 'FP&A', 'Treasury', 'Tax'],
    questions: ['What areas of finance? M&A, fundraising, FP&A?', 'Any specific deal experience?']
  },
  'Marketing': {
    children: ['Digital Marketing', 'Brand Strategy', 'Growth Marketing', 'Content Marketing', 'SEO', 'Paid Media', 'Marketing Analytics'],
    questions: ['B2B or B2C marketing?', 'Which channels - paid, organic, content?', 'Any specific tools or platforms?']
  },
  'Leadership': {
    children: ['Team Building', 'Executive Leadership', 'Change Management', 'Board Experience', 'Stakeholder Management'],
    questions: ['What size teams have you led?', 'Any board-level experience?', 'Startup or enterprise leadership?']
  },
  'Data': {
    children: ['Data Analysis', 'Data Engineering', 'Business Intelligence', 'Data Visualization', 'SQL', 'Data Strategy'],
    questions: ['Analytics or engineering focus?', 'Which BI tools?', 'Data architecture experience?']
  }
}

// Role type normalization
export const PART_TIME_ROLES = [
  'Part-Time CFO',
  'Part-Time CMO',
  'Part-Time CTO',
  'Part-Time COO',
  'Part-Time CHRO',
  'Part-Time CPO',
  'Part-Time CRO',
  'Part-Time CEO',
  'Part-Time VP Finance',
  'Part-Time VP Marketing',
  'Part-Time VP Engineering',
  'Part-Time VP Sales',
  'Part-Time VP Operations',
  'Part-Time VP People',
  'Interim CFO',
  'Interim CMO',
  'Interim CTO',
  'Fractional CFO',
  'Fractional CMO',
  'Portfolio CFO',
  'Portfolio CMO'
]
