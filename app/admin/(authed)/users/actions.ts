'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type Result = { error: string } | { success: true }

function isYourselfHealthEmail(email: string): boolean {
  return /@yourself\.health$/i.test(email.trim())
}

export async function inviteAdmin(formData: FormData): Promise<Result> {
  const rawEmail = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!rawEmail) return { error: 'Email is required.' }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(rawEmail)) return { error: 'That doesn’t look like a valid email.' }
  if (!isYourselfHealthEmail(rawEmail))
    return { error: 'Admin emails must end in @yourself.health.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const invitedBy = user?.email ?? null

  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .ilike('email', rawEmail)
    .maybeSingle()
  if (existing) return { error: 'That email is already an admin.' }

  const { error } = await supabase.from('admin_users').insert({
    email: rawEmail,
    invited_by: invitedBy,
  })
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function removeAdmin(formData: FormData): Promise<Result> {
  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Missing admin id.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'You must be signed in.' }

  // Prevent removing yourself
  const { data: target } = await supabase
    .from('admin_users')
    .select('email')
    .eq('id', id)
    .maybeSingle()
  if (!target) return { error: 'Admin not found.' }
  if (target.email.toLowerCase() === user.email.toLowerCase())
    return { error: 'You can’t remove yourself.' }

  const { error } = await supabase.from('admin_users').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
