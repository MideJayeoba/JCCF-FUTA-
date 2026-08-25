import { ServiceUnit } from '../types';

export const SERVICE_UNITS: ServiceUnit[] = [
  {
    id: 'choir',
    name: 'Voice of Praise (Music Ministry)',
    shortName: 'Choir',
    motto: 'Singing with the Spirit and with Understanding',
    headName: 'Bro. Femi Adeleke',
    headTitle: 'Music Director',
    description: 'Leading the congregation in high-praise and deep spiritual worship encounters. Bringing down God’s manifested presence through anointed vocals and instruments.',
    duties: [
      'Leading praise and worship sessions at all JCCF joint programs',
      'Vocal training, harmonies, and choral arrangement rehearsals',
      'Organizing the Annual Mega Praise & Night of 10,000 Hallelujahs',
      'Operating musical instruments (Keyboards, Drums, Bass, Guitars, Saxophone)'
    ],
    meetingTime: 'Saturdays 4:00 PM & Tuesdays 4:30 PM',
    venue: 'Chapel Music Hall',
    skillsNeeded: ['Vocal pitch accuracy', 'Keyboard / Guitar skills', 'Passionate worshipper heart', 'Punctuality']
  },
  {
    id: 'prayer',
    name: 'Prayer & Intercessory Force',
    shortName: 'Prayer Unit',
    motto: 'Men Ought Always to Pray and Not to Faint',
    headName: 'Sis. Abigail Danladi',
    headTitle: 'Prayer Secretary',
    description: 'The spiritual powerhouse and watchmen on the campus wall. Pounding the altar for campus revival, academic breakthroughs, salvation of souls, and protection of students.',
    duties: [
      'Hosting daily early-morning campus prayer watches (5:30 AM)',
      'Organizing JCCF Mid-night Intercessory Chains and Prayer Treks',
      'Standing in the gap for students during exams, crises, and hospital visitations',
      'Fasting and intercession before all major campus joint crusades'
    ],
    meetingTime: 'Fridays 10:00 PM (Vigil) & Daily 5:30 AM',
    venue: 'Prayer Mountain / Chapel Basement',
    skillsNeeded: ['Prayer endurance', 'Spiritual sensitivity', 'Fasting discipline', 'Burden for souls']
  },
  {
    id: 'media',
    name: 'Media & Technical Crew',
    shortName: 'Media Unit',
    motto: 'Amplifying the Gospel with Digital Excellence',
    headName: 'Bro. Emmanuel Chukwu',
    headTitle: 'Media Lead',
    description: 'Driving sound engineering, live streaming, photography, video production, graphic design, and social media outreach across digital campus platforms.',
    duties: [
      'Operating sound mixers, microphones, acoustic balancing, and lighting',
      'Live streaming fellowship services on YouTube, Facebook, and Instagram',
      'Designing flyers, motion graphics, and sermon quote banners',
      'Managing JCCF official website, audio podcast uploads, and digital archives'
    ],
    meetingTime: 'Saturdays 3:00 PM & Event setups 1 hour prior',
    venue: 'Media Studio / Sound Booth',
    skillsNeeded: ['Graphic design (Canva/Photoshop)', 'Sound engineering', 'Videography/Photography', 'Web & Social Media']
  },
  {
    id: 'academic',
    name: 'Academic Excellence & Mentorship Board',
    shortName: 'Academic Unit',
    motto: 'Ten Times Better in Wisdom & Understanding',
    headName: 'Bro. Victor Ojo (First Class, Engineering)',
    headTitle: 'Academic Coordinator',
    description: 'Ensuring that our faith shines brightly in our transcripts. Providing free department tutorials, past question archives, exam preparation workshops, and CGPA mentorship.',
    duties: [
      'Organizing faculty-wide free tutorials for 100L and 200L foundation courses',
      'One-on-one academic counseling for struggling students to boost CGPA',
      'Distributing soft copies of past questions and textbook summaries',
      'Hosting the annual "First Class Mindset & Career Blueprint" symposium'
    ],
    meetingTime: 'Saturdays 10:00 AM - 1:00 PM',
    venue: 'Lecture Theatre Block C',
    skillsNeeded: ['High academic standing (3.5+ CGPA)', 'Teaching ability', 'Patience', 'Subject mastery']
  },
  {
    id: 'ushering',
    name: 'Ushering & Protocol Unit',
    shortName: 'Ushering Unit',
    motto: 'Serving with Joy & Royal Dignity',
    headName: 'Sis. Deborah Babalola',
    headTitle: 'Chief Usher',
    description: 'Creating a warm, organized, and welcoming sanctuary environment. Guiding brethren to seats, collecting offerings orderly, and ministering to first-time visitors.',
    duties: [
      'Welcoming students warmly with cheerful smiles and service bulletins',
      'Orderly seating arrangement and crowd management during crowded meetings',
      'Coordinating tithes and offerings collection with high accountability',
      'VIP protocol and care for guest ministers and campus dignitaries'
    ],
    meetingTime: 'Saturdays 5:00 PM',
    venue: 'Chapel Main Auditorium',
    skillsNeeded: ['Warm smile & welcoming demeanor', 'Attentive alertness', 'Punctuality', 'Neat appearance']
  },
  {
    id: 'welfare',
    name: 'Welfare & Hospitality Ministry',
    shortName: 'Welfare Unit',
    motto: 'Love in Action, Bearing One Another’s Burdens',
    headName: 'Sis. Dorcas Eze',
    headTitle: 'Welfare Secretary',
    description: 'Expressing the tangible compassion of Christ by supporting indigent students with food items, hostel distress relief, examination refreshments, and visitation.',
    duties: [
      'Operating the JCCF "Food Bank" and exam welfare packs for students',
      'Emergency accommodation support for displaced or incoming freshers',
      'Hospital and hostel visitations for sick or bereaved students',
      'Distributing refreshments during special fellowships and conferences'
    ],
    meetingTime: 'Thursdays 4:30 PM',
    venue: 'Welfare Secretariat',
    skillsNeeded: ['Compassionate heart', 'Discretion & confidentiality', 'Logistics coordination', 'Caring spirit']
  },
  {
    id: 'evangelism',
    name: 'Evangelism & Rural Missions Unit',
    shortName: 'Missions Unit',
    motto: 'Go Ye Into All The Campus & Make Disciples',
    headName: 'Bro. Philip Matthew',
    headTitle: 'Evangelism Secretary',
    description: 'Taking the gospel to hostile hostel corners, student hangouts, departmental wings, and surrounding village communities during long vacation outreaches.',
    duties: [
      'Hostel-to-hostel and street-to-street evangelism outreaches',
      'Distributing gospel tracts and Christian literature across campus',
      'Follow-up and discipleship of new converts until they are firmly rooted',
      'Annual Rural Mission Trip to unreached interior villages'
    ],
    meetingTime: 'Saturdays 8:00 AM (Outreach) & Wednesdays 5:00 PM',
    venue: 'Campus Freedom Square',
    skillsNeeded: ['Boldness to share the gospel', 'Friendly conversationalist', 'Patience in follow-up', 'Mission burden']
  },
  {
    id: 'drama',
    name: 'Drama Ministry (The Vessels of Honour)',
    shortName: 'Drama Unit',
    motto: 'Preaching the Undiluted Word through Stage & Screen',
    headName: 'Bro. Stephen Adeyemi',
    headTitle: 'Drama Coordinator',
    description: 'Ministering powerful life-transforming messages through stage drama, skits, pantomime, and Christian short films that convict and inspire hearts.',
    duties: [
      'Scriptwriting, stage acting, directing, and costume coordination',
      'Producing short gospel skits for TikTok, YouTube, and fellowship meetings',
      'Staging major theatrical drama presentations during campus conferences',
      'Spoken word poetry and choreography presentations'
    ],
    meetingTime: 'Fridays 4:00 PM & Sundays 2:00 PM',
    venue: 'Arts Theatre 2',
    skillsNeeded: ['Acting talent', 'Scriptwriting ability', 'Costume & makeup creativity', 'Expressive stage presence']
  }
];
