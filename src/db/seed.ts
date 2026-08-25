import { db } from './index.ts';
import { 
  announcements, 
  events, 
  fellowships, 
  executives, 
  resources, 
  donations, 
  systemSettings 
} from './schema.ts';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Check system settings
    const existingSettings = await db.select().from(systemSettings);
    if (existingSettings.length === 0) {
      console.log('Seeding initial system settings...');
      await db.insert(systemSettings).values([
        { key: 'annualTheme', value: 'Reigning by Grace and Wisdom' },
        { key: 'themeScripture', value: 'Romans 5:17 • Daniel 1:17' },
        { key: 'academicSession', value: '2025/2026' },
        { key: 'opayMerchantAccount', value: '6110293847' },
        { key: 'opayMerchantName', value: 'JCCF FUTA / Central Finance' },
        { key: 'palmpayMerchantAccount', value: '9038475620' },
        { key: 'palmpayMerchantName', value: 'JCCF FUTA Giving Hub' },
        { key: 'contactEmail', value: 'jccf_futa@futa.edu.ng' },
        { key: 'contactPhone', value: '+234 813 456 7890' },
        { key: 'secretariatVenue', value: 'JCCF Secretariat Building, Near ETF Lecture Theatre, FUTA South Gate' },
      ]);
    }

    // 2. Check Announcements
    const existingAnnouncements = await db.select().from(announcements);
    if (existingAnnouncements.length === 0) {
      console.log('Seeding announcements...');
      await db.insert(announcements).values([
        {
          title: 'Mega Praise 2026: Official Date & Mass Choir Auditions Announcement',
          content: 'The Central Executive Council of JCCF FUTA officially invites all campus fellowship members and gifted singers to the Annual Mega Praise auditions at the ETF Hall.',
          category: 'Mega Praise',
          date: 'May 20, 2026',
          author: 'Central Executive Council',
          pinned: true,
        },
        {
          title: 'Joint Academic Tutorials for 100L & 200L Science/Engineering Courses',
          content: 'Free intensive tutorial sessions organized by JCCF Academic Directorate commence this Saturday at SEET Complex. Subjects include MTH 101, PHY 101, and CHE 101.',
          category: 'Academic',
          date: 'May 18, 2026',
          author: 'Directorate of Academics',
          pinned: true,
        },
        {
          title: 'All-Fellowships Combined Prayer Walk & Spiritual Warfare Summit',
          content: 'Join thousands of Christian students across all campus fellowships as we intercede for FUTA campus, peaceful examinations, and spiritual revival.',
          category: 'Spiritual',
          date: 'May 15, 2026',
          author: 'General Secretary',
          pinned: false,
        },
        {
          title: 'Call for Indigent Student Support Applications (Welfare Food Bank)',
          content: 'JCCF Welfare Ministry announces the disbursement of 200 subsidized food packs and meal vouchers for students facing financial hardship.',
          category: 'General',
          date: 'May 10, 2026',
          author: 'Welfare Directorate',
          pinned: false,
        }
      ]);
    }

    // 3. Check Events
    const existingEvents = await db.select().from(events);
    if (existingEvents.length === 0) {
      console.log('Seeding events...');
      await db.insert(events).values([
        {
          title: 'Annual Mega Praise Concert 2026',
          theme: 'Wonders of Endless Grace',
          date: 'Friday, June 12, 2026',
          time: '8:00 PM till Dawn',
          venue: 'FUTA Central Sports Complex / ETF Ground',
          category: 'Concert',
          description: 'A 10-hour non-stop apostolic praise, worship, and prophetic deliverance explosion uniting 15,000+ students and campus fellowships across Akure.',
          featured: true,
        },
        {
          title: 'JCCF Combined Leadership Summit 2026',
          theme: 'Leading with Kingdom Authority and Excellence',
          date: 'Saturday, June 20, 2026',
          time: '9:00 AM - 2:00 PM',
          venue: 'ETF Lecture Theatre, FUTA South Gate',
          category: 'Conference',
          description: 'Mandatory spiritual and strategic leadership workshop for all Fellowship Presidents, Vice Presidents, and Central Committee Executives.',
          featured: true,
        },
        {
          title: 'Mid-Semester All-Campus Revival Week',
          theme: 'Light on the Mountain',
          date: 'June 25 - 28, 2026',
          time: '5:00 PM Daily',
          venue: 'SEET Auditorium, FUTA',
          category: 'Revival',
          description: '4 transformative days of word expositions, deep repentance, healing, and Holy Ghost impartation led by anointed guest ministers.',
          featured: false,
        }
      ]);
    }

    // 4. Check Fellowships
    const existingFellowships = await db.select().from(fellowships);
    if (existingFellowships.length === 0) {
      console.log('Seeding fellowships...');
      await db.insert(fellowships).values([
        {
          name: 'Redeemed Christian Fellowship',
          acronym: 'RCF FUTA',
          category: 'Pentecostal',
          meetingDays: 'Sundays 8:00 AM, Tuesdays 5:30 PM',
          venue: 'RCF Secretariat Complex, South Gate, FUTA',
          presidentName: 'Bro. Emmanuel Adeleke',
          presidentPhone: '+234 814 555 0101',
          description: 'Raising vibrant disciples who demonstrate the fullness of Christ and righteous leadership.',
          logoUrl: '',
        },
        {
          name: 'Winners Campus Fellowship',
          acronym: 'WCF FUTA',
          category: 'Pentecostal',
          meetingDays: 'Sundays 7:30 AM, Wednesdays 5:00 PM',
          venue: 'WCF Youth Chapel, Opp. FUTA North Gate',
          presidentName: 'Bro. Victor Ojo',
          presidentPhone: '+234 812 444 0202',
          description: 'Liberating men and women through the preaching of the Word of Faith and spiritual empowerment.',
          logoUrl: '',
        },
        {
          name: 'Deeper Life Campus Fellowship',
          acronym: 'DLCF FUTA',
          category: 'Evangelical',
          meetingDays: 'Sundays 8:30 AM, Thursdays 5:30 PM',
          venue: 'DLCF Secretariat, Road 4, South Gate',
          presidentName: 'Bro. Samuel Ogunleye',
          presidentPhone: '+234 803 777 0303',
          description: 'Pursuing holiness, biblical sound doctrine, prayer depth, and earnest evangelism.',
          logoUrl: '',
        },
        {
          name: 'Christ Apostolic Church Youth Fellowship',
          acronym: 'CACYOF FUTA',
          category: 'Pentecostal',
          meetingDays: 'Sundays 8:00 AM, Wednesdays 5:00 PM',
          venue: 'CACYOF Hall, South Gate Junction',
          presidentName: 'Bro. Timothy Ajayi',
          presidentPhone: '+234 816 888 0404',
          description: 'Reviving apostolic prayer fire, supernatural signs, and character formation.',
          logoUrl: '',
        },
        {
          name: 'Christian Students Fellowship',
          acronym: 'CSF FUTA',
          category: 'Inter-denominational',
          meetingDays: 'Sundays 9:00 AM, Fridays 5:30 PM',
          venue: 'SEET Auditorium Annex',
          presidentName: 'Bro. Daniel Fashola',
          presidentPhone: '+234 809 999 0505',
          description: 'A loving interdenominational body nurturing spiritual growth, academic distinction, and unity.',
          logoUrl: '',
        },
        {
          name: 'Baptist Student Fellowship',
          acronym: 'BSF FUTA',
          category: 'Denominational',
          meetingDays: 'Sundays 8:00 AM, Thursdays 5:00 PM',
          venue: 'BSF Centre, North Gate FUTA',
          presidentName: 'Bro. Joshua Alabi',
          presidentPhone: '+234 818 111 0606',
          description: 'Equipping believers with sound Baptist faith heritage, missions passion, and servant leadership.',
          logoUrl: '',
        }
      ]);
    }

    // 5. Check Executives
    const existingExecutives = await db.select().from(executives);
    if (existingExecutives.length === 0) {
      console.log('Seeding central executives...');
      await db.insert(executives).values([
        {
          name: 'Bro. Peace Jayeoba',
          office: 'Public Relations Officer / IT Director',
          department: 'Computer Science',
          level: '500L',
          phone: '+234 813 456 7890',
          email: 'jayeobapeace19459@gmail.com',
          session: '2025/2026',
          fellowship: 'RCF FUTA',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
          bio: 'Passionate about leveraging modern digital infrastructure for campus revival and Christian student welfare.',
        },
        {
          name: 'Bro. Oluwaseun Michael',
          office: 'President',
          department: 'Electrical & Electronics Engineering',
          level: '500L',
          phone: '+234 803 123 4567',
          email: 'president.jccf@futa.edu.ng',
          session: '2025/2026',
          fellowship: 'WCF FUTA',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          bio: 'Leading the Joint Christian Campus Fellowship with a vision of united apostolic fervor and student impact.',
        },
        {
          name: 'Sis. Abigail Oluwatosin',
          office: 'Vice President (Administration)',
          department: 'Biochemistry',
          level: '500L',
          phone: '+234 806 987 6543',
          email: 'vp.jccf@futa.edu.ng',
          session: '2025/2026',
          fellowship: 'DLCF FUTA',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
          bio: 'Coordinating executive programs, welfare drives, and inter-fellowship leadership collaborations.',
        },
        {
          name: 'Bro. Caleb Ayomide',
          office: 'General Secretary',
          department: 'Mechanical Engineering',
          level: '400L',
          phone: '+234 810 234 5678',
          email: 'gensec.jccf@futa.edu.ng',
          session: '2025/2026',
          fellowship: 'CACYOF FUTA',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
          bio: 'Overseeing official communications, executive records, and secretarial documentation.',
        }
      ]);
    }

    // 6. Check Resources
    const existingResources = await db.select().from(resources);
    if (existingResources.length === 0) {
      console.log('Seeding academic resources...');
      await db.insert(resources).values([
        {
          title: 'MTH 101: Elementary Mathematics Past Questions & Solutions (2018-2025)',
          category: 'Study Materials',
          courseCode: 'MTH 101',
          department: 'General Studies / SEET / SAAT',
          format: 'PDF',
          fileSize: '4.8 MB',
          downloadUrl: 'https://example.com/downloads/mth101_jccf_solutions.pdf',
          downloadsCount: 1420,
          description: 'Comprehensive 7-year solved past examination questions with step-by-step calculus and algebraic proofs.',
          uploadedBy: 'JCCF Academic Directorate',
        },
        {
          title: 'PHY 101: General Physics Past Questions & Summary Notes',
          category: 'Study Materials',
          courseCode: 'PHY 101',
          department: 'Physics / Engineering / Sciences',
          format: 'PDF',
          fileSize: '6.2 MB',
          downloadUrl: 'https://example.com/downloads/phy101_jccf_notes.pdf',
          downloadsCount: 1180,
          description: 'Mechanics, Heat, and Wave motions summarized with 150+ solved multiple choice and theory problems.',
          uploadedBy: 'JCCF Academic Directorate',
        },
        {
          title: 'CHE 101: General Chemistry Formula Sheet & Solved CBT Questions',
          category: 'Study Materials',
          courseCode: 'CHE 101',
          department: 'Chemistry / All First Year Schools',
          format: 'PDF',
          fileSize: '3.5 MB',
          downloadUrl: 'https://example.com/downloads/che101_jccf_cbt.pdf',
          downloadsCount: 950,
          description: 'Quick revision cards and past computer-based test questions for high GPA performance.',
          uploadedBy: 'JCCF Academic Directorate',
        },
        {
          title: 'Apostolic Sermon Audio: "The Power of a Consecrated Youth" - Pastor Dr. Faith',
          category: 'Sermons',
          courseCode: 'SPIRITUAL',
          department: 'All Departments',
          format: 'MP3',
          fileSize: '24.1 MB',
          downloadUrl: 'https://example.com/downloads/jccf_sermon_consecration.mp3',
          downloadsCount: 680,
          description: 'A stirring keynote message delivered at the JCCF Joint Revival Conference on spiritual purity and campus victory.',
          uploadedBy: 'JCCF Media Team',
        }
      ]);
    }

    // 7. Check Donations
    const existingDonations = await db.select().from(donations);
    if (existingDonations.length === 0) {
      console.log('Seeding initial donations...');
      await db.insert(donations).values([
        {
          reference: 'OPAY-92837164',
          donorName: 'Anonymous Alumnus (Engr. D.)',
          donorEmail: 'alumni.partner@futa.edu.ng',
          donorPhone: '+234 803 111 2233',
          amount: 50000,
          purpose: 'Student Welfare Food Bank & Indigent Care',
          paymentMethod: 'OPay',
          status: 'Completed',
          channelDetails: 'OPay Wallet Instant Checkout',
        },
        {
          reference: 'PLMP-18273645',
          donorName: 'Sis. Grace Oluwatoyin',
          donorEmail: 'grace.o@student.futa.edu.ng',
          donorPhone: '+234 812 333 4455',
          amount: 10000,
          purpose: 'Mega Praise 2026 Logistics & Sound',
          paymentMethod: 'PalmPay',
          status: 'Completed',
          channelDetails: 'PalmPay Mobile Transfer',
        },
        {
          reference: 'BNK-77182930',
          donorName: 'Dr. & Mrs. Adeleke (Staff Adviser)',
          donorEmail: 'adeleke@futa.edu.ng',
          donorPhone: '+234 802 444 5566',
          amount: 100000,
          purpose: 'Academic Tutorial Materials Sponsorship',
          paymentMethod: 'Bank Transfer',
          status: 'Completed',
          channelDetails: 'First Bank Direct Deposit',
        }
      ]);
    }

    console.log('Database initialization & seeding check complete.');
  } catch (error) {
    console.error('Error during database seed check:', error);
  }
}
