import { SelfLearningCourseDetail } from '@/components/SelfLearning';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    return <SelfLearningCourseDetail id={id} />;
}
