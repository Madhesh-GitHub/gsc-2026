import { useState } from 'react'

export default function DemoPage() {
  const [showTraditional, setShowTraditional] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          A/B Bias Prover
        </h1>
        <p className="text-center text-gray-600 mb-12">
          See how equitable AI transforms candidate evaluation
        </p>

        {/* Massive Toggle Button */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 inline-flex border-2" style={{ borderColor: '#1a73e8' }}>
            <button
              onClick={() => setShowTraditional(true)}
              className={`px-8 py-4 rounded-full font-bold transition-all text-lg ${
                showTraditional
                  ? 'text-white'
                  : 'text-gray-700 bg-gray-100'
              }`}
              style={showTraditional ? { backgroundColor: '#1a73e8' } : {}}
            >
              Traditional ATS
            </button>
            <button
              onClick={() => setShowTraditional(false)}
              className={`px-8 py-4 rounded-full font-bold transition-all text-lg ${
                !showTraditional
                  ? 'text-white'
                  : 'text-gray-700 bg-gray-100'
              }`}
              style={!showTraditional ? { backgroundColor: '#1a73e8' } : {}}
            >
              Equitable MAS
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional ATS Side */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Traditional ATS</h2>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Issue:</strong> Keyword matching bias
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Filters candidates based on exact keyword matches, overlooking qualified candidates with different terminology.
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Issue:</strong> School prestige bias
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Prioritizes candidates from top universities, potentially filtering out equally capable candidates.
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Issue:</strong> Employment gap bias
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Penalizes candidates with career breaks without understanding circumstances.
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Result:</strong> 34% diversity drop-off
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Systematic filtering leads to less diverse candidate pools.
                </p>
              </div>
            </div>
          </div>

          {/* Equitable MAS Side */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Equitable MAS</h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>✓ Solution:</strong> Semantic skill matching
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  AI understands equivalent skills and technologies across different contexts.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>✓ Solution:</strong> Capability assessment
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Evaluates demonstrated capabilities regardless of educational background.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>✓ Solution:</strong> Context-aware evaluation
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Understands career contexts and prioritizes skill growth over continuous employment.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>✓ Result:</strong> 89% diversity increase
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Fair evaluation practices expand candidate diversity significantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        {showTraditional && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Traditional ATS Deep Dive</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Dimension
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Methodology
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Bias Risk
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Keyword Matching</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Exact string matching
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">High</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">School Ranking</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Prestige-based filtering
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!showTraditional && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Equitable MAS Deep Dive</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Dimension
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Methodology
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Bias Mitigation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Semantic Matching</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Embeddings + context understanding
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      Excellent
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Capability First</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Demonstrated skills evaluation
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      Excellent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
