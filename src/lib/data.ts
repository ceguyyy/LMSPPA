// In-memory Stores to replace server.js variables
export const progressStore: Record<string, any> = {};

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    location?: string;
    date?: string;
    code?: string;
    steps: any[];
}

export const lessonsStore: Lesson[] = [
    {
        id: 'module-1',
        title: 'PREVENTIVE MAINTENANCE WHEEL LOADER WA200',
        description: 'Comprehensive guide to daily and periodic maintenance.',
        thumbnail: 'https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017050.jpg',
        location: 'HO',
        date: '18 Mar 2025 - 31 Mar 2025',
        code: 'PLT-E02-5-1',
        steps: [
            {
                id: 'm1-step1',
                type: 'overview',
                title: 'Introduction',
                content: 'Welcome to the Preventive Maintenance course for Wheel Loader WA200. This module covers safety, daily checks, and periodic service intervals.'
            },
            {
                id: 'm1-step2',
                type: 'assessment',
                subtype: 'pre-test',
                title: 'Pre-Test',
                questions: [
                    { id: 'q1', text: 'What is the first step in daily maintenance?', options: ['Check fluid levels', 'Start engine', 'Wash tires'], correct: 0 }
                ]
            },
            {
                id: 'm1-step3',
                type: 'video',
                title: 'Maintenance Video Lesson',
                src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                duration: '10:00',
                config: {
                    lockedSlider: true,
                    lockedQuality: false,
                    completionPercentage: 90,
                    popupQuizzes: [
                        { time: 10, question: 'Pop Quiz: What needs to be checked daily?', options: ['Oil Level', 'Radio'], correct: 0, duration: 30 }
                    ]
                }
            },
            {
                id: 'm1-step4',
                type: 'assessment',
                subtype: 'post-test',
                title: 'Post-Test',
                questions: [
                    { id: 'q1', text: 'How often should the oil filter be changed?', options: ['Daily', 'Weekly', 'Every 500 Hours'], correct: 2 }
                ]
            },
            {
                id: 'm1-step5',
                type: 'evaluation',
                title: 'Course Evaluation',
                description: 'Please answer the following questions to evaluate this training:',
                questions: [
                    { id: 'e1', text: 'Seberapa relevan materi ini dengan pekerjaan Anda?', type: 'multiple-choice', options: ['Sangat Relevan', 'Cukup Relevan', 'Kurang Relevan', 'Tidak Relevan'] },
                    { id: 'e2', text: 'Bagaimana penyampaian instruktur?', type: 'multiple-choice', options: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'] },
                    { id: 'e3', text: 'Apakah fasilitas pelatihan memadai?', type: 'multiple-choice', options: ['Ya, Sangat Memadai', 'Ya, Cukup', 'Tidak Memadai'] }
                ]
            }
        ]
    },
    {
        id: 'module-2',
        title: 'E-GLDP LEADERSHIP SKILL',
        description: 'Leadership training for new managers.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
        location: 'HO',
        date: '16 Sep 2025 - 22 Sep 2025',
        code: 'TRN-ALL-004-00080',
        steps: [
            { id: 'm2-step1', type: 'overview', title: 'Leadership Basics', content: 'Introduction to E-GLDP Core Values.' },
            { id: 'm2-step2', type: 'video', title: 'Leadership Video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '10:53', config: { lockedSlider: false, lockedQuality: false, completionPercentage: 90 } }
        ]
    },
    // --- New Data Starts Here ---
    {
        id: 'module-3',
        title: 'GENERAL SAFETY INDUCTION',
        description: 'Mandatory safety training for all employees.',
        thumbnail: 'https://images.unsplash.com/photo-1547843477-fe989710cc80?w=800&auto=format&fit=crop',
        location: 'Site A',
        date: '01 Jan 2026 - 31 Dec 2026',
        code: 'HSE-GEN-001',
        steps: [
            { id: 'm3-step1', type: 'overview', title: 'Safety First', content: 'Introduction to site safety rules.' },
            { id: 'm3-step2', type: 'video', title: 'Site Hazards', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '15:00', config: { completionPercentage: 100 } }
        ]
    },
    {
        id: 'module-4',
        title: 'BASIC HYDRAULIC SYSTEMS',
        description: 'Understanding the fundamentals of hydraulic power.',
        thumbnail: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop',
        location: 'Workshop B',
        date: '10 Feb 2026 - 12 Feb 2026',
        code: 'TC-HYD-101',
        steps: [
            { id: 'm4-step1', type: 'video', title: 'Hydraulic Principles', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '20:00', config: { completionPercentage: 80 } }
        ]
    },
    {
        id: 'module-5',
        title: 'EFFECTIVE COMMUNICATION',
        description: 'Improving interpersonal communication skills.',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
        location: 'Online',
        date: 'Flexible',
        code: 'SOFT-COM-202',
        steps: [
            { id: 'm5-step1', type: 'video', title: 'Active Listening', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '09:56', config: { completionPercentage: 100 } }
        ]
    },
    {
        id: 'module-6',
        title: 'FIRE SAFETY & EVACUATION',
        description: 'Procedures for fire emergencies.',
        thumbnail: 'https://images.unsplash.com/photo-1579471192801-b5fe95f70a9b?w=800&auto=format&fit=crop',
        location: 'Site A',
        date: 'Monthly',
        code: 'HSE-FIRE-101',
        steps: [
            { id: 'm6-step1', type: 'video', title: 'Evacuation Drills', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '05:00', config: { completionPercentage: 100 } }
        ]
    }
];

// Global Settings Store
export const settingsStore = {
    preventSeeking: false, // Default allowed
};

export const selfLearningStore = [
    {
        id: 'sl-001',
        title: 'TRAINING HANDS-ON LMS',
        code: '003',
        instructor: 'AHMAD IQBAL ZIMAMUL HAWA',
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop', // Monitor/LMS look
        description: 'Dalam training hands-on ini, peserta akan mempelajari cara mengakses, mengelola, dan memanfaatkan fitur utama LMS.',
        modules: [
            {
                id: 'mod-intro',
                title: 'ATTENDANCE & INTRODUCTION LMS',
                content: {
                    type: 'mixed',
                    description: 'Learning Management System Introduction. Learning Management System (LMS) yang dikembangkan untuk memenuhi kebutuhan perusahaan dalam mengelola proses pembelajaran secara terpusat.',
                    files: [
                        { title: 'Learning Management System Introduction', type: 'FILE', description: 'Dokumen ini berisi panduan lengkap tentang penggunaan modul...' }
                    ]
                }
            },
            {
                id: 'mod-opening',
                title: 'OPENING BP. FATHUL MUIN',
                content: {
                    type: 'mixed',
                    description: 'Pembukaan dari Pak Muin',
                    video: {
                        id: 'vid-opening',
                        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // HLS Test
                        duration: '05:00',
                        config: { lockedSlider: false }
                    },
                    files: [
                        { title: 'Opening Session From Fathul Muin', type: 'FILE', description: 'Opening from Fathul Muin (Director)' }
                    ]
                }
            },
            {
                id: 'mod-manual',
                title: 'MANUAL BOOK LMS',
                content: {
                    type: 'mixed',
                    description: 'Pelatihan ini dirancang untuk memberikan pemahaman dan pengalaman langsung dalam menggunakan Learning Management System (LMS).',
                    files: [
                        { title: 'Manual Book - PPA', type: 'FILE', description: 'Dokumen ini berisi panduan lengkap tentang penggunaan modul Competency Management...', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                        { title: 'Manual Book - Modul Competency', type: 'FILE', description: 'Dokumen ini berisi panduan lengkap tentang penggunaan modul...', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                        { title: 'Manual Book - PPA Custom', type: 'FILE', description: 'Dokumen ini berisi panduan lengkap tentang penggunaan modul...', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                    ]
                }
            }
        ]
    },
    {
        id: 'sl-002',
        title: 'GROUP LEADER DEVELOPMENT PROGRAM',
        code: 'TRN-ALL-004-00056',
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
        description: 'Video ini memberikan gambaran umum mengenai Group Leader Development Program (GLDP).',
        modules: [
            {
                id: 'mod-gldp-intro',
                title: 'Introduction to GLDP',
                content: {
                    type: 'mixed',
                    description: 'Overview of the Group Leader Development Program.',
                    video: { id: 'vid-gldp-1', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '05:00', config: { lockedSlider: false } }
                }
            }
        ]
    },
    {
        id: 'sl-003',
        title: 'INTERNALISASI CORE VALUE',
        code: 'TRN-ALL-004-00057',
        rating: 5.0,
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
        description: 'Pelatihan ini membantu Anda memahami dan menghidupkan Core Value perusahaan.',
        modules: [
            {
                id: 'mod-val-1',
                title: 'Living Core Values',
                content: {
                    type: 'mixed',
                    description: 'How to apply core values in daily work.',
                    files: [{ title: 'Core Values Pocket Guide', type: 'FILE', description: 'PDF Guide', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
                }
            }
        ]
    },
    // --- New Data Starts Here ---
    {
        id: 'sl-004',
        title: 'CODE OF CONDUCT',
        code: 'HR-COC-001',
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop',
        instructor: 'HR Department',
        description: 'Guidelines for professional behavior and ethics in the workplace.',
        modules: [
            {
                id: 'mod-coc-1',
                title: 'Code of Conduct',
                content: {
                    type: 'mixed',
                    description: 'Professional ethics and behavior.',
                    files: [{ title: 'CoC Full Document', type: 'FILE', description: 'PDF Policy', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
                }
            }
        ]
    },
    {
        id: 'sl-005',
        title: 'CYBER SECURITY AWARENESS',
        code: 'IT-SEC-101',
        rating: 4.7,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
        instructor: 'IT Security Team',
        description: 'Learn how to protect company data and recognize phishing attempts.',
        modules: [
            {
                id: 'mod-security-1',
                title: 'Password Security',
                content: {
                    type: 'mixed',
                    description: 'Best practices for creating strong passwords.',
                    files: [{ title: 'Password Policy', type: 'FILE', description: 'Company Policy PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
                }
            }
        ]
    },
    {
        id: 'sl-006',
        title: 'PROJECT MANAGEMENT FUNDAMENTALS',
        code: 'PM-101',
        rating: 4.6,
        thumbnail: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop',
        instructor: 'Project Management Office',
        description: 'Key concepts: Scope, Time, Cost, and Quality.',
        modules: [
            {
                id: 'mod-pm-1',
                title: 'Project Lifecycle',
                content: {
                    type: 'mixed',
                    description: 'Phases of project management.',
                    video: { id: 'vid-pm-1', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '12:00', config: { lockedSlider: false } }
                }
            }
        ]
    },
    {
        id: 'sl-007',
        title: 'DATA ANALYSIS WITH EXCEL',
        code: 'SKILL-DATA-002',
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
        instructor: 'Data Team',
        description: 'Master Pivot Tables, VLOOKUP, and Charts.',
        modules: [
            {
                id: 'mod-xl-1',
                title: 'Excel Basics',
                content: {
                    type: 'mixed',
                    description: 'Introduction to data analysis in Excel.',
                    video: { id: 'vid-xl-1', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '15:00', config: { lockedSlider: false } }
                }
            }
        ]
    },
    {
        id: 'sl-008',
        title: 'PUBLIC SPEAKING MASTERY',
        code: 'SOFT-SPEAK-301',
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1475721027767-f43f06e8d024?w=800&auto=format&fit=crop',
        instructor: 'Learning & Development',
        description: 'Overcome fear and deliver impactful presentations.',
        modules: [
            {
                id: 'mod-speak-1',
                title: 'Overcoming Fear',
                content: {
                    type: 'mixed',
                    description: 'Techniques to manage public speaking anxiety.',
                    video: { id: 'vid-speak-1', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '08:00', config: { lockedSlider: false } }
                }
            }
        ]
    }
];
