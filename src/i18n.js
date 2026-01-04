
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Mock translations for now, will expand later
const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "catalog": "Training Catalog",
                "schedule": "Schedule",
                "my_training": "My Training",
                "history": "Event History"
            },
            "journey": {
                "title": "Training Journey",
                "attendance": "Attendance",
                "assessments": "Assessments",
                "continue": "Continue Learning",
                "locked": "Locked",
                "completed": "Completed"
            },
            "common": {
                "status": "Status",
                "action": "Action",
                "submit": "Submit"
            }
        }
    },
    id: {
        translation: {
            "nav": {
                "home": "Beranda",
                "catalog": "Katalog Training",
                "schedule": "Jadwal",
                "my_training": "Pelatihan Saya",
                "history": "Riwayat Event"
            },
            "journey": {
                "title": "Perjalanan Pelatihan",
                "attendance": "Kehadiran",
                "assessments": "Asesmen",
                "continue": "Lanjutkan Belajar",
                "locked": "Terkunci",
                "completed": "Selesai"
            },
            "common": {
                "status": "Status",
                "action": "Aksi",
                "submit": "Kirim"
            }
        }
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false
        }
    })

export default i18n
