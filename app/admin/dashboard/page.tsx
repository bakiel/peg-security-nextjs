'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mail,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Users,
  Shield,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import Button from '@/components/admin/Button'

interface DashboardStats {
  totalJobs: number
  openJobs: number
  pendingApplications: number
  unreadMessages: number
  teamMembers: number
  activeServices: number
  galleryImages: number
}

interface ActivityItem {
  id: string
  type: 'application' | 'message' | 'job'
  message: string
  time: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    openJobs: 0,
    pendingApplications: 0,
    unreadMessages: 0,
    teamMembers: 0,
    activeServices: 0,
    galleryImages: 0
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel with individual error handling
      const [
        contactsRes,
        applicationsRes,
        jobsRes,
        galleryRes,
        teamRes,
        servicesRes
      ] = await Promise.all([
        fetch('/api/admin/contacts').catch(() => null),
        fetch('/api/admin/applications').catch(() => null),
        fetch('/api/admin/jobs').catch(() => null),
        fetch('/api/admin/gallery').catch(() => null),
        fetch('/api/admin/team').catch(() => null),
        fetch('/api/admin/services').catch(() => null)
      ])

      // Parse JSON with fallbacks for failed responses
      const contacts = contactsRes && contactsRes.ok ? await contactsRes.json().catch(() => ({ data: [] })) : { data: [] }
      const applications = applicationsRes && applicationsRes.ok ? await applicationsRes.json().catch(() => ({ data: [] })) : { data: [] }
      const jobs = jobsRes && jobsRes.ok ? await jobsRes.json().catch(() => ({ data: [] })) : { data: [] }
      const gallery = galleryRes && galleryRes.ok ? await galleryRes.json().catch(() => ({ data: [] })) : { data: [] }
      const team = teamRes && teamRes.ok ? await teamRes.json().catch(() => ({ data: [] })) : { data: [] }
      const services = servicesRes && servicesRes.ok ? await servicesRes.json().catch(() => ({ data: [] })) : { data: [] }

      // Calculate stats
      const unreadMessages = contacts.data?.filter((c: any) => c.Status === 'New').length || 0
      const pendingApplications = applications.data?.filter((a: any) =>
        a.Status === 'New' || a.Status === 'Reviewing'
      ).length || 0
      const totalJobs = jobs.data?.length || 0
      const openJobs = jobs.data?.filter((j: any) => j.Status === 'Open').length || 0
      const galleryImages = gallery.data?.length || 0
      const teamMembers = team.data?.filter((t: any) => t.status === 'Active').length || 0
      const activeServices = services.data?.filter((s: any) => s.status === 'Active').length || 0

      setStats({
        totalJobs,
        openJobs,
        pendingApplications,
        unreadMessages,
        teamMembers,
        activeServices,
        galleryImages
      })

      // Build recent activity
      const activity: ActivityItem[] = []

      // Add recent contacts
      if (contacts.data && contacts.data.length > 0) {
        contacts.data.slice(0, 2).forEach((contact: any) => {
          activity.push({
            id: contact.id,
            type: 'message',
            message: `Contact form submission from ${contact.Name}`,
            time: formatTimeAgo(contact['Submitted At'] || contact.created_at)
          })
        })
      }

      // Add recent applications
      if (applications.data && applications.data.length > 0) {
        applications.data.slice(0, 2).forEach((app: any) => {
          activity.push({
            id: app.id,
            type: 'application',
            message: `New application for ${app['Job Title']} from ${app['Applicant Name']}`,
            time: formatTimeAgo(app['Submitted At'] || app.created_at)
          })
        })
      }

      // Add recent jobs
      if (jobs.data && jobs.data.length > 0) {
        jobs.data.slice(0, 2).forEach((job: any) => {
          activity.push({
            id: job.id,
            type: 'job',
            message: `Job posted: ${job.Title}`,
            time: formatTimeAgo(job['Created At'])
          })
        })
      }

      // Sort by time (most recent first) and limit to 6
      setRecentActivity(activity.slice(0, 6))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-sans font-bold text-onyx mb-2">Dashboard</h1>
        <p className="text-grey-medium font-sans">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={Clock}
          href="/admin/applications"
          gradient="from-gold to-gold-dark"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={Mail}
          href="/admin/messages"
          gradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Open Jobs"
          value={stats.openJobs}
          icon={Briefcase}
          href="/admin/jobs"
          gradient="from-green-500 to-green-600"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          href="/admin/team"
          gradient="from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Active Services"
          value={stats.activeServices}
          icon={Shield}
          href="/admin/services"
          gradient="from-amber-500 to-amber-600"
        />
        <StatsCard
          title="Gallery Images"
          value={stats.galleryImages}
          icon={ImageIcon}
          href="/admin/gallery"
          gradient="from-pink-500 to-pink-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-sans font-bold text-onyx mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-grey-medium font-sans text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-offwhite rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'application' ? 'from-gold to-gold-dark' :
                      activity.type === 'message' ? 'from-blue-500 to-blue-600' :
                      'from-green-500 to-green-600'
                    }`}>
                      {activity.type === 'application' && <FileText size={20} className="text-white" />}
                      {activity.type === 'message' && <Mail size={20} className="text-white" />}
                      {activity.type === 'job' && <Briefcase size={20} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-onyx font-sans font-semibold">{activity.message}</p>
                      <p className="text-grey-medium text-sm mt-1 font-sans">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-sans font-bold text-onyx mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/jobs/new">
                <Button variant="primary" size="md" className="w-full justify-start">
                  <Plus size={18} />
                  Create New Job
                </Button>
              </Link>
              <Link href="/admin/team/new">
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <Plus size={18} />
                  Add Team Member
                </Button>
              </Link>
              <Link href="/admin/services/new">
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <Plus size={18} />
                  Add Service
                </Button>
              </Link>
              <Link href="/admin/applications">
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <CheckCircle size={18} />
                  Review Applications
                </Button>
              </Link>
              <Link href="/admin/messages">
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <Mail size={18} />
                  View Messages
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <ImageIcon size={18} />
                  Manage Gallery
                </Button>
              </Link>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-sans font-bold text-onyx mb-4">System Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-sans text-grey-medium">Total Jobs</span>
                <span className="text-sm font-sans font-bold text-onyx">{stats.totalJobs}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-sans text-grey-medium">Team Size</span>
                <span className="text-sm font-sans font-bold text-onyx">{stats.teamMembers}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-sans text-grey-medium">Active Services</span>
                <span className="text-sm font-sans font-bold text-onyx">{stats.activeServices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans text-grey-medium">Gallery Items</span>
                <span className="text-sm font-sans font-bold text-onyx">{stats.galleryImages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
