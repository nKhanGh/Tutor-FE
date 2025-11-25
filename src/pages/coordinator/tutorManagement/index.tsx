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
    Clock,
    AlertCircle,
} from 'lucide-react';
import { mockTutorProfiles, type TutorDetail } from '@/interfaces/Coordinator';
import { useLocation } from 'react-router-dom';

const TutorManagement = () => {
    const location = useLocation();
    // Sử dụng lazy initialization để tránh lỗi setState trong useEffect
    const [selectedTutor, setSelectedTutor] = useState<TutorDetail | null>(
        () => {
            const targetId = location.state?.openProfileId;
            if (targetId) {
                const foundTutor = mockTutorProfiles.find(
                    (t) => t.id === targetId,
                );
                if (foundTutor) {
                    // Xóa state để không bị mở lại khi F5
                    window.history.replaceState({}, document.title);
                    return foundTutor;
                }
            }
            return null;
        },
    );

    // 1. TÁCH DANH SÁCH THÀNH 2 NHÓM
    const approvedTutors = mockTutorProfiles.filter(
        (t) => t.status === 'approved',
    );
    const pendingTutors = mockTutorProfiles.filter(
        (t) => t.status === 'pending',
    );

    // Hàm render một thẻ Tutor
    const renderTutorCard = (tutor: TutorDetail) => (
        <div
            key={tutor.id}
            onClick={() => setSelectedTutor(tutor)}
            className={`group relative flex cursor-pointer items-center gap-5 overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${tutor.status === 'pending' ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-white'}`}
        >
            <div
                className={`h-14 w-14 rounded-xl ${tutor.avatarColor} flex items-center justify-center text-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105`}
            >
                {tutor.initial}
            </div>

            <div className='flex-1'>
                <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                        {tutor.name}
                    </h3>
                    {/* Nhãn trạng thái nhỏ bên cạnh tên nếu là Pending */}
                    {tutor.status === 'pending' && (
                        <span className='rounded-full bg-orange-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-800'>
                            Mới
                        </span>
                    )}
                </div>
                <p className='text-sm font-medium text-blue-500'>
                    {tutor.title}
                </p>

                {tutor.status === 'approved' && (
                    <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                        <span className='flex items-center gap-1 font-bold text-gray-800'>
                            <Star
                                size={14}
                                className='fill-yellow-400 text-yellow-400'
                            />{' '}
                            {tutor.rating}
                        </span>
                        <span>({tutor.reviewCount} đánh giá)</span>
                        <span className='flex items-center gap-1'>
                            <Users size={14} /> {tutor.lessonCount} buổi học
                        </span>
                    </div>
                )}
            </div>

            {/* Nút hành động bên phải */}
            <div className='flex flex-col items-end justify-center border-l border-gray-200/50 pl-4'>
                {tutor.status === 'pending' ? (
                    <div className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm'>
                        <Clock size={14} /> Duyệt ngay
                    </div>
                ) : (
                    <ChevronLeft className='rotate-180 text-gray-300 transition-colors group-hover:text-blue-500' />
                )}
            </div>
        </div>
    );

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-gray-50 p-6 font-sans md:ml-[260px] md:p-8'>
                {/* --- VIEW 1: DANH SÁCH TUTOR --- */}
                {!selectedTutor ? (
                    <div className='animate-fade-in pb-10'>
                        <h2 className='mb-6 text-2xl font-bold text-gray-800'>
                            Quản lí Tutor
                        </h2>

                        {/* 2. DANH SÁCH ĐÃ DUYỆT (Ở TRÊN) */}
                        <div className='mb-10 flex flex-col gap-4'>
                            {approvedTutors.map((tutor) =>
                                renderTutorCard(tutor),
                            )}
                        </div>

                        {/* 3. DANH SÁCH CHỜ DUYỆT (ĐẨY XUỐNG DƯỚI) */}
                        {pendingTutors.length > 0 && (
                            <div>
                                {/* Ô Chờ xác nhận (Tiêu đề) */}
                                <div className='mb-4 flex w-fit items-center gap-2 rounded-lg border border-orange-200 bg-orange-100 px-4 py-2 text-orange-700'>
                                    <AlertCircle size={20} />
                                    <h3 className='text-lg font-bold'>
                                        Hồ sơ chờ xác nhận (
                                        {pendingTutors.length})
                                    </h3>
                                </div>

                                <div className='flex flex-col gap-4'>
                                    {pendingTutors.map((tutor) =>
                                        renderTutorCard(tutor),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* --- VIEW 2: CHI TIẾT TUTOR --- */
                    <div className='animate-fade-in'>
                        <div className='sticky top-4 z-10 mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
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

                            {/* Nút Duyệt/Từ chối */}
                            {selectedTutor.status === 'pending' && (
                                <div className='flex gap-3'>
                                    <button className='rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100'>
                                        Từ chối
                                    </button>
                                    <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700'>
                                        <CheckCircle size={16} /> Duyệt hồ sơ
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className='mb-6 flex items-center gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div
                                className={`h-16 w-16 rounded-xl ${selectedTutor.avatarColor} flex items-center justify-center text-3xl font-bold text-white shadow-md`}
                            >
                                {selectedTutor.initial}
                            </div>
                            <div>
                                <div className='flex items-center gap-3'>
                                    <h3 className='text-2xl font-bold text-gray-900'>
                                        {selectedTutor.name}
                                    </h3>
                                    {selectedTutor.status === 'pending' && (
                                        <span className='rounded-md border border-orange-200 bg-orange-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-orange-700'>
                                            Chờ duyệt
                                        </span>
                                    )}
                                </div>
                                <p className='font-medium text-blue-500'>
                                    {selectedTutor.title}
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
                                    {selectedTutor.education}
                                </p>
                            </div>
                            <div>
                                <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                    <User size={20} className='text-blue-500' />{' '}
                                    Lĩnh vực chuyên môn
                                </h4>
                                <p className='ml-7 leading-relaxed text-gray-600'>
                                    {selectedTutor.expertise}
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
