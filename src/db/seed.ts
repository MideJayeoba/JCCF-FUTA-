import { db, createPool } from './index.ts';
import { 
  users, 
  fellowships, 
  announcements, 
  events, 
  executives, 
  resources, 
  historicalExecutives, 
  media, 
  systemSettings 
} from './schema.ts';
import { eq, sql } from 'drizzle-orm';

// Default Member Fellowships in FUTA
export const DEFAULT_FELLOWSHIPS = [
  {
    name: 'Redeemed Christian Fellowship',
    acronym: 'RCF FUTA',
    category: 'Denominational',
    meetingDays: 'Tuesdays & Sundays',
    venue: 'ETF Hall, FUTA Main Campus',
    presidentName: 'Bro. Emmanuel Adeleke',
    presidentPhone: '+234 813 456 7890',
    description: 'A vibrant family of passionate worshippers and kingdom builders raising leaders of integrity across all faculties in FUTA.',
    logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+ETF+Hall+Akure'
  },
  {
    name: "The Apostolic Church Students' Fellowship of Nigeria",
    acronym: 'TACSFON FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'SEET Complex Lecture Theatre, FUTA',
    presidentName: 'Bro. Samuel Olawale',
    presidentPhone: '+234 814 567 8901',
    description: 'Standing firm on the apostolic doctrine, fervent prayer, and unfeigned love among students.',
    logoUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEET+Complex+Akure'
  },
  {
    name: 'Christ Ambassadors Students Outreach',
    acronym: 'CASOR FUTA',
    category: 'Denominational',
    meetingDays: 'Thursdays & Sundays',
    venue: 'Hilltop Auditorium, FUTA',
    presidentName: 'Bro. David Ayodele',
    presidentPhone: '+234 816 789 0123',
    description: 'Empowering campus students as true ambassadors of Christ for world evangelism and spiritual depth.',
    logoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+Hilltop+Auditorium+Akure'
  },
  {
    name: 'Fellowship of Christian Students',
    acronym: 'FCS FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Mondays & Sundays',
    venue: 'School of Sciences (SOS) Theatre, FUTA',
    presidentName: 'Bro. Peter Yohanna',
    presidentPhone: '+234 802 345 6789',
    description: 'Uniting students in non-denominational discipleship, Bible study, and kingdom fellowship.',
    logoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SOS+Theatre+Akure'
  },
  {
    name: 'Deeper Life Campus Fellowship',
    acronym: 'DLCF FUTA',
    category: 'Denominational',
    meetingDays: 'Mondays, Thursdays & Sundays',
    venue: 'DLCF Campus Centre, South Gate FUTA',
    presidentName: 'Bro. Joshua Ogundipe',
    presidentPhone: '+234 803 456 7890',
    description: 'Building students in holy living, sound biblical truth, and academic excellence.',
    logoUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=DLCF+South+Gate+FUTA+Akure'
  },
  {
    name: 'Nigeria Federation of Evangelical Students',
    acronym: 'NIFES FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'SAAT Lecture Theatre, FUTA',
    presidentName: 'Bro. Caleb Babatunde',
    presidentPhone: '+234 815 678 9012',
    description: 'Mobilizing students to be transformed and to transform society through the gospel of Jesus Christ.',
    logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SAAT+Theatre+Akure'
  },
  {
    name: 'Baptist Student Fellowship',
    acronym: 'BSF FUTA',
    category: 'Denominational',
    meetingDays: 'Tuesdays & Sundays',
    venue: 'SEET 2 Lecture Hall, FUTA',
    presidentName: 'Bro. Daniel Oladipo',
    presidentPhone: '+234 812 345 6789',
    description: 'Reaching students for Christ, teaching them the word of God, and training them for leadership.',
    logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEET+2+Akure'
  },
  {
    name: 'Winners Campus Fellowship',
    acronym: 'WCF FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'Engineering Wing A, FUTA',
    presidentName: 'Bro. Victor Adeleke',
    presidentPhone: '+234 818 901 2345',
    description: 'Raising a people of distinction, faith, and spiritual dominion on campus.',
    logoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+Engineering+Wing+Akure'
  },
  {
    name: 'Mountain of Fire and Miracles Ministries Campus Fellowship',
    acronym: 'MFMCF FUTA',
    category: 'Denominational',
    meetingDays: 'Thursdays & Sundays',
    venue: 'School of Earth & Mineral Sciences Auditorium',
    presidentName: 'Bro. Elijah Olumide',
    presidentPhone: '+234 809 123 4567',
    description: 'Raising aggressive prayer warriors and deliverers equipped with the power of the Holy Ghost.',
    logoUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEMS+Auditorium+Akure'
  },
  {
    name: 'Christ Apostolic Church Youth Fellowship',
    acronym: 'CACYOF FUTA',
    category: 'Denominational',
    meetingDays: 'Tuesdays & Sundays',
    venue: 'ETF 2 Complex, FUTA',
    presidentName: 'Bro. Timothy Ajayi',
    presidentPhone: '+234 805 678 1234',
    description: 'Fostering revival, spiritual power, and apostolic fire in students of higher learning.',
    logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+ETF+2+Akure'
  },
  {
    name: 'Evangelical Fellowship in the Anglican Communion',
    acronym: 'EFAC FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'Chapel of Hope FUTA Hall',
    presidentName: 'Bro. Barnabas Okoh',
    presidentPhone: '+234 806 789 2345',
    description: 'Proclaiming biblical truth, spiritual discipleship, and evangelism within the Anglican heritage.',
    logoUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Chapel+of+Hope+FUTA+Akure'
  },
  {
    name: 'Believers LoveWorld',
    acronym: 'BLW FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'Hilltop Hall 2, FUTA',
    presidentName: 'Bro. Great Praise',
    presidentPhone: '+234 807 890 3456',
    description: 'Building a dynamic generation grounded in the Word of God, love, and the supernatural.',
    logoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Hilltop+Hall+FUTA+Akure'
  },
  {
    name: 'Methodist Campus Fellowship',
    acronym: 'MCF FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'ETF Building Room 4, FUTA',
    presidentName: 'Bro. Samuel Adekunle',
    presidentPhone: '+234 803 219 8765',
    description: 'Committed to spreading scriptural holiness and transforming lives through vibrant fellowship.',
    logoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=ETF+Building+FUTA+Akure'
  },
  {
    name: 'Foursquare Students Fellowship',
    acronym: 'FSF FUTA',
    category: 'Denominational',
    meetingDays: 'Thursdays & Sundays',
    venue: 'School of Agriculture Lecture Theatre, FUTA',
    presidentName: 'Bro. Joshua Alabi',
    presidentPhone: '+234 812 345 9876',
    description: 'Proclaiming Jesus Christ the Savior, Baptizer with the Holy Ghost, Healer, and Soon-Coming King.',
    logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SAAT+Theatre+Akure'
  },
  {
    name: 'Gospel Faith Mission International Campus Fellowship',
    acronym: 'GOFAMINT CF FUTA',
    category: 'Denominational',
    meetingDays: 'Tuesdays & Sundays',
    venue: 'SEET Seminar Room, FUTA',
    presidentName: 'Bro. Ezekiel Ojo',
    presidentPhone: '+234 814 876 5432',
    description: 'Raising disciples of sound character, apostolic doctrine, and uncompromising kingdom principles.',
    logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEET+Akure'
  },
  {
    name: 'Church of God Mission Campus Fellowship',
    acronym: 'CGMCF FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'Old Senate Chamber Annex, FUTA',
    presidentName: 'Bro. Victor Enoma',
    presidentPhone: '+234 805 123 7890',
    description: 'Empowering students to lead with unstoppable faith, visionary excellence, and holy zeal.',
    logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+Senate+Annex+Akure'
  },
  {
    name: 'Watchman Catholic Charismatic Campus Fellowship',
    acronym: 'WCCCF FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Mondays, Thursdays & Sundays',
    venue: 'Lecture Theatre 3, FUTA',
    presidentName: 'Bro. Philip Chukwu',
    presidentPhone: '+234 806 234 5678',
    description: 'A light-bearing movement calling youth to total holiness, revival, and spiritual preparedness.',
    logoUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+LT3+Akure'
  },
  {
    name: 'Scripture Union Campus Fellowship',
    acronym: 'SUCF FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'SOS Annex Hall, FUTA',
    presidentName: 'Bro. Matthew Kalu',
    presidentPhone: '+234 817 654 3210',
    description: 'Helping students discover Jesus Christ through the daily encounter with God in the Scriptures.',
    logoUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SOS+Annex+Akure'
  },
  {
    name: 'Assemblies of God Campus Fellowship',
    acronym: 'AGCF FUTA',
    category: 'Denominational',
    meetingDays: 'Tuesdays & Sundays',
    venue: 'School of Mines Auditorium, FUTA',
    presidentName: 'Bro. Emmanuel Nwosu',
    presidentPhone: '+234 809 876 5432',
    description: 'Dedicated to Pentecostal power, Holy Ghost baptism, and worldwide missions on campus.',
    logoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEMS+Akure'
  },
  {
    name: 'All Christians Fellowship',
    acronym: 'ACF FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Mondays & Sundays',
    venue: 'Hilltop Complex Room 1, FUTA',
    presidentName: 'Bro. David Balogun',
    presidentPhone: '+234 813 111 2233',
    description: 'Uniting all believers regardless of denominational affiliation under the Lordship of Christ.',
    logoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+Hilltop+Akure'
  },
  {
    name: 'Victory Christian Fellowship',
    acronym: 'VCF FUTA',
    category: 'Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'SEET Seminar Room 2, FUTA',
    presidentName: 'Bro. Stephen Oni',
    presidentPhone: '+234 802 999 8877',
    description: 'Walking in the triumphant victory of Christ Jesus in academics, spiritual walk, and future career.',
    logoUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SEET+Room+2+Akure'
  },
  {
    name: 'Pentecostal Evangelical Campus',
    acronym: 'PEC FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Thursdays & Sundays',
    venue: 'ETF 3 Lecture Room, FUTA',
    presidentName: 'Bro. Barnabas Akindele',
    presidentPhone: '+234 815 444 3322',
    description: 'Fervent in evangelism, kingdom discipleship, and fervent intercession across student hostels.',
    logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+ETF+3+Akure'
  },
  {
    name: 'Student Christian Movement',
    acronym: 'SCM FUTA',
    category: 'Inter-Denominational',
    meetingDays: 'Wednesdays & Sundays',
    venue: 'SAAT Annex Lecture Hall, FUTA',
    presidentName: 'Bro. Gideon Adeleke',
    presidentPhone: '+234 803 777 6655',
    description: 'Pioneering Christian presence, leadership training, and campus evangelism since the earliest university days.',
    logoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=FUTA+SAAT+Annex+Akure'
  }
];

