import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import {
    Star,
    Users,
    ChevronLeft,
    Rocket,
    User,
    BookOpen,
    Zap,
    Award,
    CheckCircle,
} from 'lucide-react';
import { storage } from '@/utils/storage';
import type { TutorProfile } from '@/interfaces';

const TutorManagement = () => {
    // Sử dụng lazy initialization để tránh lỗi setState trong useEffect
    const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(
        null,
    );
    const calculateTutorStats = (tutors: TutorProfile[]) => {
        return tutors.map((tutor) => {
            const sessions = storage.getSessionsForTutor(tutor.id);
            const completed = sessions.filter((s) => s.status === 'completed');
            const rated = sessions.filter((s) => s.review);
            const totalStars = rated.reduce(
                (acc, cur) => acc + (cur.review?.rating || 0),
                0,
            );
            const rating = rated.length
                ? parseFloat((totalStars / rated.length).toFixed(1))
                : 0;

            return {
                ...tutor,
                matchPercentage: tutor.matchPercentage ?? 0,
                totalSessions: completed.length,
                totalReviews: rated.length,
                rating: rating,
            };
        });
    };

    // 1. TÁCH DANH SÁCH THÀNH 2 NHÓM
    const approvedTutors = calculateTutorStats(storage.getAllTutors());

    // Hàm render một thẻ Tutor
    const renderTutorCard = (tutor: TutorProfile) => (
        <div
            key={tutor.id}
            onClick={() => setSelectedTutor(tutor)}
            className={`group relative flex cursor-pointer items-center gap-5 overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md`}
        >
            <div
                className={`h-14 w-14 rounded-xl ${tutor.avatarBg} flex items-center justify-center text-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105`}
            >
                {tutor.name.split(' ').slice(-1)[0][0]}
            </div>

            <div className='flex-1'>
                <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                        {tutor.name}
                    </h3>
                </div>
                <p className='text-sm font-medium text-blue-500'>
                    {tutor.major}
                </p>

                {/* {tutor.status === 'approved' && ( */}
                <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                    <span className='flex items-center gap-1 font-bold text-gray-800'>
                        <Star
                            size={14}
                            className='fill-yellow-400 text-yellow-400'
                        />{' '}
                        {tutor.rating}
                    </span>
                    <span>({tutor.totalReviews} đánh giá)</span>
                    <span className='flex items-center gap-1'>
                        <Users size={14} /> {tutor.totalSessions} buổi học
                    </span>
                </div>
                {/* )} */}
            </div>

            {/* Nút hành động bên phải */}
            <div className='flex flex-col items-end justify-center border-l border-gray-200/50 pl-4'>
                <ChevronLeft className='rotate-180 text-gray-300 transition-colors group-hover:text-blue-500' />
            </div>
        </div>
    );

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-gray-50 p-6 font-sans md:ml-[260px] md:p-8'>
                {!selectedTutor ? (
                    <div className='animate-fade-in pb-10'>
                        <h2 className='mb-6 text-2xl font-bold text-gray-800'>
                            Quản lí Tutor
                        </h2>

                        <div className='mb-10 flex flex-col gap-4'>
                            {approvedTutors.map((tutor) =>
                                renderTutorCard(tutor),
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='animate-fade-in'>
                        <div className='sticky top-0 z-10 mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => setSelectedTutor(null)}
                                    className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-gray-600 transition-all hover:bg-blue-100 hover:text-blue-600'
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <h2 className='text-xl font-bold text-gray-800'>
                                    Thông tin tutor
                                </h2>
                            </div>
                        </div>

                        <div className='mb-6 flex items-center gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div
                                className={`h-16 w-16 rounded-xl ${selectedTutor.avatarBg} flex items-center justify-center text-3xl font-bold text-white shadow-md`}
                            >
                                {selectedTutor.name.split(' ').slice(-1)[0][0]}
                            </div>
                            <div>
                                <div className='flex items-center gap-3'>
                                    <h3 className='text-2xl font-bold text-gray-900'>
                                        {selectedTutor.name}
                                    </h3>
                                </div>
                                <p className='font-medium text-blue-500'>
                                    {selectedTutor.major}
                                </p>
                            </div>
                        </div>

                        <div className='space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm'>
                            <div>
                                <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                    <Rocket
                                        size={20}
                                        className='text-blue-500'
                                    />{' '}
                                    Trình độ chuyên môn
                                </h4>
                                <p className='ml-7 leading-relaxed text-gray-600'>
                                    {selectedTutor.professional}
                                </p>
                            </div>
                            <div>
                                <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                    <User size={20} className='text-blue-500' />{' '}
                                    Lĩnh vực chuyên môn
                                </h4>
                                <p className='ml-7 leading-relaxed text-gray-600'>
                                    {selectedTutor.specialization}
                                </p>
                            </div>
                            <div>
                                <h4 className='mb-3 flex items-center gap-2 font-bold text-gray-800'>
                                    <BookOpen
                                        size={20}
                                        className='text-blue-500'
                                    />{' '}
                                    Môn học hỗ trợ
                                </h4>
                                <div className='ml-7 flex flex-wrap gap-2'>
                                    {selectedTutor.subjects.map((sub, idx) => (
                                        <span
                                            key={idx}
                                            className='rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600'
                                        >
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                    <Zap size={20} className='text-blue-500' />{' '}
                                    Phong cách giảng dạy
                                </h4>
                                <p className='ml-7 text-justify leading-relaxed text-gray-600'>
                                    {selectedTutor.teachingStyle}
                                </p>
                            </div>
                            <div>
                                <h4 className='mb-3 flex items-center gap-2 font-bold text-gray-800'>
                                    <Award
                                        size={20}
                                        className='text-blue-500'
                                    />{' '}
                                    Thành tựu đạt được
                                </h4>
                                <div className='ml-7 flex flex-col gap-2'>
                                    {selectedTutor.achievements.length > 0 ? (
                                        selectedTutor.achievements.map(
                                            (ach, idx) => (
                                                <div
                                                    key={idx}
                                                    className='flex items-center gap-2 text-gray-600'
                                                >
                                                    <CheckCircle
                                                        size={16}
                                                        className='shrink-0 text-green-500'
                                                    />
                                                    <span>{ach}</span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className='italic text-gray-400'>
                                            Chưa cập nhật thông tin
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TutorManagement;
