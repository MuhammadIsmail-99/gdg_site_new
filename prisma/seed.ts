import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Hash default password ────────────────────────────────────────────────
  const defaultPassword = await bcrypt.hash('gdgoc2026', 12);

  // ─── MEMBERS ──────────────────────────────────────────────────────────────
  console.log('👥 Seeding members...');

  const kashif = await prisma.member.upsert({
    where: { slug: 'kashif-ayub' },
    update: {},
    create: {
      slug: 'kashif-ayub',
      name: 'Dr. Kashif Ayyub',
      email: 'kashif@cuiwah.edu.pk',
      passwordHash: defaultPassword,
      role: 'admin',
      tier: 'leadership',
      tagline: 'Empowering the next generation of researchers and engineers.',
      imageUrl: '/images/team/kashif_ayub.png',
      bio: 'Dr. Kashif brings years of academic and industry expertise to GDGoC CUI Wah. He specializes in guiding student chapters through strategic technical growth and sustainable community building.',
      linkedin: 'https://linkedin.com/in/kashif-ayyub',
      isActive: true,
      skills: {
        create: [
          { skill: 'System Design' },
          { skill: 'Cloud Architecture' },
          { skill: 'Research Methodology' },
          { skill: 'Academic Leadership' },
        ],
      },
      contributions: {
        create: [
          { title: 'Strategic oversight for Chapter 2026 formation' },
          { title: 'Faculty liaison for CUI Wah administration' },
          { title: 'Mentorship for lead recruitment process' },
          { title: 'Guidance on industry-academic collaborations' },
        ],
      },
    },
  });

  const ubaid = await prisma.member.upsert({
    where: { slug: 'ubaid' },
    update: {},
    create: {
      slug: 'ubaid',
      name: 'Ubaid Ghazi',
      email: 'ubaidghazi@example.com',
      passwordHash: defaultPassword,
      role: 'core',
      tier: 'leadership',
      tagline: 'Leading with vision, building with purpose.',
      imageUrl: '/images/team/ubaid.png',
      bio: 'Visionary leader driving the chapter\'s mission to bridge the gap between classroom theory and industry practice. Founder of multiple student initiatives and passionate about Flutter and Firebase.',
      github: 'https://github.com/ubaid-ghazi',
      linkedin: 'https://linkedin.com/in/ubaid-ghazi',
      isActive: true,
      skills: {
        create: [
          { skill: 'Flutter' },
          { skill: 'Firebase' },
          { skill: 'Project Strategy' },
          { skill: 'Community Building' },
        ],
      },
      contributions: {
        create: [
          { title: 'Established the Chapter at CUI Wah' },
          { title: 'Successfully recruited a 20+ member core team' },
          { title: 'Organized the first major Tech Bootcamp' },
          { title: 'Spearheaded the Google Cloud partnership for the region' },
        ],
      },
    },
  });

  const laiba = await prisma.member.upsert({
    where: { slug: 'laiba-faiz' },
    update: {},
    create: {
      slug: 'laiba-faiz',
      name: 'Laiba Faiz',
      email: 'laiba@example.com',
      passwordHash: defaultPassword,
      role: 'core',
      tier: 'core',
      tagline: 'Excellence in every operation, growth in every student.',
      imageUrl: '/images/team/laiba_faiz.png',
      bio: 'Commanding the chapter\'s operations and ensuring excellence across all events. Expert in project management and strategic communication within technical communities.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: {
        create: [
          { skill: 'Operations' },
          { skill: 'Strategic Leadership' },
          { skill: 'Public Relations' },
        ],
      },
      contributions: {
        create: [
          { title: 'Orchestrated all chapter internal operations' },
          { title: 'Managed cross-domain coordination for major events' },
          { title: 'Ensured compliance with official Google Chapter standards' },
          { title: 'Streamlined the core team communication workflow' },
        ],
      },
    },
  });

  const junaid = await prisma.member.upsert({
    where: { slug: 'junaid-mehmood' },
    update: {},
    create: {
      slug: 'junaid-mehmood',
      name: 'Junaid Mehmood',
      email: 'junaid@example.com',
      passwordHash: defaultPassword,
      role: 'core',
      tier: 'core',
      tagline: 'Transparency and quality are the foundations of community.',
      imageUrl: '/images/team/junaid_mehmood.png',
      bio: 'The backbone of the chapter\'s documentation and official correspondence. Ensuring transparency and high-quality standards for every GDGoC output.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: {
        create: [
          { skill: 'Documentation' },
          { skill: 'Administration' },
          { skill: 'Logic' },
        ],
      },
      contributions: {
        create: [
          { title: 'Lead the formal documentation for all 2026 events' },
          { title: 'Maintained official correspondence with global GDG leads' },
          { title: 'Headed the internal audit for project feasibility' },
          { title: 'Co-organized the membership recruitment drive' },
        ],
      },
    },
  });

  const tashfeen = await prisma.member.upsert({
    where: { slug: 'm-tashfeen' },
    update: {},
    create: {
      slug: 'm-tashfeen',
      name: 'M. Tashfeen',
      email: 'tashfeen@example.com',
      passwordHash: defaultPassword,
      role: 'core',
      tier: 'core',
      tagline: 'Turning complex logistics into seamless experiences.',
      imageUrl: '/images/team/m_tashfeen.png',
      bio: 'Optimizing the chapter\'s workflow and managing large-scale event logistics with precision.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: {
        create: [
          { skill: 'Logistics' },
          { skill: 'Budgeting' },
          { skill: 'Mgmt' },
        ],
      },
      contributions: {
        create: [
          { title: 'Managed onsite logistics for major technical workshops' },
          { title: 'Coordinated with venue and equipment providers' },
          { title: 'Ensured precise resource allocation for the bootcamp' },
          { title: 'Implemented high-efficiency event check-in systems' },
        ],
      },
    },
  });

  const ismail = await prisma.member.upsert({
    where: { slug: 'ismail' },
    update: {},
    create: {
      slug: 'ismail',
      name: 'Muhammad Ismail',
      email: 'ismail@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Writing code that scales, building apps that impact.',
      imageUrl: '/images/team/m_ismail.jpeg',
      bio: 'Expert in full-stack JavaScript and mobile application development. Ismail leads the technical workshops and mentors students on complex project architectures.',
      github: 'https://github.com/m-ismail-99',
      linkedin: 'https://linkedin.com/in/m-ismail',
      isActive: true,
      skills: {
        create: [
          { skill: 'Next.js' },
          { skill: 'Node.js' },
          { skill: 'React Native' },
          { skill: 'PostgreSQL' },
        ],
      },
      contributions: {
        create: [
          { title: 'Lead Frontend engineer for the official chapter site' },
          { title: 'Conducted 5+ workshops on Next.js 15 and App Router' },
          { title: 'Mentored student teams for the Solution Challenge' },
          { title: 'Implemented the chapter\'s automated event registration portal' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'manahil-mirza' },
    update: {},
    create: {
      slug: 'manahil-mirza',
      name: 'Manahil Mirza',
      email: 'manahil@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Finding the story within the data.',
      imageUrl: '/images/team/manahil_mirza.png',
      bio: 'Driving the Data Science vertical with a focus on Pandas, NumPy, and predictive modeling.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Python' }, { skill: 'Pandas' }, { skill: 'Matplotlib' }, { skill: 'SQL' }] },
      contributions: {
        create: [
          { title: 'Launched the Data Science 101 series' },
          { title: 'Led the regional Data-thon for student solvers' },
          { title: 'Created open-source datasets for student practice' },
          { title: 'Mentored participants in the Kaggle Challenge 2026' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'maleeha-zulfiqr' },
    update: {},
    create: {
      slug: 'maleeha-zulfiqr',
      name: 'Maleeha Zulfiqar',
      email: 'maleeha@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Exploring the frontier of Artificial Intelligence.',
      imageUrl: '/images/team/maleeha_zulfiqr.png',
      bio: 'Leading our deep dive into the world of Large Language Models and Generative AI tools.',
      github: '#',
      linkedin: '#',
      isActive: true,
      skills: { create: [{ skill: 'Gemini API' }, { skill: 'PyTorch' }, { skill: 'Prompt Eng' }] },
      contributions: {
        create: [
          { title: 'Conducted the \'Build with AI\' global series locally' },
          { title: 'Led specialized workshops on Gemini API integration' },
          { title: 'Evaluated AI-based projects for Chapter hackathons' },
          { title: 'Developed custom GPTs for chapter internal automation' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'ayesha-akhtar' },
    update: {},
    create: {
      slug: 'ayesha-akhtar',
      name: 'Ayesha Akhtar',
      email: 'ayesha@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Event management refined through precision.',
      imageUrl: '/images/team/ayesha_akhtar.png',
      bio: 'Crafting memorable, high-impact technical experiences for the CUI Wah community.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Event Planning' }, { skill: 'PR' }, { skill: 'Marketing' }] },
      contributions: {
        create: [
          { title: 'Managed the logistics for the Cloud Study Jam' },
          { title: 'Successfully secured 10+ student partnership for events' },
          { title: 'Coordinated with Google Developer Experts for guest talks' },
          { title: 'Head of the Chapter\'s flagship Gala Night' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'm-yousaf' },
    update: {},
    create: {
      slug: 'm-yousaf',
      name: 'Muhammad Yousaf',
      email: 'yousaf@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Bringing the Google brand to life in CUI Wah.',
      imageUrl: '/images/team/m_yousasf.png',
      bio: 'Designing the visual identity of GDGoC CUI Wah with a focus on high-fidelity Google branding.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Illustrator' }, { skill: 'Photoshop' }, { skill: 'Branding' }] },
      contributions: {
        create: [
          { title: 'Designed all official event branding and merch' },
          { title: 'Created the UI assets for the chapter portal' },
          { title: 'Managed the visual consistency of all social platforms' },
          { title: 'Leader of the Visual Arts student domain' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'fatima-qureshi' },
    update: {},
    create: {
      slug: 'fatima-qureshi',
      name: 'Fatima Qureshi',
      email: 'fatima@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Amplifying the chapter\'s impact across digital platforms.',
      imageUrl: '/images/team/fatima_qureshi.png',
      bio: 'Managing our digital footprint and ensuring our campus impact reaches a global audience.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Strategy' }, { skill: 'Copywriting' }, { skill: 'SEO' }] },
      contributions: {
        create: [
          { title: 'Increased chapter social reach by 200% in 6 months' },
          { title: 'Created the \'Student Spotlight\' series' },
          { title: 'Managed the official Chapter Instagram and LinkedIn portals' },
          { title: 'Developed the chapter\'s digital marketing strategy' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'alisha-fatima' },
    update: {},
    create: {
      slug: 'alisha-fatima',
      name: 'Alisha Fatima',
      email: 'alisha@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Inclusivity is the catalyst for innovation.',
      imageUrl: '/images/team/Alisha_fatima.png',
      bio: 'Empowering female student developers and launching initiatives to promote inclusivity in tech.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Lead Generation' }, { skill: 'Inclusivity' }, { skill: 'Logic' }] },
      contributions: {
        create: [
          { title: 'Established the WiT domain at CUI Wah' },
          { title: 'Organized the regional International Women\'s Day event' },
          { title: 'Mentored female students on career growth in technology' },
          { title: 'Initiated the WiT peer-learning circles' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'saad-ali' },
    update: {},
    create: {
      slug: 'saad-ali',
      name: 'Saad Ali',
      email: 'saad@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Building a home for every student developer.',
      imageUrl: '/images/team/saad_ali.png',
      bio: 'Building a thriving peer-to-peer ecosystem where every developer feels at home.',
      linkedin: '#',
      github: '#',
      isActive: true,
      skills: { create: [{ skill: 'Public Relations' }, { skill: 'Engagement' }, { skill: 'Slack Management' }] },
      contributions: {
        create: [
          { title: 'Managed the community engagement for 1000+ members' },
          { title: 'Facilitated the peer-to-peer developer helpdesk' },
          { title: 'Lead the onboard process for all new chapter members' },
          { title: 'Curates the chapter\'s internal newsletter' },
        ],
      },
    },
  });

  await prisma.member.upsert({
    where: { slug: 'adeel' },
    update: {},
    create: {
      slug: 'adeel',
      name: 'Adeel Asghar',
      email: 'adeel@example.com',
      passwordHash: defaultPassword,
      role: 'member',
      tier: 'domain',
      tagline: 'Architecture, logic, and clean code above all.',
      imageUrl: '/images/team/adeel_asghar.png',
      bio: 'Overseeing the technical direction of all student-led projects and ensuring code quality across the chapter.',
      github: '#',
      linkedin: '#',
      isActive: true,
      skills: { create: [{ skill: 'C++' }, { skill: 'System Architecture' }, { skill: 'Git Flow' }] },
      contributions: {
        create: [
          { title: 'Technical lead for all chapter production tools' },
          { title: 'Conducted code review sessions for student projects' },
          { title: 'Managed the chapter GitHub organization' },
          { title: 'Leading the solution challenge development track' },
        ],
      },
    },
  });

  console.log('✅ Members seeded');

  // ─── EVENTS ───────────────────────────────────────────────────────────────
  console.log('📅 Seeding events...');

  const event1 = await prisma.event.upsert({
    where: { slug: 'build-with-ai-google-ai-tools' },
    update: {},
    create: {
      slug: 'build-with-ai-google-ai-tools',
      title: 'Build with AI – Google AI Tools',
      description: 'Hands-on workshop organized by GDG to introduce developers to Google AI Tools and Gemini models. Build smart applications today.',
      type: 'WORKSHOP',
      location: 'Jammu, IN',
      date: new Date('2026-03-28T09:00:00Z'),
      badgeUrl: 'https://developers.google.com/community/gdg/images/gdg-logo.png',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'AI' }, { tag: 'AI - Gemini' }, { tag: 'Build with AI' }, { tag: 'Workshop' }] },
      agendaItems: {
        create: [
          { time: '09:00 AM', title: 'Welcome & Introductions', description: 'Opening session and introduction to Google AI ecosystem.', order: 1 },
          { time: '10:00 AM', title: 'Intro to Gemini API', description: 'Deep dive into the Gemini model family and API capabilities.', speaker: 'Maleeha Zulfiqar', order: 2 },
          { time: '12:00 PM', title: 'Hands-on Lab: Build with Gemini', description: 'Live coding session — build a smart application using Gemini API.', speaker: 'Muhammad Ismail', order: 3 },
          { time: '03:00 PM', title: 'Project Showcase & Wrap-up', description: 'Teams present their AI-powered apps and Q&A session.', order: 4 },
        ],
      },
    },
  });

  const event2 = await prisma.event.upsert({
    where: { slug: 'gdg-x-dsa-series-2026' },
    update: {},
    create: {
      slug: 'gdg-x-dsa-series-2026',
      title: 'GDG x DSA Series: Master Algorithms',
      description: 'Master Data Structures & Algorithms. A high-intensity, commitment-based initiative to help you master algorithms and land your dream tech job.',
      type: 'STUDY_GROUP',
      location: 'Chandigarh, IN',
      date: new Date('2026-01-26T10:00:00Z'),
      badgeUrl: 'https://developers.google.com/static/community/images/gdg-bevy-logo.png',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Career Development' }, { tag: 'Algorithms' }, { tag: 'DSA' }] },
      agendaItems: {
        create: [
          { time: '10:00 AM', title: 'Session Kickoff', description: 'Overview of the DSA series roadmap and commitment expectations.', order: 1 },
          { time: '11:00 AM', title: 'Arrays & Strings Deep Dive', description: 'Solving classic problems with optimal complexity analysis.', speaker: 'Adeel Asghar', order: 2 },
          { time: '01:00 PM', title: 'Trees & Graph Traversals', description: 'BFS, DFS, and practical applications in coding interviews.', speaker: 'Adeel Asghar', order: 3 },
          { time: '03:30 PM', title: 'Mock Interview Round', description: 'Participants pair up for live problem-solving under interview conditions.', order: 4 },
        ],
      },
    },
  });

  const event3 = await prisma.event.upsert({
    where: { slug: 'android-devfest-2026' },
    update: {},
    create: {
      slug: 'android-devfest-2026',
      title: 'Android DevFest \'26',
      description: 'Dive deep into Jetpack Compose and Material Design 3. Build modern, beautiful Android applications with the community.',
      type: 'WORKSHOP',
      location: 'Wah, PK',
      date: new Date('2026-05-10T09:30:00Z'),
      badgeUrl: 'https://fonts.gstatic.com/s/i/productlogos/googleg_standard/v9/64.png',
      imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Mobile' }, { tag: 'Android' }, { tag: 'Development' }, { tag: 'Jetpack Compose' }] },
      agendaItems: {
        create: [
          { time: '09:30 AM', title: 'Opening Keynote', description: 'State of Android 2026 — what\'s new in Jetpack and Material Design 3.', order: 1 },
          { time: '10:30 AM', title: 'Jetpack Compose Masterclass', description: 'Building declarative UI components with Compose animations.', speaker: 'Ubaid Ghazi', order: 2 },
          { time: '12:30 PM', title: 'Firebase Integration Lab', description: 'Real-time database, auth, and cloud functions in Android apps.', speaker: 'Ubaid Ghazi', order: 3 },
          { time: '02:30 PM', title: 'DevFest App Challenge', description: 'Teams compete to build the most creative Android app in 90 minutes.', order: 4 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'google-cloud-study-jams-2026' },
    update: {},
    create: {
      slug: 'google-cloud-study-jams-2026',
      title: 'Google Cloud Study Jams',
      description: 'Get hands-on experience with Google Cloud Platform. Learn about Kubernetes, BigQuery, and Machine Learning from experts.',
      type: 'STUDY_GROUP',
      location: 'Virtual Event',
      date: new Date('2026-04-15T11:00:00Z'),
      badgeUrl: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Cloud' }, { tag: 'DevOps' }, { tag: 'Computing' }, { tag: 'GCP' }] },
      agendaItems: {
        create: [
          { time: '11:00 AM', title: 'GCP Fundamentals Overview', description: 'Introduction to GCP, IAM, and core service categories.', order: 1 },
          { time: '12:00 PM', title: 'BigQuery Hands-on Lab', description: 'Querying massive datasets with SQL on Google BigQuery.', speaker: 'Manahil Mirza', order: 2 },
          { time: '02:00 PM', title: 'Kubernetes & Container Orchestration', description: 'Deploying containerized apps on GKE.', speaker: 'Muhammad Ismail', order: 3 },
          { time: '04:00 PM', title: 'GCP ML APIs Demo', description: 'Using Vision, Natural Language, and Translation APIs.', order: 4 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'github-workshop-mastering-version-control' },
    update: {},
    create: {
      slug: 'github-workshop-mastering-version-control',
      title: 'GitHub Workshop: Mastering Version Control',
      description: 'Learn everything you need to know about Git and GitHub, from branching strategies to making your first contribution to open source.',
      type: 'WORKSHOP',
      location: 'Room 101, CUI Wah',
      date: new Date('2026-04-05T10:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aadebc25a?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Git' }, { tag: 'GitHub' }, { tag: 'Open Source' }, { tag: 'Workshop' }] },
      agendaItems: {
        create: [
          { time: '10:00 AM', title: 'Introduction to Git', description: 'Basics of version control and Git operations.', order: 1 },
          { time: '11:30 AM', title: 'GitHub Workflow', description: 'Pull requests, issues, and collaboration on GitHub.', speaker: 'Adeel Asghar', order: 2 },
          { time: '01:30 PM', title: 'Open Source Contribution', description: 'Finding projects and making your first PR.', order: 3 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'open-source-summit' },
    update: {},
    create: {
      slug: 'open-source-summit',
      title: 'Open Source Summit: Why You Should Contribute',
      description: 'Explore the world of open-source software and how it’s shaping the future of technology. Hear from seasoned contributors.',
      type: 'SEMINAR',
      location: 'Main Auditorium, CUI Wah',
      date: new Date('2026-04-12T14:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Open Source' }, { tag: 'Community' }, { tag: 'Summit' }] },
      agendaItems: {
        create: [
          { time: '02:00 PM', title: 'The Power of Open Source', description: 'Opening keynote on the impact of OSS.', order: 1 },
          { time: '03:00 PM', title: 'Panel Discussion', description: 'Local contributors share their experiences.', speaker: 'Ubaid Ghazi', order: 2 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'intro-to-ai-generative-models' },
    update: {},
    create: {
      slug: 'intro-to-ai-generative-models',
      title: 'Introduction to AI & Generative Models',
      description: 'An introductory session to the basics of AI, machine learning, and the power of large language models like Gemini.',
      type: 'SESSION',
      location: 'Virtual Event',
      date: new Date('2026-04-20T11:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'AI' }, { tag: 'Generative AI' }, { tag: 'Gemini' }, { tag: 'Machine Learning' }] },
      agendaItems: {
        create: [
          { time: '11:00 AM', title: 'Basics of Machine Learning', description: 'Core concepts and terminology.', order: 1 },
          { time: '12:00 PM', title: 'Generative AI Overview', description: 'How LLMs work and what Gemini can do.', speaker: 'Maleeha Zulfiqar', order: 2 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'react-mastery-bootcamp' },
    update: {},
    create: {
      slug: 'react-mastery-bootcamp',
      title: 'React Mastery Bootcamp',
      description: 'A comprehensive bootcamp to take you from React basics to advanced concepts like server components and custom hooks.',
      type: 'BOOTCAMP',
      location: 'Tech Lab, CUI Wah',
      date: new Date('2026-05-02T09:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'React' }, { tag: 'JavaScript' }, { tag: 'Web Dev' }, { tag: 'Bootcamp' }] },
      agendaItems: {
        create: [
          { time: '09:00 AM', title: 'React Fundamentals', description: 'Props, state, and component lifecycle.', order: 1 },
          { time: '11:00 AM', title: 'Advanced Hooks', description: 'useMemo, useCallback, and custom hooks.', speaker: 'Muhammad Ismail', order: 2 },
          { time: '02:00 PM', title: 'Next.js & App Router', description: 'Server components and modern patterns.', speaker: 'Muhammad Ismail', order: 3 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'frontend-development-bootcamp' },
    update: {},
    create: {
      slug: 'frontend-development-bootcamp',
      title: 'Modern Front-End Development Bootcamp',
      description: 'Master the art of building beautiful, responsive user interfaces with HTML, CSS, and modern JavaScript frameworks.',
      type: 'BOOTCAMP',
      location: 'Online',
      date: new Date('2026-05-15T10:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Frontend' }, { tag: 'CSS' }, { tag: 'JavaScript' }, { tag: 'HTML' }, { tag: 'Bootcamp' }] },
      agendaItems: {
        create: [
          { time: '10:00 AM', title: 'Mastering Layouts', description: 'Flexbox, Grid, and responsive design.', order: 1 },
          { time: '12:00 PM', title: 'Modern JavaScript', description: 'ES6+ features and asynchronous programming.', order: 2 },
          { time: '03:00 PM', title: 'Frontend Frameworks', description: 'Intro to React and Vue.', order: 3 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'data-science-101-bootcamp' },
    update: {},
    create: {
      slug: 'data-science-101-bootcamp',
      title: 'Data Science 101: From Data to Insights',
      description: 'A hands-on bootcamp where you’ll learn data manipulation, visualization, and basic predictive modeling with Python.',
      type: 'BOOTCAMP',
      location: 'Computer Lab 2, CUI Wah',
      date: new Date('2026-06-05T09:00:00Z'),
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536ad37?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      tags: { create: [{ tag: 'Data Science' }, { tag: 'Python' }, { tag: 'Analytics' }, { tag: 'Bootcamp' }] },
      agendaItems: {
        create: [
          { time: '09:00 AM', title: 'Intro to Python for Data', description: 'NumPy and Pandas basics.', order: 1 },
          { time: '11:00 AM', title: 'Data Visualization', description: 'Matplotlib and Seaborn.', order: 2 },
          { time: '01:30 PM', title: 'Predictive Modeling', description: 'Intro to Scikit-learn.', speaker: 'Manahil Mirza', order: 3 },
        ],
      },
    },
  });

  console.log('✅ Events seeded');

  // ─── POSTS ────────────────────────────────────────────────────────────────
  console.log('📝 Seeding blog posts...');

  await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      excerpt: 'Learn the basics of the App Router and SSR.',
      body: `# Getting Started with Next.js\n\nNext.js 15 introduces the App Router, a powerful paradigm shift from the Pages Router. In this article, we explore the foundations of Server-Side Rendering (SSR) and how the App Router simplifies data fetching.\n\n## What is the App Router?\n\nThe App Router uses React Server Components by default, allowing components to fetch data directly without useEffect or useState. This results in faster page loads and a better developer experience.\n\n## Key Concepts\n\n- **Server Components**: Run on the server, zero client JS by default.\n- **Client Components**: Opt-in with 'use client' directive.\n- **Layouts**: Persistent UI that wraps pages without re-rendering.\n- **Loading UI**: Instant loading states with Suspense boundaries.\n\n## Getting Started\n\n\`\`\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\`\`\`\n\nHappy building!`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      authorId: ismail.id,
      createdAt: new Date('2026-02-10T09:00:00Z'),
      tags: { create: [{ tag: 'Next.js' }, { tag: 'Web Dev' }, { tag: 'React' }] },
    },
  });

  await prisma.post.upsert({
    where: { slug: 'our-first-hackathon-experience' },
    update: {},
    create: {
      slug: 'our-first-hackathon-experience',
      title: 'Our First Hackathon Experience',
      excerpt: 'A recap of the excitement and projects built.',
      body: `# Our First Hackathon Experience\n\nThe GDGoC CUI Wah chapter hosted its inaugural hackathon in January 2026, bringing together 120+ students from across the campus.\n\n## The Challenge\n\nTeams were given 24 hours to build solutions addressing real problems in education, healthcare, and sustainability using Google technologies.\n\n## Highlights\n\n- **15 teams** competed with innovative solutions.\n- **Best Project**: An AI-powered study assistant using Gemini API.\n- **Runner-up**: A Flutter app for campus resource booking.\n- **Community Award**: A sustainability tracker with Firebase Realtime Database.\n\n## Lessons Learned\n\nOur chapter learned that community support, mentorship, and accessible tooling are the keys to a successful hackathon. The energy in the room was electric — and we can't wait to do it again!\n\n— The GDGoC CUI Wah Team`,
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      authorId: ubaid.id,
      createdAt: new Date('2026-01-20T10:00:00Z'),
      tags: { create: [{ tag: 'Hackathon' }, { tag: 'Community' }, { tag: 'Events' }] },
    },
  });

  await prisma.post.upsert({
    where: { slug: 'why-android-development-matters' },
    update: {},
    create: {
      slug: 'why-android-development-matters',
      title: 'Why Android Development Matters',
      excerpt: 'Exploring the modern Android ecosystem.',
      body: `# Why Android Development Matters\n\nWith over 3 billion active Android devices worldwide, mobile development — particularly Android — remains one of the most impactful skills a developer can have.\n\n## The Modern Android Stack\n\nAndroid development has evolved dramatically. The modern stack includes:\n\n- **Jetpack Compose**: Declarative UI that makes building beautiful interfaces intuitive.\n- **Material Design 3**: Google's latest design system for cohesive, accessible apps.\n- **Kotlin Coroutines**: Elegant asynchronous programming without callback hell.\n- **Firebase**: Backend-as-a-service for auth, real-time data, and cloud functions.\n\n## Why Students Should Care\n\nFor students in Pakistan, Android development opens doors to international freelancing, product companies, and Google-adjacent careers. The GDGoC chapter offers hands-on workshops every semester.\n\n## Getting Started\n\nDownload Android Studio, complete the Jetpack Compose Basics codelab on developers.google.com, and join our Android domain!`,
      coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1200',
      isPublished: true,
      authorId: kashif.id,
      createdAt: new Date('2026-01-05T08:00:00Z'),
      tags: { create: [{ tag: 'Android' }, { tag: 'Mobile' }, { tag: 'Kotlin' }] },
    },
  });

  console.log('✅ Posts seeded');

  // ─── RESOURCE TRACKS ──────────────────────────────────────────────────────
  console.log('🗺️ Seeding resource tracks...');

  await prisma.resourceTrack.create({
    data: {
      name: 'Fullstack Mastery',
      tag: 'Web Systems',
      tagColor: '#4285F4',
      description: 'Building the modern web from pixels to database scaling.',
      steps: {
        create: [
          { stepNum: '01 / Foundation', title: 'The Browser Engine', description: 'DOM manipulation, CSS architecture, and semantic accessibility.', order: 1 },
          { stepNum: '02 / Reactivity', title: 'Component Logic', description: 'State management, hooks, and reactive UI patterns with React and Next.js.', order: 2 },
          { stepNum: '03 / Edge', title: 'Modern Backends', description: 'Serverless functions, edge caching, and real-time data flow.', order: 3 },
          { stepNum: '04 / Deploy', title: 'Scale & Security', description: 'Auth patterns, performance auditing, and CI/CD pipelines.', order: 4 },
          { stepNum: '05 / Data', title: 'Databases & ORM', description: 'Relational vs NoSQL, query optimization, and schema design with Prisma.', order: 5 },
          { stepNum: '06 / Testing', title: 'Quality Engineering', description: 'Unit, integration, and end-to-end testing with Jest and Playwright.', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceTrack.create({
    data: {
      name: 'Applied AI',
      tag: 'Intelligence',
      tagColor: '#EA4335',
      description: 'Moving beyond prompts into building intelligent agentic systems.',
      steps: {
        create: [
          { stepNum: '01 / Logic', title: 'Pythonic Data', description: 'Scientific computing with NumPy and large-scale data processing with Pandas.', order: 1 },
          { stepNum: '02 / Modeling', title: 'Neural Networks', description: 'Understanding architecture, loss functions, and backpropagation from scratch.', order: 2 },
          { stepNum: '03 / LLM Ops', title: 'Retrieval (RAG)', description: 'Connecting models to private data using vector databases like Pinecone and Weaviate.', order: 3 },
          { stepNum: '04 / Vision', title: 'Computer Vision', description: 'Image classification, object detection, and segmentation with PyTorch and OpenCV.', order: 4 },
          { stepNum: '05 / Deploy', title: 'ML in Production', description: 'Model serving, monitoring drift, and building inference APIs with FastAPI.', order: 5 },
          { stepNum: '06 / Agents', title: 'Agentic Systems', description: 'Tool-calling, memory, and multi-agent orchestration using LangChain and LangGraph.', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceTrack.create({
    data: {
      name: 'Cloud Engineering',
      tag: 'Cloud & DevOps',
      tagColor: '#34A853',
      description: 'Architecting resilient, scalable infrastructure on the modern cloud.',
      steps: {
        create: [
          { stepNum: '01 / Fundamentals', title: 'Cloud Primitives', description: 'Compute, storage, and networking concepts across GCP, AWS, and Azure.', order: 1 },
          { stepNum: '02 / Containers', title: 'Docker & Kubernetes', description: 'Containerizing applications and orchestrating workloads at scale.', order: 2 },
          { stepNum: '03 / Automation', title: 'Infrastructure as Code', description: 'Provisioning repeatable environments with Terraform and Pulumi.', order: 3 },
          { stepNum: '04 / Pipelines', title: 'CI/CD at Scale', description: 'GitHub Actions workflows, blue-green deployments, and rollback strategies.', order: 4 },
        ],
      },
    },
  });

  await prisma.resourceTrack.create({
    data: {
      name: 'Cybersecurity Essentials',
      tag: 'Security',
      tagColor: '#F9AB00',
      description: 'Defending systems and thinking like an attacker to build safer software.',
      steps: {
        create: [
          { stepNum: '01 / Foundations', title: 'Networking & Protocols', description: 'TCP/IP, DNS, TLS, and how data moves across the internet securely.', order: 1 },
          { stepNum: '02 / Threats', title: 'Common Vulnerabilities', description: 'OWASP Top 10, SQL injection, XSS, and CSRF in real-world applications.', order: 2 },
          { stepNum: '03 / Offense', title: 'Ethical Hacking', description: 'Penetration testing methodology, reconnaissance, and exploitation basics.', order: 3 },
          { stepNum: '04 / Defense', title: 'Hardening & Response', description: 'Incident response, logging, threat modeling, and secure code review.', order: 4 },
        ],
      },
    },
  });

  console.log('✅ Resource tracks seeded');

  // ─── RESOURCE PLATFORMS ───────────────────────────────────────────────────
  console.log('🌐 Seeding learning platforms...');

  const platforms = [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Project-based paths for web certification and open-source contribution.', order: 1 },
    { name: 'Coursera', url: 'https://www.coursera.org/', description: 'Professional certificates from Google, DeepLearning.AI, and top universities.', order: 2 },
    { name: 'Kaggle', url: 'https://www.kaggle.com/', description: 'Machine learning competitions, public datasets, and free micro-courses.', order: 3 },
    { name: 'roadmap.sh', url: 'https://roadmap.sh/', description: 'Interactive visual guides for every engineering role and specialization.', order: 4 },
    { name: 'The Odin Project', url: 'https://www.theodinproject.com/', description: 'A free, open-source fullstack curriculum built by the community.', order: 5 },
    { name: 'fast.ai', url: 'https://www.fast.ai/', description: 'Practical deep learning for coders — top-down, hands-on approach.', order: 6 },
    { name: 'CS50 (Harvard)', url: 'https://cs50.harvard.edu/', description: 'The world\'s most popular intro to computer science, completely free.', order: 7 },
    { name: 'LeetCode', url: 'https://leetcode.com/', description: 'Algorithmic problem-solving and technical interview preparation.', order: 8 },
    { name: 'Google Developers', url: 'https://developers.google.com/', description: 'Official codelabs, tech guides, and certification tracks from Google.', order: 9 },
    { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/', description: 'Full lecture notes and assignments from MIT\'s real CS and math courses.', order: 10 },
  ];

  for (const p of platforms) {
    await prisma.resourcePlatform.create({ data: p });
  }

  console.log('✅ Platforms seeded');

  // ─── TOOL CATEGORIES + TOOLS ──────────────────────────────────────────────
  console.log('🧰 Seeding toolbox...');

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Engineering',
      colorHex: '#4285F4',
      order: 1,
      tools: {
        create: [
          { name: 'VS Code', url: 'https://code.visualstudio.com/', toolType: 'IDE', order: 1 },
          { name: 'GitHub', url: 'https://github.com/', toolType: 'Git', order: 2 },
          { name: 'Postman', url: 'https://www.postman.com/', toolType: 'API', order: 3 },
          { name: 'Docker', url: 'https://www.docker.com/', toolType: 'Ops', order: 4 },
          { name: 'Warp Terminal', url: 'https://www.warp.dev/', toolType: 'CLI', order: 5 },
          { name: 'TablePlus', url: 'https://tableplus.com/', toolType: 'DB', order: 6 },
          { name: 'Nx', url: 'https://nx.dev/', toolType: 'Monorepo', order: 7 },
        ],
      },
    },
  });

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Creative',
      colorHex: '#FBBC04',
      order: 2,
      tools: {
        create: [
          { name: 'Figma', url: 'https://www.figma.com/', toolType: 'Design', order: 1 },
          { name: 'Spline', url: 'https://spline.design/', toolType: '3D', order: 2 },
          { name: 'Framer', url: 'https://www.framer.com/motion/', toolType: 'Motion', order: 3 },
          { name: 'Lottiefiles', url: 'https://lottiefiles.com/', toolType: 'Animation', order: 4 },
          { name: 'Coolors', url: 'https://coolors.co/', toolType: 'Palette', order: 5 },
          { name: 'Fontshare', url: 'https://www.fontshare.com/', toolType: 'Typography', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Intelligence',
      colorHex: '#EA4335',
      order: 3,
      tools: {
        create: [
          { name: 'Gemini API', url: 'https://ai.google.dev/', toolType: 'Model', order: 1 },
          { name: 'Vertex AI', url: 'https://cloud.google.com/vertex-ai', toolType: 'Platform', order: 2 },
          { name: 'Colab', url: 'https://colab.research.google.com/', toolType: 'Notebook', order: 3 },
          { name: 'Hugging Face', url: 'https://huggingface.co/', toolType: 'Models', order: 4 },
          { name: 'Weights & Biases', url: 'https://wandb.ai/', toolType: 'Tracking', order: 5 },
          { name: 'LangChain', url: 'https://www.langchain.com/', toolType: 'Agents', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Productivity',
      colorHex: '#34A853',
      order: 4,
      tools: {
        create: [
          { name: 'Notion', url: 'https://www.notion.so/', toolType: 'Docs', order: 1 },
          { name: 'Linear', url: 'https://linear.app/', toolType: 'Issues', order: 2 },
          { name: 'Excalidraw', url: 'https://excalidraw.com/', toolType: 'Diagrams', order: 3 },
          { name: 'Obsidian', url: 'https://obsidian.md/', toolType: 'Notes', order: 4 },
          { name: 'Raycast', url: 'https://www.raycast.com/', toolType: 'Launcher', order: 5 },
          { name: 'Arc Browser', url: 'https://arc.net/', toolType: 'Browser', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Cloud & Infra',
      colorHex: '#9C27B0',
      order: 5,
      tools: {
        create: [
          { name: 'Google Cloud', url: 'https://cloud.google.com/', toolType: 'Platform', order: 1 },
          { name: 'Vercel', url: 'https://vercel.com/', toolType: 'Deploy', order: 2 },
          { name: 'Supabase', url: 'https://supabase.com/', toolType: 'Backend', order: 3 },
          { name: 'Cloudflare', url: 'https://www.cloudflare.com/', toolType: 'Edge', order: 4 },
          { name: 'Terraform', url: 'https://www.terraform.io/', toolType: 'IaC', order: 5 },
          { name: 'Railway', url: 'https://railway.app/', toolType: 'Hosting', order: 6 },
        ],
      },
    },
  });

  await prisma.resourceToolCategory.create({
    data: {
      name: 'Security',
      colorHex: '#FF6D00',
      order: 6,
      tools: {
        create: [
          { name: 'Burp Suite', url: 'https://portswigger.net/burp', toolType: 'Pentest', order: 1 },
          { name: 'Wireshark', url: 'https://www.wireshark.org/', toolType: 'Network', order: 2 },
          { name: 'OWASP ZAP', url: 'https://www.zaproxy.org/', toolType: 'Scanner', order: 3 },
          { name: '1Password', url: 'https://1password.com/', toolType: 'Secrets', order: 4 },
          { name: 'Snyk', url: 'https://snyk.io/', toolType: 'Deps', order: 5 },
          { name: 'Vault', url: 'https://www.vaultproject.io/', toolType: 'Keys', order: 6 },
        ],
      },
    },
  });

  console.log('✅ Toolbox seeded');

  // ─── CLUBS ────────────────────────────────────────────────────────────────
  console.log('🏛️ Seeding clubs...');

  const clubsData = [
    {
      name: 'Web & App Development',
      type: 'technical',
      description: 'The heartbeat of our chapter. We build responsive, production-ready web and mobile apps using the latest Google technologies.',
      iconType: 'code',
      colorToken: 'blue',
    },
    {
      name: 'Data Science',
      type: 'technical',
      description: 'Focusing on data-driven futures through deep dives into Python and predictive modeling.',
      iconType: 'bar-chart',
      colorToken: 'green',
    },
    {
      name: 'Generative AI & ML',
      type: 'technical',
      description: 'Exploring LLMs and Gemini integration to solve real-world problems with the power of artificial intelligence.',
      iconType: 'zap',
      colorToken: 'red',
    },
    {
      name: 'UI/UX & Graphics',
      type: 'creative',
      description: 'Mastering the visual identity and interface design that defines our pixel-perfect community.',
      iconType: 'pen-tool',
      colorToken: 'yellow',
    },
    {
      name: 'Growth & Impact',
      type: 'creative',
      description: 'Amplifying our voice and ensuring our community impact reaches a global audience.',
      iconType: 'trending-up',
      colorToken: 'purple',
    },
    {
      name: 'Events & Logistics',
      type: 'creative',
      description: 'The architects of experience, orchestrating the massive hackathons and workshops that define our year.',
      iconType: 'calendar',
      colorToken: 'gray',
    },
  ];

  for (const club of clubsData) {
    await prisma.club.create({ data: club });
  }

  console.log('✅ Clubs seeded');

  // ─── PARTNERS ─────────────────────────────────────────────────────────────
  console.log('🤝 Seeding partners...');

  const partners = [
    { name: 'Air University', logoUrl: '/partners/air-university.png', websiteUrl: 'https://cuiwah.edu.pk', order: 1 },
    { name: 'GDGoC CUI', logoUrl: '/partners/gdgoc-cui-chapter.png', websiteUrl: 'https://developers.google.com/community/gdg/chapters/view/comsats-university-islamabad-wah-campus/', order: 2 },
    { name: 'DataCamp', logoUrl: '/partners/datacamp.png', websiteUrl: 'https://www.datacamp.com/', order: 3 },
    { name: 'GitHub', logoUrl: '/partners/github.png', websiteUrl: 'https://github.com/', order: 4 },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }

  console.log('✅ Partners seeded');

  // ─── SITE SETTINGS ────────────────────────────────────────────────────────
  console.log('⚙️ Seeding site settings...');

  const settings = [
    { key: 'recruitment_status', value: 'closed' },
    { key: 'recruitment_message', value: 'Applications Currently Out of Session' },
    { key: 'recruitment_deadline', value: '' },
    { key: 'instagram_url', value: 'https://instagram.com/gdgoc_cuiwah' },
    { key: 'linkedin_url', value: 'https://linkedin.com/company/gdgoc-cui-wah' },
    { key: 'twitter_url', value: 'https://twitter.com/gdgoc_cuiwah' },
    { key: 'github_url', value: 'https://github.com/gdgoc-cui-wah' },
    { key: 'website_url', value: 'https://gdgoc-cuiwah.com' },
    { key: 'chapter_email', value: 'gdgoc.cuiwah@gmail.com' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Site settings seeded');

  // ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────
  console.log('📢 Seeding announcements...');

  await prisma.announcement.create({
    data: {
      title: 'Core Team Applications Open',
      body: 'Core team applications for the next semester start March 1st.',
      audience: 'member',
      isActive: true,
    },
  });

  console.log('✅ Announcements seeded');

  console.log('\n🎉 Seed complete! All tables populated.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
