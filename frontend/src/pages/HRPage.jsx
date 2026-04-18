import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function HRPage() {
  const [expandedJson, setExpandedJson] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Recruiter Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Pane - Action Buckets */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Action Buckets</h2>

            {/* Priority Verified Bucket */}
            <div className="mb-6">
              <div
                className="px-4 py-3 rounded-lg text-white font-medium mb-3"
                style={{ backgroundColor: '#1a73e8' }}
              >
                Priority Verified
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-gray-900">Alice Johnson</p>
                  <p className="text-sm text-gray-600">Senior Engineer</p>
                </div>
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-gray-900">Bob Chen</p>
                  <p className="text-sm text-gray-600">Product Manager</p>
                </div>
              </div>
            </div>

            {/* High Capability / Unverified Bucket */}
            <div>
              <div className="px-4 py-3 rounded-lg text-white font-medium mb-3 bg-orange-500">
                High Capability / Unverified
              </div>
              <div className="space-y-2">
                <div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
                  <p className="font-medium text-gray-900">Carol Martinez</p>
                  <p className="text-sm text-gray-600">Data Scientist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Metrics & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Twin Dials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Score Dials</h2>
            <div className="grid grid-cols-2 gap-8">
              {/* Capability Dial */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center bg-green-50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">78</div>
                    <p className="text-xs text-gray-600 mt-1">Capability</p>
                  </div>
                </div>
              </div>

              {/* Verification Dial */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full border-8 border-purple-500 flex items-center justify-center bg-purple-50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">92</div>
                    <p className="text-xs text-gray-600 mt-1">Verification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">AI Summary (Gemini)</h3>
            <p className="text-gray-700 leading-relaxed">
              Alice brings 8 years of backend engineering expertise with proven success
              in scalable systems. GitHub shows consistent contributions and strong open-source involvement.
            </p>
          </div>

          {/* JSON Viewer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedJson(!expandedJson)}
              className="w-full px-6 py-4 font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronDown
                size={20}
                className={`transition-transform ${expandedJson ? 'rotate-180' : ''}`}
              />
              Decision Matrix & GitHub Forensics
            </button>
            {expandedJson && (
              <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50 font-mono text-xs overflow-auto max-h-64">
                <pre className="text-gray-700">
                  {JSON.stringify(
                    {
                      decisionMatrix: {
                        technicalScore: 85,
                        experienceScore: 78,
                        cultureFit: 88,
                      },
                      githubForensics: {
                        commits: 1240,
                        repositories: 34,
                        stars: 156,
                        followers: 42,
                        topLanguages: ['JavaScript', 'Python', 'Go'],
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
