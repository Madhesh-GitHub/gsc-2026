export default function ApplyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Apply for a Position
        </h1>
        <p className="text-lg text-gray-600">
          Join our team. Upload your resume and share your professional profiles.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        {/* Placeholder form structure */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              Resume (PDF or Image)
            </span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#1a73e8' }}
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              GitHub Profile URL
            </span>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#1a73e8' }}
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              LinkedIn Profile URL
            </span>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#1a73e8' }}
            />
          </label>
        </div>

        <button
          className="w-full py-3 rounded-lg text-white font-medium transition-all hover:shadow-md"
          style={{ backgroundColor: '#1a73e8' }}
        >
          Submit Application
        </button>
      </div>
    </div>
  )
}
