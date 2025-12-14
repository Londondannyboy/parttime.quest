import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { z } from 'zod'

const sql = neon(process.env.DATABASE_URL!)

// Validation schemas
const candidateSchema = z.object({
  type: z.literal('candidate'),
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  currentRole: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().default(false),
})

const companySchema = z.object({
  type: z.literal('company'),
  companyName: z.string().min(2, 'Company name is required'),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  jobDescription: z.string().min(20, 'Please provide more detail'),
  scheduleCall: z.boolean().default(false),
})

const contactSchema = z.discriminatedUnion('type', [candidateSchema, companySchema])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Store in database
    if (data.type === 'candidate') {
      await sql`
        INSERT INTO contact_submissions (
          submission_type,
          full_name,
          email,
          user_role,
          linkedin_url,
          phone,
          message,
          newsletter_opt_in,
          site,
          created_at
        ) VALUES (
          'candidate',
          ${data.fullName},
          ${data.email},
          ${data.currentRole || null},
          ${data.linkedIn || null},
          ${data.phone || null},
          ${data.message},
          ${data.newsletter},
          'part-time',
          NOW()
        )
      `
    } else {
      await sql`
        INSERT INTO contact_submissions (
          submission_type,
          company_name,
          company_website,
          full_name,
          email,
          job_title,
          message,
          schedule_call,
          site,
          created_at
        ) VALUES (
          'company',
          ${data.companyName},
          ${data.companyWebsite || null},
          ${data.contactName},
          ${data.email},
          ${data.jobTitle},
          ${data.jobDescription},
          ${data.scheduleCall},
          'part-time',
          NOW()
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: data.type === 'candidate'
        ? 'Thanks for reaching out! We\'ll be in touch within 24 hours.'
        : 'Thanks for your submission! Our team will contact you about posting options.'
    })

  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form', details: String(error) },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Contact Form Submissions',
    accepts: ['candidate', 'company'],
  })
}
