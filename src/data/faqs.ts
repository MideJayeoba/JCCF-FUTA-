export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Freshers' | 'Units & Service' | 'Academics' | 'Giving';
}

export const JCCF_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the Joint Campus Christian Fellowship (JCCF)?',
    answer: 'JCCF is the apex unifying umbrella body representing all recognized Christian student fellowships on campus (such as RCF, NIFES, CASOR, TACSFON, DLCF, CU, BSF, FCS, etc.). It fosters spiritual unity, joint prayer revivals, cross-fellowship collaboration, and academic mentorship.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'How do I join a JCCF Service Unit (e.g. Choir, Media, Prayer, Ushering)?',
    answer: 'Any student who is born again and belongs to any member fellowship can join a JCCF unit! You can click the "Join a Unit" button on this website, fill out the short interest form, or meet the respective unit head after any Tuesday or Sunday joint fellowship.',
    category: 'Units & Service'
  },
  {
    id: 'faq-3',
    question: 'I am a 100L or Direct Entry Fresher. How can JCCF help me settle on campus?',
    answer: 'Welcome to campus! The JCCF Freshers Welfare and Mentorship Committee provides free accommodation guidance, off-campus apartment verification, free 100L tutorials, past questions for foundation courses, and pairs you with a godly senior mentor in your department.',
    category: 'Freshers'
  },
  {
    id: 'faq-4',
    question: 'Are the weekly Academic Tutorials completely free?',
    answer: 'Yes, 100% free! Every Saturday from 10:00 AM, our Academic Committee holds free intensive tutorials in Physics, Chemistry, Calculus, Engineering Mechanics, GST courses, Accounting, and Anatomy led by First Class senior students.',
    category: 'Academics'
  },
  {
    id: 'faq-5',
    question: 'Can I attend JCCF joint programs if I already attend my denomination’s fellowship?',
    answer: 'Absolutely! JCCF is not a separate denomination; it is a unifying umbrella platform. Joint programs (such as Tuesday Digging Deep, Thursday Power Night, Mega Praise, and Mega Summit) are designed to bring all campus believers together as One Body in Christ.',
    category: 'General'
  },
  {
    id: 'faq-6',
    question: 'How can I support JCCF projects, student welfare, or outreach financially?',
    answer: 'You can give online or make a direct bank transfer to our verified accounts (found on the "Giving" page or modal). Funds support the Student Food Bank, indigent student tuition relief, audio-visual equipment upgrades, and campus rural mission trips.',
    category: 'Giving'
  }
];