// Default Central Executives
export const DEFAULT_EXECUTIVES = [
  {
    name: 'Ogunyimika Nifemi',
    office: 'President (Central Executive Council)',
    department: 'Industrial & Production Engineering',
    level: '500L',
    phone: '+234 814 123 4567',
    email: 'president@jccf-futa.org',
    session: '2025/2026',
    fellowship: 'RCF FUTA',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Guiding the body of Christ into oneness of purpose and kingdom fruitfulness across all campus faculties.'
  },
  {
    name: 'Jayeoba Peace Olamide',
    office: 'Public Relations Officer (PRO Superadmin)',
    department: 'Computer Science',
    level: '500L',
    phone: '+234 813 987 6543',
    email: 'jayeobapeace19459@gmail.com',
    session: '2025/2026',
    fellowship: 'TACSFON FUTA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Overseeing official communication, publicity systems, digital media, and institutional unity for JCCF FUTA.'
  },
  {
    name: 'Adeyemi Deborah',
    office: 'Vice President',
    department: 'Biochemistry',
    level: '500L',
    phone: '+234 816 234 5678',
    email: 'vp@jccf-futa.org',
    session: '2025/2026',
    fellowship: 'CASOR FUTA',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated to sisterhood coordination, intercessory welfare, and spiritual follow-up across fellowships.'
  },
  {
    name: 'Oluwaseun John',
    office: 'General Secretary',
    department: 'Electrical & Electronics Engineering',
    level: '500L',
    phone: '+234 802 345 6789',
    email: 'gensec@jccf-futa.org',
    session: '2025/2026',
    fellowship: 'FCS FUTA',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Managing official records, administrative correspondence, and constitutional secretarial duties.'
  },
  {
    name: 'Adebayo Samuel',
    office: 'Prayer Secretary',
    department: 'Mechanical Engineering',
    level: '500L',
    phone: '+234 803 456 7890',
    email: 'prayer@jccf-futa.org',
    session: '2025/2026',
    fellowship: 'DLCF FUTA',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bio: 'Fueling campus-wide prayer chains, noon intercessory hours, and spiritual revival meetings.'
  }
];

