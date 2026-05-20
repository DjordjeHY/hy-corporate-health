'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Loader2, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { inviteAdmin, removeAdmin } from './actions'

export function InviteForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await inviteAdmin(fd)
      if ('error' in result) {
        setError(result.error)
      } else {
        setSuccess(`${email} added as an admin.`)
        setEmail('')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-start gap-2">
        <Input
          name="email"
          type="email"
          placeholder="colleague@yourself.health"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Invite
        </Button>
      </div>
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-400/40 bg-green-50 p-3 dark:border-green-800/40 dark:bg-green-950/20">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}
    </form>
  )
}

export function RemoveAdminButton({ id, email }: { id: string; email: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onRemove = () => {
    if (!confirm(`Remove ${email} from admins?`)) return
    const fd = new FormData()
    fd.set('id', id)
    startTransition(async () => {
      const result = await removeAdmin(fd)
      if ('error' in result) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={onRemove} disabled={pending} aria-label={`Remove ${email}`}>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  )
}
