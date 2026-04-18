import { CheckCircle, Clock, XCircle, AlertCircle, FileText, Code, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../utils/api'

export default function TrackerPage() {
  const { user } = useAuth()
  const [application, setApplication] = useState(null)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadApplication()
  }, [])

  const loadApplication = async () => {
    try {
      const app = await apiClient.getMyApplication()
      setApplication(app)
      
      // Load job details
      const jobDetails = await apiClient.getJobDetails(app.job_id)
      setJob(jobDetails)
    } catch (err) {
      setError('No applications found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading your application...</div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Status</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No applications submitted yet</p>
          <a href="/apply" className="inline-block px-6 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#1a73e8' }}>
            Apply Now
          </a>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'Rejected':
        return <XCircle className="w-6 h-6 text-red-600" />
      case 'Reviewing':
        return <Clock className="w-6 h-6 text-blue-600" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Status</h1>
      <p className="text-gray-600 mb-8">Track your progress through our hiring pipeline</p>

      {/* Application Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job?.title}</h2>
            <p className="text-gray-600 mt-2">{job?.jd_text}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Submission</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Resume</p>
                <a href={application.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  View Resume
                </a>
              </div>
            </div>

            {application.github_url && (
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">GitHub</p>
                  <a href={application.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {application.github_url}
                  </a>
                </div>
              </div>
            )}

            {application.linkedin_url && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">LinkedIn</p>
                  <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {application.linkedin_url}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-xs text-gray-500">
            Applied {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Status Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          {getStatusIcon(application.status)}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {application.status === 'Reviewing' && 'Your application is under review'}
              {application.status === 'Accepted' && 'Congratulations! You have been accepted'}
              {application.status === 'Rejected' && 'Your application has been rejected'}
              {application.status === 'Human_Escalation' && 'Your application requires further review'}
            </h3>
            <p className="text-gray-600 mt-2">
              {application.status === 'Reviewing' && 'We are evaluating your qualifications against the job requirements.'}
              {application.status === 'Accepted' && 'We are excited to move forward with your candidacy!'}
              {application.status === 'Rejected' && 'Unfortunately, we have decided to move forward with other candidates.'}
              {application.status === 'Human_Escalation' && 'Your application needs to be reviewed by our hiring team.'}
            </p>
          </div>
        </div>

        {/* Scores if available */}
        {(application.capability_score || application.verification_score) && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Scores</h4>
            <div className="grid grid-cols-2 gap-4">
              {application.capability_score && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Capability Score</p>
                  <p className="text-2xl font-bold text-blue-600">{application.capability_score.toFixed(1)}/100</p>
                </div>
              )}
              {application.verification_score && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Verification Score</p>
                  <p className="text-2xl font-bold text-green-600">{application.verification_score.toFixed(1)}/100</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="mt-8 text-center">
        <a href="/apply" className="inline-block px-6 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#1a73e8' }}>
          Apply for Other Positions
        </a>
      </div>
    </div>
  )
}
