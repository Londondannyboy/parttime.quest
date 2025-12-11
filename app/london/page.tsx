import { redirect } from 'next/navigation'

// Redirect /london to the canonical /fractional-jobs-london URL
export default function LondonRedirect() {
  redirect('/fractional-jobs-london')
}
