import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiClient from '../utils/api'
import { ChevronRight, AlertCircle } from 'lucide-react'

export default function ApplyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    resume_url: '',
    github_url: '',
    linkedin_url: '',
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const jobsList = await apiClient.listJobs()
      setJobs(jobsList)
      setLoading(false)
    } catch (err) {
      setError('Failed to load jobs')
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedJob) {
      setError('Please select a job')
      return
    }

    if (!formData.resume_url) {
      setError('Resume URL is required')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await apiClient.submitApplication({
        job_id: selectedJob,
        resume_url: formData.resume_url,
        github_url: formData.github_url || undefined,
        linkedin_url: formData.linkedin_url || undefined,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/tracker')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#1a73e8' }}
          >
            <span className="text-2xl text-white">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been successfully submitted. You'll be redirected to your tracker shortly.
          </p>
          <div className="text-sm text-gray-500">Redirecting...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Apply for a Position</h1>
        <p className="text-lg text-gray-600">
          Browse available positions and submit your application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Available Positions</h2>

            {jobs.length === 0 ? (
              <p className="text-gray-600 text-sm">No jobs available at this time</p>
            ) : (
              <div className="space-y-2">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedJob === job.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {selectedJob && (
              <>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    {jobs.find(j => j.id === selectedJob)?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {jobs.find(j => j.id === selectedJob)?.jd_text}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Resume URL */}
                  <div>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 block">
                        Resume URL (PDF or Google Drive Link) *
                      </span>
                      <input
                        type="url"
                        name="resume_url"
                        value={formData.resume_url}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/... or https://example.com/resume.pdf"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Provide a public link to your resume (PDF preferred)
                    </p>
                  </div>

                  {/* GitHub Profile */}
                  <div>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 block">
                        GitHub Profile URL
                      </span>
                      <input
                        type="url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Optional: Link your GitHub profile</p>
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 block">
                        LinkedIn Profile URL
                      </span>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Optional: Link your LinkedIn profile</p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
                      style={{
                        backgroundColor: submitting ? '#ccc' : '#1a73e8',
                        cursor: submitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                      {!submitting && <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </>
            )}

            {!selectedJob && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Select a position from the list to apply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