// Default Events
export const DEFAULT_EVENTS = [
  {
    title: 'JCCF Mega Praise & Worship Experience',
    theme: 'The Sound of Eternal Victory',
    date: 'Oct 24, 2026',
    time: '4:30 PM WAT',
    venue: 'FUTA Main Auditorium',
    category: 'Mega Praise',
    description: 'An unforgettable evening of deep worship, high praise, and apostolic impartation uniting all campus fellowships.',
    featured: true
  },
  {
    title: 'Noon Combined Campus Intercessory Prayers',
    theme: 'Preserving the Campus by the Blood',
    date: 'Every Wednesday',
    time: '12:00 PM - 1:00 PM',
    venue: 'ETF Hall FUTA',
    category: 'Spiritual',
    description: 'Weekly campus-wide midday prayer gathering lifting petitions for students, examinations, and university leadership.',
    featured: true
  },
  {
    title: 'Sessional Change of Pulpit',
    theme: 'One Body in Christ',
    date: 'Nov 15, 2026',
    time: '8:00 AM WAT',
    venue: 'Across All Member Fellowships',
    category: 'Combined Service',
    description: 'Ministers and executive leaders rotate across various campus fellowships to minister and strengthen fraternal bonds.',
    featured: false
  }
];

// Default Announcements
export const DEFAULT_ANNOUNCEMENTS = [
  {
    title: 'Constitutional Registration of All Campus Fellowships (2025/2026)',
    content: 'All Christian student fellowships operating on FUTA campus are officially reminded to update their annual registry credentials with the JCCF Central Secretariat.',
    category: 'Secretariat',
    date: 'Aug 28, 2026',
    author: 'JCCF Central Executive Council',
    pinned: true
  },
  {
    title: 'Noon Intercessory Prayers Resume for Second Semester',
    content: 'The weekly Wednesday midday prayer assembly holds promptly at 12:00 noon at ETF Hall. All students and fellowship executives are encouraged to attend.',
    category: 'Spiritual',
    date: 'Aug 26, 2026',
    author: 'Public Relations Directorate',
    pinned: true
  },
  {
    title: 'Digital Portal & Giving Information Channel Launch',
    content: 'JCCF FUTA has deployed its unified digital gateway for transparent giving, member fellowship discovery, constitutional downloads, and verified sermons.',
    category: 'General',
    date: 'Aug 25, 2026',
    author: 'PRO Admin Directorate',
    pinned: false
  }
];

