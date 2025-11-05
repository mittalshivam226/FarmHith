import { Shield, FileText, RefreshCw } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

const Legal: React.FC<LegalPageProps> = ({ type }) => {
  const { navigateTo } = useNavigation();

  const content = {
    privacy: {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'गोपनीयता नीति',
      sections: [
        {
          title: 'Information We Collect',
          content: 'We collect personal information (name, contact details, location) when you book soil tests or register on our platform. We also collect soil sample data and test results for service delivery and agricultural research.',
        },
        {
          title: 'How We Use Your Information',
          content: 'Your data is used to process soil tests, deliver reports, improve our services, and communicate important updates. We may use aggregated, anonymized data for research to advance sustainable agriculture.',
        },
        {
          title: 'Data Security',
          content: 'We employ industry-standard security measures to protect your personal information. All sensitive data is encrypted during transmission and storage.',
        },
        {
          title: 'Third-Party Sharing',
          content: 'We share necessary information with partner laboratories for soil analysis. We never sell your personal data. Lab partners are contractually bound to maintain confidentiality.',
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access, correct, or delete your personal data. Contact us at support@farmhith.in to exercise these rights.',
        },
      ],
    },
    terms: {
      icon: FileText,
      title: 'Terms of Service',
      subtitle: 'सेवा की शर्तें',
      sections: [
        {
          title: 'Service Agreement',
          content: 'By using Farmहित platform, you agree to these terms. We provide soil testing services through certified partner laboratories and offer advisory services based on test results.',
        },
        {
          title: 'User Responsibilities',
          content: 'You must provide accurate information when booking tests. You are responsible for proper soil sample collection as per our guidelines. Payment must be completed before or upon sample collection as per chosen method.',
        },
        {
          title: 'Service Delivery',
          content: 'We aim to deliver reports within the specified turnaround time. Delays may occur due to unforeseen circumstances. We will notify you of any significant delays.',
        },
        {
          title: 'Accuracy of Results',
          content: 'Test results depend on sample quality and proper collection. While we use certified labs, we cannot guarantee specific crop outcomes based on recommendations. Results are advisory in nature.',
        },
        {
          title: 'Limitation of Liability',
          content: 'Farmहित is not liable for crop failures, financial losses, or consequential damages arising from use of our services or recommendations. Our liability is limited to the service fee paid.',
        },
        {
          title: 'Intellectual Property',
          content: 'All content, reports, and recommendations provided through our platform are for your personal agricultural use only and may not be reproduced or distributed without permission.',
        },
      ],
    },
    refund: {
      icon: RefreshCw,
      title: 'Refund & Cancellation Policy',
      subtitle: 'रिफंड और रद्दीकरण नीति',
      sections: [
        {
          title: 'Cancellation Before Sample Collection',
          content: 'You may cancel your booking up to 24 hours before scheduled sample pickup for a full refund. Cancellations within 24 hours will incur a 20% processing fee.',
        },
        {
          title: 'Cancellation After Sample Collection',
          content: 'Once the soil sample has been collected or dropped at a center, the booking cannot be cancelled as analysis begins immediately.',
        },
        {
          title: 'Refund for Service Failure',
          content: 'If we fail to deliver your report within 14 days of sample receipt (without valid reason), you are eligible for a full refund. If test results are significantly erroneous due to lab error, we will retest free of charge.',
        },
        {
          title: 'Refund Process',
          content: 'Approved refunds are processed within 7-10 working days to the original payment method. For cash payments, refunds are issued via bank transfer (bank details required).',
        },
        {
          title: 'Non-Refundable Situations',
          content: 'Refunds are not provided for: Improper soil sample collection by user resulting in invalid results; User-side delays in providing information or sample access; Change of mind after sample collection; Dissatisfaction with advisory recommendations (these are subjective).',
        },
        {
          title: 'Dispute Resolution',
          content: 'For refund disputes, contact support@farmhith.in with your tracking ID. We aim to resolve all disputes within 7 working days through fair investigation.',
        },
      ],
    },
  };

  const currentContent = content[type];
  const Icon = currentContent.icon;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">{currentContent.title}</h1>
            <p className="text-xl text-green-100">{currentContent.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-12">
            <p className="text-gray-700">
              <strong>Last Updated:</strong> November 4, 2025
            </p>
          </div>

          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Questions or Concerns?</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about this {type === 'privacy' ? 'Privacy Policy' : type === 'terms' ? 'Terms of Service' : 'Refund Policy'}, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> support@farmhith.in</p>
              <p><strong>Phone:</strong> +91 1234567890</p>
              <p><strong>Address:</strong> Panipat, Haryana, India - 132103</p>
            </div>
            <button
              onClick={() => navigateTo('contact')}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;
