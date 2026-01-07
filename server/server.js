const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// In-memory Stores
const progressStore = {}
const lessonsStore = [
    {
        id: 'module-1',
        title: 'PREVENTIVE MAINTENANCE WHEEL LOADER WA200',
        description: 'Comprehensive guide to daily and periodic maintenance.',
        // Placeholder image for the dashboard
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
                // HLS Test Stream to demonstrate ABR
                src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                duration: '10:00',
                config: {
                    lockedSlider: true,
                    lockedQuality: false,
                    completionPercentage: 90,
                    popupQuizzes: [
                        { time: 10, question: 'Pop Quiz: What needs to be checked daily?', options: ['Oil Level', 'Radio'], correct: 0 }
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
                    {
                        id: 'e1',
                        text: 'Seberapa relevan materi ini dengan pekerjaan Anda?',
                        type: 'multiple-choice',
                        options: ['Sangat Relevan', 'Cukup Relevan', 'Kurang Relevan', 'Tidak Relevan']
                    },
                    {
                        id: 'e2',
                        text: 'Bagaimana penyampaian instruktur?',
                        type: 'multiple-choice',
                        options: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang']
                    },
                    {
                        id: 'e3',
                        text: 'Apakah fasilitas pelatihan memadai?',
                        type: 'multiple-choice',
                        options: ['Ya, Sangat Memadai', 'Ya, Cukup', 'Tidak Memadai']
                    }
                ]
            }
        ]
    },
    {
        id: 'module-2',
        title: 'E-GLDP LEADERSHIP SKILL',
        description: 'Leadership training for new managers.',
        thumbnail: 'https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149017050.jpg',
        location: 'HO',
        date: '16 Sep 2025 - 22 Sep 2025',
        code: 'TRN-ALL-004-00080',
        steps: [
            {
                id: 'm2-step1',
                type: 'overview',
                title: 'Leadership Basics',
                content: 'Introduction to E-GLDP Core Values.'
            },
            {
                id: 'm2-step2',
                type: 'video',
                title: 'Leadership Video',
                // Fallback MP4
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                duration: '10:53',
                config: { lockedSlider: false, lockedQuality: false, completionPercentage: 90 }
            }
        ]
    }
]

// --- API Endpoints ---

// Lessons
// --- Self Learning Mock Data ---
const selfLearningStore = [
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
        modules: []
    },
    {
        id: 'sl-003',
        title: 'INTERNALISASI CORE VALUE',
        code: 'TRN-ALL-004-00057',
        rating: 5.0,
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
        description: 'Pelatihan ini membantu Anda memahami dan menghidupkan Core Value perusahaan.',
        modules: []
    }
]

app.get('/api/lessons', (req, res) => {
    res.json(lessonsStore)
})

app.get('/api/self-learning', (req, res) => {
    res.json(selfLearningStore)
})

app.post('/api/lessons', (req, res) => {
    const newLesson = req.body
    // Simple validation/id generation could go here
    if (!newLesson.id) {
        newLesson.id = 'lesson-' + Date.now()
    }
    // Update if exists, else add
    const idx = lessonsStore.findIndex(l => l.id === newLesson.id)
    if (idx >= 0) {
        lessonsStore[idx] = newLesson
    } else {
        lessonsStore.push(newLesson)
    }
    console.log('Saved lesson:', newLesson.title)
    res.json({ ok: true, lesson: newLesson })
})

// Progress
app.get('/api/progress/:id', (req, res) => {
    const id = req.params.id
    if (progressStore[id]) return res.json(progressStore[id])
    return res.status(404).json({ message: 'not found' })
})

app.post('/api/progress/:id', (req, res) => {
    const id = req.params.id
    const payload = req.body
    progressStore[id] = payload
    // console.log('saved progress', id, payload)
    res.json({ ok: true })
})

// serve static built frontend if exists
app.use(express.static(path.join(__dirname, '..', 'dist')))

// // Handle Client-side routing by returning index.html for unknown routes
// app.get('*', (req, res) => {
//     // Don't intercept API calls
//     if (req.path.startsWith('/api')) {
//         return res.status(404).json({ message: 'Not Found' })
//     }
//     res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
// })

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Mock server running on', PORT))