export async function seedDatabaseIfEmpty() {
  const pool = createPool();
  try {
    console.log('🔄 Checking and seeding PostgreSQL database records...');

    // Ensure users table has all required columns
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS security_pin TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    `);

    // 1. Seed / Upsert Superadmin into `users` table
    const superEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
    const superPin = (process.env.SUPERADMIN_PIN || '1945').trim();

    await pool.query(`
      INSERT INTO users (uid, email, display_name, photo_url, role, portfolio, security_pin, phone, last_login_at)
      VALUES 
        ('superadmin-jayeoba-peace', $1, 'Jayeoba Peace Olamide', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'superadmin', 'Central Executive Council / Superadmin', $2, '+234 813 987 6543', NOW())
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        role = 'superadmin',
        portfolio = EXCLUDED.portfolio,
        -- Keep the bootstrap PIN only until a real password is set; then drop it so
        -- the weak default can no longer be used to log in.
        security_pin = CASE WHEN users.password_hash IS NOT NULL THEN NULL ELSE EXCLUDED.security_pin END,
        phone = EXCLUDED.phone;
    `, [superEmail, superPin]);

    // 2. Seed / Upsert System Settings
    const authListJson = JSON.stringify([
      {
        email: superEmail,
        name: 'Jayeoba Peace Olamide (Primary Superadmin)',
        role: 'superadmin',
        portfolio: 'Central Executive Council / Superadmin',
        addedAt: 'Aug 25, 2026',
        addedBy: 'Central Executive Council'
      }
    ]);

    await pool.query(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES 
        ('superadmin_email', $1, NOW()),
        ('superadmin_pin', $2, NOW()),
        ('authorizedAdminList', $3, NOW()),
        ('youtubeChannel', '@jccf_futa', NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW();
    `, [superEmail, superPin, authListJson]);

    // 3. Seed / Ensure all 24 Member Fellowships in PostgreSQL
    const existingFellowshipsRes = await pool.query('SELECT acronym, name FROM fellowships');
    const existingAcronyms = new Set(existingFellowshipsRes.rows.map((r: any) => (r.acronym || '').toLowerCase().trim()));

    for (const item of DEFAULT_FELLOWSHIPS) {
      if (!existingAcronyms.has(item.acronym.toLowerCase().trim())) {
        await pool.query(`
          INSERT INTO fellowships (name, acronym, category, meeting_days, venue, president_name, president_phone, description, logo_url, map_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          item.name,
          item.acronym,
          item.category,
          item.meetingDays,
          item.venue,
          item.presidentName,
          item.presidentPhone,
          item.description,
          item.logoUrl,
          item.mapUrl
        ]);
        existingAcronyms.add(item.acronym.toLowerCase().trim());
      }
    }
    console.log(`✅ Synchronized ${DEFAULT_FELLOWSHIPS.length} member fellowships in PostgreSQL.`);

    // 4. Seed Executives if table is empty
    const execCheck = await pool.query('SELECT COUNT(*) FROM executives');
    if (parseInt(execCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding central executives into PostgreSQL...');
      for (const item of DEFAULT_EXECUTIVES) {
        await pool.query(`
          INSERT INTO executives (name, office, department, level, phone, email, session, fellowship, photo_url, bio)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          item.name,
          item.office,
          item.department,
          item.level,
          item.phone,
          item.email,
          item.session,
          item.fellowship,
          item.photoUrl,
          item.bio
        ]);
      }
      console.log(`✅ Seeded ${DEFAULT_EXECUTIVES.length} central executives into database.`);
    }

    // 5. Seed Events if table is empty
    const evCheck = await pool.query('SELECT COUNT(*) FROM events');
    if (parseInt(evCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding calendar events into PostgreSQL...');
      for (const item of DEFAULT_EVENTS) {
        await pool.query(`
          INSERT INTO events (title, theme, date, time, venue, category, description, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          item.title,
          item.theme,
          item.date,
          item.time,
          item.venue,
          item.category,
          item.description,
          item.featured
        ]);
      }
      console.log(`✅ Seeded ${DEFAULT_EVENTS.length} events into database.`);
    }

    // 6. Seed Announcements if table is empty
    const annCheck = await pool.query('SELECT COUNT(*) FROM announcements');
    if (parseInt(annCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding announcements into PostgreSQL...');
      for (const item of DEFAULT_ANNOUNCEMENTS) {
        await pool.query(`
          INSERT INTO announcements (title, content, category, date, author, pinned)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          item.title,
          item.content,
          item.category,
          item.date,
          item.author,
          item.pinned
        ]);
      }
      console.log(`✅ Seeded ${DEFAULT_ANNOUNCEMENTS.length} announcements into database.`);
    }

    console.log('✅ PostgreSQL database records and administrative entities successfully synchronized.');
  } catch (err: any) {
    console.error('Database seeding error notice:', err.message || err);
  }
}
