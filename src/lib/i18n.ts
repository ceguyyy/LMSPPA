import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            nav: {
                home: "Home",
                catalog: "Training Catalog",
                schedule: "Schedule",
                my_training: "My Training",
                selfLearning: "Self Learning",
                history: "Event History",
                evaluation: "Evaluation Form",
                idp: "IDP"
            },
            journey: {
                title: "Training Journey",
                attendance: "Attendance",
                assessments: "Assessments",
                continue: "Continue Learning",
                locked: "Locked",
                completed: "Completed"
            },
            common: {
                status: "Status",
                action: "Action",
                submit: "Submit"
            }
        }
    },
    id: {
        translation: {
            nav: {
                home: "Beranda",
                catalog: "Katalog Training",
                schedule: "Jadwal",
                my_training: "Pelatihan Saya",
                selfLearning: "Pembelajaran Mandiri",
                history: "Riwayat Event",
                evaluation: "Formulir Evaluasi",
                idp: "IDP"
            },
            journey: {
                title: "Perjalanan Pelatihan",
                attendance: "Kehadiran",
                assessments: "Asesmen",
                continue: "Lanjutkan Belajar",
                locked: "Terkunci",
                completed: "Selesai"
            },
            common: {
                status: "Status",
                action: "Aksi",
                submit: "Kirim"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
