import { FileText, RefreshCw, Shield } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

const Legal = ({ type }: LegalPageProps) => {
  const { navigateTo } = useNavigation();

  const content = {
    privacy: {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your data',
      sections: [
        {
          title: 'Information We Collect',
          content:
            'We collect basic personal details such as name, phone, email, and location when you register or book services. We also store soil test and booking data needed for service delivery.',
        },
        {
          title: 'How We Use Information',
          content:
            'Your information is used to process bookings, deliver reports, provide support, and improve product quality. Aggregated and anonymized data may be used for agricultural research.',
        },
        {
          title: 'Data Security',
          content:
            'We apply standard security practices for data in transit and at rest. Access to sensitive information is restricted to authorized systems and personnel.',
        },
        {
          title: 'Third-Party Sharing',
          content:
            'Relevant booking and sample data may be shared with certified partner labs for testing workflows. We do not sell personal data.',
        },
        {
          title: 'Your Rights',
          content:
            'You may request correction or deletion of your personal information by contacting support@farmhith.in.',
        },
      ],
    },
    terms: {
      icon: FileText,
      title: 'Terms of Service',
      subtitle: 'Rules and responsibilities for using FarmHith',
      sections: [
        {
          title: 'Service Scope',
          content:
            'FarmHith provides a platform for soil testing workflows, report access, advisory support, and crop residue marketplace interactions through partner networks.',
        },
        {
          title: 'User Responsibilities',
          content:
            'Users must provide accurate booking details and follow sampling guidelines. Payments must be completed according to the selected payment option.',
        },
        {
          title: 'Service Timelines',
          content:
            'We target stated turnaround timelines, but delays can occur due to logistics or external dependencies. Material delays are communicated through available channels.',
        },
        {
          title: 'Advisory and Outcomes',
          content:
            'Recommendations are intended as guidance based on sample quality and reported data. Final farming decisions remain with the user.',
        },
        {
          title: 'Liability',
          content:
            'FarmHith liability is limited to applicable service fees. We are not responsible for indirect losses resulting from external factors or field conditions.',
        },
      ],
    },
    refund: {
      icon: RefreshCw,
      title: 'Refund and Cancellation Policy',
      subtitle: 'How cancellations and refunds are handled',
      sections: [
        {
          title: 'Before Sample Collection',
          content:
            'Bookings can be cancelled up to 24 hours before scheduled sample pickup for a full refund. Late cancellations may include processing deductions.',
        },
        {
          title: 'After Sample Collection',
          content:
            'Once a sample is collected or submitted at a center, cancellation may not be possible because analysis workflows begin immediately.',
        },
        {
          title: 'Service Failure Refunds',
          content:
            'If committed timelines are missed without valid reason, eligible cases may receive refunds or free reprocessing after review.',
        },
        {
          title: 'Refund Timelines',
          content:
            'Approved refunds are generally processed within 7 to 10 working days to the original payment source where possible.',
        },
        {
          title: 'Dispute Resolution',
          content:
            'For refund concerns, contact support@farmhith.in with your tracking ID and booking details for investigation.',
        },
      ],
    },
  };

  const currentContent = content[type];
  const Icon = currentContent.icon;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-8%] left-[-8%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-9%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto">
            <Icon size={24} />
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-display text-slate-900">{currentContent.title}</h1>
          <p className="mt-3 text-slate-600">{currentContent.subtitle}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-5 mb-5">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Last Updated:</span> November 4, 2025
            </p>
          </div>

          <div className="space-y-4">
            {currentContent.sections.map((section) => (
              <div key={section.title} className="card-hover surface-3d p-5">
                <h2 className="text-2xl">{section.title}</h2>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 card-hover surface-3d p-6">
            <h3 className="text-xl">Questions about this policy?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Reach our support team for clarification or policy-related requests.
            </p>
            <div className="mt-4 space-y-1 text-sm text-slate-700">
              <p>Email: support@farmhith.in</p>
              <p>Phone: +91 1234567890</p>
              <p>Address: Panipat, Haryana, India</p>
            </div>
            <button onClick={() => navigateTo('contact')} className="btn-primary mt-5">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;
