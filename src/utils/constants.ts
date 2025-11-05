import { ServicePackage, Testimonial, Partner, BlogPost } from '../types';

export const COLORS = {
  primary: '#3B873E',
  secondary: '#E0A800',
  accent: '#2B2B2B',
  background: '#F5F7F2',
  ctaButton: '#2C5F2D',
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
};

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Basic Soil Test',
    nameHindi: 'बेसिक मिट्टी परीक्षण',
    price: 299,
    parameters: ['pH Level', 'Electrical Conductivity', 'NPK (Nitrogen, Phosphorus, Potassium)'],
    turnaroundDays: 5,
    description: 'Essential soil health parameters for informed farming decisions',
  },
  {
    id: 'advanced',
    name: 'Advanced Soil Test',
    nameHindi: 'एडवांस्ड मिट्टी परीक्षण',
    price: 599,
    parameters: ['All Basic Parameters', 'Organic Carbon', 'Micronutrients (Zn, Fe, Cu, Mn)', 'Sulfur'],
    turnaroundDays: 7,
    description: 'Comprehensive analysis for optimal crop nutrition planning',
    popular: true,
  },
  {
    id: 'crop_specific',
    name: 'Crop-Specific Test',
    nameHindi: 'फसल-विशिष्ट परीक्षण',
    price: 799,
    parameters: ['All Advanced Parameters', 'Boron', 'Molybdenum', 'Customized Recommendations', 'Fertilizer Planning'],
    turnaroundDays: 10,
    description: 'Tailored testing with expert recommendations for your specific crop',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'राजेश कुमार',
    location: 'पानीपत, हरियाणा',
    text: 'Farmहित की सॉइल टेस्टिंग से मेरी गेहूं की पैदावार में 25% की बढ़ोतरी हुई। सटीक रिपोर्ट और आसान प्रक्रिया।',
    rating: 5,
  },
  {
    id: '2',
    name: 'Suresh Patil',
    location: 'Nashik, Maharashtra',
    text: 'The detailed NPK analysis helped me save ₹8,000 on unnecessary fertilizers. Great service!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Gurpreet Singh',
    location: 'Ludhiana, Punjab',
    text: 'Residue sell feature is revolutionary. I earned ₹12,000 from paddy stubble that I used to burn.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    location: 'Guntur, Andhra Pradesh',
    text: 'Simple mobile booking and fast reports. Even my 60-year-old father can use this platform.',
    rating: 4,
  },
];

export const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'SRM University',
    logo: '/partners/srm.png',
    type: 'institution',
  },
  {
    id: '2',
    name: 'PANI Institute',
    logo: '/partners/pani.png',
    type: 'institution',
  },
  {
    id: '3',
    name: 'Green Energy Labs',
    logo: '/partners/green-energy.png',
    type: 'energy',
  },
  {
    id: '4',
    name: 'Soil Health NGO',
    logo: '/partners/soil-health.png',
    type: 'ngo',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding NPK Ratios for Different Crops',
    excerpt: 'Learn how to read your soil test report and apply the right fertilizers for maximum yield.',
    category: 'smart_farming',
    date: '2025-10-15',
    readTime: 5,
    image: '/blog/npk-guide.jpg',
    tags: ['NPK', 'Fertilizers', 'Soil Health'],
  },
  {
    id: '2',
    title: 'Turning Crop Residue into Income: A Complete Guide',
    excerpt: 'Stop burning stubble and start earning. How biopellet plants are changing agricultural waste management.',
    category: 'sustainability',
    date: '2025-10-20',
    readTime: 8,
    image: '/blog/residue-income.jpg',
    tags: ['Residue Management', 'Biopellets', 'Income'],
  },
  {
    id: '3',
    title: 'pH Levels and Crop Performance: The Hidden Connection',
    excerpt: 'Why soil pH matters more than you think and how to correct acidic or alkaline soils.',
    category: 'smart_farming',
    date: '2025-10-25',
    readTime: 6,
    image: '/blog/ph-levels.jpg',
    tags: ['pH', 'Soil Science', 'Crop Health'],
  },
  {
    id: '4',
    title: 'Government Subsidies for Soil Testing in 2025',
    excerpt: 'Complete breakdown of state and central schemes supporting affordable soil health testing.',
    category: 'policy',
    date: '2025-11-01',
    readTime: 7,
    image: '/blog/subsidies.jpg',
    tags: ['Policy', 'Subsidies', 'Government Schemes'],
  },
];

export const STATS = [
  { label: 'Farmers Served', value: 15000, suffix: '+' },
  { label: 'Soil Tests Completed', value: 25000, suffix: '+' },
  { label: 'Partner Labs', value: 45, suffix: '+' },
  { label: 'Villages Covered', value: 500, suffix: '+' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const CROP_TYPES = [
  'Wheat (गेहूं)', 'Rice (धान)', 'Maize (मक्का)', 'Sugarcane (गन्ना)',
  'Cotton (कपास)', 'Soybean (सोयाबीन)', 'Potato (आलू)', 'Onion (प्याज)',
  'Tomato (टमाटर)', 'Vegetables (सब्जियां)', 'Fruits (फल)', 'Other (अन्य)',
];
