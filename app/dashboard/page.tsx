import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Announcement } from '@/types/announcement'
import { logout } from './actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-full bg-gray-900 px-6 py-12 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <form action={logout}>
            <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500">
              Logout
            </button>
          </form>
        </div>
        
        <div className="mb-8 rounded-lg bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-2 text-white">User Information</h2>
          <p className="text-gray-300">Email: {user.email}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Announcements</h2>
          <div className="grid gap-4">
            {announcements?.map((announcement: Announcement) => (
              <div key={announcement.id} className="rounded-lg bg-white/5 p-4 border border-white/10">
                <h3 className="font-bold text-lg text-white">{announcement.title}</h3>
                <p className="text-gray-300 mt-2">{announcement.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(announcement.created_at || '').toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
