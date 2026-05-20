import { createClient } from '@/lib/supabase/server'
import { InviteForm, RemoveAdminButton } from './client'

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const myEmail = user?.email?.toLowerCase() ?? ''

  const { data: admins } = await supabase
    .from('admin_users')
    .select('id, email, invited_at, invited_by')
    .order('invited_at', { ascending: true })

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Admins
          </p>
          <h1 className="text-2xl font-bold">Back-office access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Anyone listed here can sign in at <span className="font-medium text-foreground">/admin</span>. Only @yourself.health emails are accepted.
          </p>
        </div>

        <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="text-base font-semibold">Invite an admin</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            They&apos;ll need to sign in at <span className="font-medium text-foreground">/admin/login</span> with this email. No invite email is sent automatically yet.
          </p>
          <div className="mt-4">
            <InviteForm />
          </div>
        </section>

        <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="text-base font-semibold">Current admins</h2>
          <div className="mt-4 overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_80px] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Email</span>
              <span>Invited</span>
              <span>By</span>
              <span className="text-right"></span>
            </div>
            <div className="divide-y">
              {(admins ?? []).map((a) => {
                const isMe = a.email.toLowerCase() === myEmail
                return (
                  <div
                    key={a.id}
                    className="grid grid-cols-[1.5fr_1fr_1fr_80px] items-center gap-3 px-4 py-2.5"
                  >
                    <div>
                      <span className="text-sm">{a.email}</span>
                      {isMe && (
                        <span className="ml-2 rounded-4xl bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(a.invited_at)}</span>
                    <span className="text-sm text-muted-foreground">{a.invited_by ?? '—'}</span>
                    <div className="text-right">
                      {!isMe && <RemoveAdminButton id={a.id} email={a.email} />}
                    </div>
                  </div>
                )
              })}
              {(!admins || admins.length === 0) && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No admins yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
