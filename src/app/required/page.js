"use client"
import { useAuth } from '../context/authContext'
import { useRouter, useSearchParams } from 'next/navigation'

const featureMessages = {
  ai_access: {
    title: "AI Access Required",
    description: "To use our AI diagnostic tools, you need to either:"
  },
  medical_access: {
    title: "Premium Subscription Required",
    description: "Upgrade to access 24/7 medical assistance"
  },
  faq_access: {
    title: "Premium Content",
    description: "Subscribe to access exclusive health resources"
  }
}

export default function RequiredPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const reason = params.get('reason') || 'generic'

  const getContent = () => {
    if (!user) return null
    
    return {
      ...featureMessages[reason],
      options: user.patient_type === 'external' ? [
        {
          title: "Book Appointment",
          description: "Schedule consultation with our specialists",
          action: () => router.push('/appointments')
        },
        {
          title: "Purchase Instant Access",
          description: "Get immediate AI access with subscription",
          action: () => router.push('/Upgrade')
        }
      ] : [
        {
          title: "Upgrade to Premium",
          description: "Unlock all features with our premium plan",
          action: () => router.push('/Upgrade')
        }
      ]
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
        <p className="text-gray-600 mb-8">{content.description}</p>
        
        <div className="space-y-6">
          {content.options.map((option, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-500 mb-4">{option.description}</p>
              <button
                onClick={option.action}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Option
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}