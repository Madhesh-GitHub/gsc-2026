import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../utils/api'
import { Plus, AlertCircle, CheckCircle } from 'lucide-react'

export default function HRPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('jobs') // 'jobs' or 'candidates'
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [jobForm, setJobForm] = useState({
    title: '',
    jd_text: '',
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'jobs') {
        const jobsList = await apiClient.listJobs()
        setJobs(jobsList)
      } else {
        const candidatesList = await apiClient.listCandidates()
        setCandidates(candidatesList)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleJobFormChange = (e) => {
    const { name, value } = e.target
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePostJob = async (e) => {
    e.preventDefault()

    if (!jobForm.title.trim()) {
      setError('Job title is required')
      return
    }

    if (!jobForm.jd_text.trim()) {
      setError('Job description is required')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newJob = await apiClient.createJob({
        title: jobForm.title,
        jd_text: jobForm.jd_text,
      })

      setJobs([newJob, ...jobs])
      setJobForm({ title: '', jd_text: '' })
      setShowJobForm(false)
      setSuccess('Job posted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'Human_Escalation':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Recruiter Dashboard</h1>
          {activeTab === 'jobs' && (
            <button
              onClick={() => setShowJobForm(!showJobForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: '#1a73e8' }}
            >
              <Plus className="w-5 h-5" />
              Post Job
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Postings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'candidates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Applications ({candidates.length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Job Form */}
        {showJobForm && activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-6">
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Job Title *</span>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Job Description *</span>
                  <textarea
                    name="jd_text"
                    value={jobForm.jd_text}
                    onChange={handleJobFormChange}
                    placeholder="Enter detailed job description, requirements, responsibilities..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg text-white font-medium transition-all"
                  style={{
                    backgroundColor: submitting ? '#ccc' : '#1a73e8',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false)
                    setJobForm({ title: '', jd_text: '' })
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : activeTab === 'jobs' ? (
          // Jobs List
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-600 mb-4">No job postings yet</p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: '#1a73e8' }}
                >
                  <Plus className="w-5 h-5" />
                  Create First Job
                </button>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-4">{job.jd_text}</p>
                  <p className="text-sm text-gray-500">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          // Candidates List
          <div className="space-y-4">
            {candidates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-600">No applications yet</p>
              </div>
            ) : (
              candidates.map(candidate => (
                <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Application #{candidate.id.slice(0, 8)}</h3>
                      <p className="text-gray-600 mt-1">Resume: {candidate.resume_url}</p>
                      {candidate.github_url && (
                        <p className="text-gray-600">GitHub: {candidate.github_url}</p>
                      )}
                      {candidate.linkedin_url && (
                        <p className="text-gray-600">LinkedIn: {candidate.linkedin_url}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Applied {new Date(candidate.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
