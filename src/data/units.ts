import { ServiceUnit } from '../types';

export const SERVICE_UNITS: ServiceUnit[] = [
  {
    id: 'choir',
    name: 'The Choir Unit (JCCF Mass Choir)',
    shortName: 'Choir Unit',
    motto: 'Till we all come in the unity of faith',
    headName: 'Household Choir Coordinator',
    headTitle: 'Choir Coordinator',
    description: 'Serves as the JCCF Mass Choir and music ministry in all Household programmes and honours invitations to minister in programmes within and outside the FUTA community at the approval of the Household President.',
    meetingTime: 'Saturdays 4:00 PM',
    venue: 'Chapel Main Auditorium',
    skillsNeeded: ['Vocalists', 'Keyboardists', 'Drummers', 'Bassists', 'Sound Techs'],
    duties: [
      'Serving as the official JCCF Mass Choir for all joint Household programmes',
      'Leading praise and worship sessions at combined Sunday services and programmes',
      'Coordinating music directors and vocalists across all 25 member fellowships',
      'Operating instruments and nurturing instrumentalists for kingdom service'
    ]
  },
  {
    id: 'drama',
    name: 'The Drama Unit',
    shortName: 'Drama Unit',
    motto: 'Preaching the Undiluted Word through Stage & Screen',
    headName: 'Household Drama Coordinator',
    headTitle: 'Drama Coordinator',
    description: 'Ministers through anointed stage drama, scriptural dramatization, and theatrical productions in all Household programmes and outside programmes approved by the Household President.',
    meetingTime: 'Fridays 5:00 PM',
    venue: 'ETF Lecture Theatre Hall 1',
    skillsNeeded: ['Actors', 'Scriptwriters', 'Stage Managers', 'Costume Designers'],
    duties: [
      'Staging edifying dramatic ministrations during all JCCF joint assemblies',
      'Scriptwriting, directing, and rehearsals with fellowship drama secretaries',
      'Honouring external drama ministration invitations approved by the President',
      'Communicating scriptural truths through theatrical arts and skits'
    ]
  },
  {
    id: 'publicity',
    name: 'The Publicity Unit',
    shortName: 'Publicity Unit',
    motto: 'Disseminating the Word & Coordinating Information',
    headName: 'Household PRO / Publicity Coordinator',
    headTitle: 'Public Relations Officer',
    description: 'Responsible for creating awareness of all Household programmes through posters, handbills, jingles, electronic and print media, and managing the official JCCF website and social channels.',
    meetingTime: 'Thursdays 5:00 PM',
    venue: 'Chapel Board Room & Online',
    skillsNeeded: ['Graphic Designers', 'Web Admins', 'Content Writers', 'Video Editors', 'Social Media Managers'],
    duties: [
      'Managing the official JCCF website, circulars, and digital portals',
      'Disseminating information within and outside the Household',
      'Monitoring timely registration and renewal of constituent fellowships',
      'Creating posters, flyers, announcements, and electronic media campaigns'
    ]
  },
  {
    id: 'ushering',
    name: 'The Ushering Unit',
    shortName: 'Ushering Unit',
    motto: 'Orderliness & Faithful Sanctuary Stewardship',
    headName: 'Household Ushering Coordinator',
    headTitle: 'Ushering Coordinator',
    description: 'Responsible for cleaning, arrangement, decoration of stage and venue, maintaining orderliness, welcoming guests, collecting and counting tithes/offerings with the Financial Secretary, and recording congregational statistics.',
    meetingTime: 'Saturdays 5:00 PM',
    venue: 'Chapel Main Auditorium',
    skillsNeeded: ['Crowd Management', 'Protocol', 'Warm Hospitality', 'Punctuality'],
    duties: [
      'Cleaning, arrangement, and stage decoration of all Household venues',
      'Maintaining orderliness and welcoming guests without fear or favour',
      'Assisting the Financial Secretary in collecting and counting tithes and offerings',
      'Recording congregational attendance statistics and distributing bulletins/materials'
    ]
  },
  {
    id: 'organizing',
    name: 'The Organizing Unit',
    shortName: 'Organizing Unit',
    motto: 'Technical Excellence, Sound & Logistics Mastery',
    headName: 'Household Organizing Coordinator',
    headTitle: 'Organizing Coordinator',
    description: 'Responsible for acquisition, keeping, and maintenance of all technical (musical, sound, and light) equipment, preparing venues with ushering, recording and archiving messages, and maintaining JCCF vehicles.',
    meetingTime: 'Saturdays 3:00 PM',
    venue: 'Chapel Media & Sound Booth',
    skillsNeeded: ['Sound Engineers', 'Electrical Techs', 'Logistics Coordinators', 'Drivers'],
    duties: [
      'Acquiring, servicing, and maintaining musical, sound, and lighting equipment',
      'Working with the ushering unit to secure and prepare venues and seating',
      'Ensuring proper recording, duplication, and digital archiving of ministrations',
      'Managing and maintaining JCCF vehicles and designated student drivers'
    ]
  }
];
