export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Freshers' | 'Units & Service' | 'Secretariat' | 'Giving';
}

export const JCCF_FAQS: FAQItem[] = [
];
