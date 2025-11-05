export interface ServicePackage {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
  parameters: string[];
  turnaroundDays: number;
  description: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  image?: string;
  rating: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'lab' | 'ngo' | 'institution' | 'energy';
}

export interface BookingFormData {
  packageId: string;
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  cropType: string;
  pickupType: 'pickup' | 'drop';
  address?: string;
  paymentMethod: string;
}

export interface Report {
  id: string;
  trackingId: string;
  farmerName: string;
  status: 'pending' | 'in_process' | 'completed';
  submittedDate: string;
  completedDate?: string;
  packageName: string;
  pdfUrl?: string;
  results?: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicCarbon: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'smart_farming' | 'sustainability' | 'energy' | 'policy';
  date: string;
  readTime: number;
  image: string;
  tags: string[];
}
