import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function TrackerPage() {
  // Placeholder state - in real app, this would come from API
  const [candidateStatus] = useState('Rejected') // Can be 'Reviewing', 'Rejected', 'Blacklisted', 'Accepted'

  const timeline = [
    { step: 1, title: 'Application Submitted', status: 'completed' },
    { step: 2, title: 'Resume Screened', status: 'completed' },
    { step: 3, title: 'Technical Assessment', status: 'current' },
    { step: 4, title: 'Interview Round 1', status: 'pending' },
    { step: 5, title: 'Offer', status: 'pending' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Status</h1>
      <p className="text-gray-600 mb-8">Track your progress through our hiring pipeline</p>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="space-y-6">
          {timeline.map((item, idx) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    item.status === 'completed'
                      ? 'bg-green-500'
                      : item.status === 'current'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                  }`}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle size={20} />
                  ) : (
                    item.step
                  )}
                </div>
                {idx < timeline.length - 1 && (
                  <div
                    className={`w-1 h-12 mt-2 ${
                      item.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pt-2">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.status === 'completed'
                    ? 'Completed'
                    : item.status === 'current'
                      ? 'In Progress'
                      : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditional UI based on status */}
      {candidateStatus === 'Rejected' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">
                Defensible Decision Matrix
              </h3>
              <p className="text-sm text-amber-800 mb-4">
                Your application did not move forward at this stage. Here's why:
              </p>
              <div className="bg-white rounded-lg p-4 text-sm text-gray-700 space-y-2">
                <p>• Technical Skills Assessment: 45/100</p>
                <p>• Experience Match: 38/100</p>
                <p>• Cultural Fit: 62/100</p>
              </div>
            </div>
          </div>

          {/* Appeal Input */}
          <div className="mt-6 pt-6 border-t border-amber-200">
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">
                Appeal Decision
              </span>
              <textarea
                placeholder="Tell us why you'd like us to reconsider..."
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                rows="4"
                style={{ focusRingColor: '#1a73e8' }}
              />
            </label>
            <button
              className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:shadow-md"
              style={{ backgroundColor: '#1a73e8' }}
            >
              Submit Appeal
            </button>
          </div>
        </div>
      )}

      {candidateStatus === 'Blacklisted' && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex gap-3">
          <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-red-900 text-lg">
              High-Confidence Fraud Alert
            </h3>
            <p className="text-red-800 mt-2">
              We're unable to process applications from this profile at this time.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
