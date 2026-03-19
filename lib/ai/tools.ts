import { tool } from 'ai'
import { z } from 'zod'

type costEstimateResult = {
  origin_city: string
  destination_city: string
  currency: string
  summary_total: number
  confidence: 'low' | 'medium' | 'high'
  breakdown: {
    [key: string]: { amount: number; note: string }
  }
}

type timelineGenerateResult = {
  destination_country: string
  target_move_date: string
  milestones: Array<{
    date: string
    title: string
    category: string
    is_critical: boolean
    notes: string
  }>
}

export const estimateCostTool = tool({
  description: `Estimate the full cost breakdown for an international relocation.
    Only call this when you have: origin city, destination city, and family size.
    Do NOT call speculatively — wait for the user to provide the required inputs.`,
  inputSchema: z.object({
    origin_city: z.string().describe('City and country e.g. "London, UK"'),
    destination_city: z.string().describe('City and country e.g. "Berlin, Germany"'),
    family_size: z.number().int().min(1).max(10).describe('Number of people relocating'),
    housing_preference: z
      .enum(['budget', 'mid', 'premium'])
      .describe('Housing budget tier'),
    shipping_volume: z
      .enum(['minimal', 'partial', 'full_household'])
      .describe('How much furniture/belongings to ship'),
    has_pets: z.boolean().describe('Whether pets are included in the move'),
  }),
  execute: async ({ origin_city, destination_city, family_size, housing_preference }) => {
    // Placeholder logic
    
    const base = housing_preference === 'premium' ? 15000 : housing_preference === 'mid' ? 9000 : 5000
    const perPerson = 1200
    const result: costEstimateResult = {
      origin_city,
      destination_city,
      currency: 'USD',
      summary_total: base + perPerson * family_size,
      confidence:  'medium' as const,
      breakdown: {
        visa_and_legal:    { amount: 800  + family_size * 200, note: 'Varies by nationality' },
        international_shipping: { amount: 1500 + (housing_preference === 'mid' ? 3000 : 0), note: 'Sea freight estimate' },
        temporary_housing: { amount: 2000, note: '2–4 weeks on arrival' },
        first_month_rent:  { amount: housing_preference === 'premium' ? 4000 : housing_preference === 'mid' ? 2200 : 1200, note: 'Deposit + first month' },
        flights:           { amount: 800  * family_size, note: 'Economy, one-way' },
        misc_buffer:       { amount: 1500, note: '10% contingency recommended' },
      },
    }

    return result
  },
})


export const generateTimelineTool = tool({
  description: `Generate a step-by-step relocation timeline with milestones and deadlines.
    Call this when the user has a destination country and a target move date.`,
  inputSchema: z.object({
    origin_country: z.string().describe('Country moving from'),
    destination_country: z.string().describe('Country moving to'),
    target_move_date: z.string().describe('ISO date string e.g. "2026-09-01"'),
    has_employer_sponsorship: z.boolean().describe('Whether employer is handling visa'),
    family_size: z.number().int().min(1),
  }),
  execute: async ({ destination_country, target_move_date, has_employer_sponsorship }) => {
    const moveDate = new Date(target_move_date)
    const offset = (months: number) => {
      const d = new Date(moveDate)
      d.setMonth(d.getMonth() - months)
      return d.toISOString().split('T')[0]
    }
    const result: timelineGenerateResult = {
      destination_country,
      target_move_date,
      milestones: [
        {
          date: offset(6),
          title: 'Start visa research',
          category: 'visa' as const,
          is_critical: true,
          notes: has_employer_sponsorship
            ? 'Confirm sponsorship paperwork timeline with HR'
            : 'Research visa options: skilled worker, freelance, or digital nomad',
        },
        {
          date: offset(5),
          title: 'Gather documents',
          category: 'admin' as const,
          is_critical: true,
          notes: 'Birth certificates, marriage certificate, degree transcripts, police clearance',
        },
        {
          date: offset(4),
          title: 'Submit visa application',
          category: 'visa' as const,
          is_critical: true,
          notes: 'Allow 8–12 weeks processing time for most countries',
        },
        {
          date: offset(3),
          title: 'Give notice on current home',
          category: 'housing' as const,
          is_critical: true,
          notes: 'Check lease terms — most require 1–3 months notice',
        },
        {
          date: offset(2),
          title: 'Book international shipping',
          category: 'logistics' as const,
          is_critical: false,
          notes: 'Sea freight takes 4–8 weeks. Get 3 quotes.',
        },
        {
          date: offset(2),
          title: 'Book temporary housing at destination',
          category: 'housing' as const,
          is_critical: true,
          notes: 'Book 4–6 weeks of short-term rental while finding permanent home',
        },
        {
          date: offset(1),
          title: 'Book flights',
          category: 'logistics' as const,
          is_critical: false,
          notes: 'One-way tickets. Check baggage allowance for the move.',
        },
        {
          date: offset(1),
          title: 'Notify banks, subscriptions, HMRC/IRS',
          category: 'admin' as const,
          is_critical: false,
          notes: 'Update address, set up mail forwarding, close accounts you won\'t need',
        },
        {
          date: target_move_date,
          title: 'Move day',
          category: 'logistics' as const,
          is_critical: true,
          notes: 'Confirm shipping pickup, check in for flights, hand over keys',
        },
        {
          date: (() => { const d = new Date(moveDate); d.setMonth(d.getMonth() + 1); return d.toISOString().split('T')[0] })(),
          title: 'Register at destination',
          category: 'admin' as const,
          is_critical: true,
          notes: `Register address with local authorities in ${destination_country}. Open local bank account.`,
        },
      ],
    }

    return result
  },
})

export const tools = {
  estimate_relocation_cost: estimateCostTool,
  generate_timeline: generateTimelineTool,
}