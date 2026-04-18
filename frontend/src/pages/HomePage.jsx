import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Equitable AI for Hiring
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Remove bias from recruitment with our AI-powered Applicant Tracking System.
          Fair, transparent, and defensible decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/apply"
            className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:shadow-lg"
            style={{ backgroundColor: '#1a73e8' }}
          >
            Start Your Application
          </Link>
          <Link
            to="/demo"
            className="px-8 py-4 rounded-lg border-2 font-medium text-lg transition-all hover:bg-gray-50"
            style={{ borderColor: '#1a73e8', color: '#1a73e8' }}
          >
            See the Difference
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Equitable ATS?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bias-Free Evaluation',
                description:
                  'AI-powered semantic matching removes keyword bias and prestige filtering.',
              },
              {
                title: 'Transparent Process',
                description:
                  'Every decision is defensible with clear scoring matrices and audit logs.',
              },
              {
                title: 'Better Outcomes',
                description:
                  'Diverse hiring pools lead to stronger teams and better business results.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#1a73e8' }}
                >
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to apply?</h2>
        <p className="text-gray-600 mb-8">
          Join our growing community of equitable organizations.
        </p>
        <Link
          to="/apply"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:shadow-lg"
          style={{ backgroundColor: '#1a73e8' }}
        >
          Apply Now <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  )
}
