import React, { useState, useEffect } from 'react';
import {
    Search,
    Star,
    Users,
    Rocket,
    BookOpen,
    Award,
    Clock,
    ChevronRight,
    CheckCircle,
    X,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import type { TutorProfile, TutorRequest } from '@/interfaces';
import { getUserInitials } from '@/utils/helpers';

const ChooseTutor: React.FC = () => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(
        null,
    );
    const [showAI, setShowAI] = useState(false);

    // Load Data
    useEffect(() => {
        const timer = setTimeout(() => {
            // 1. Lấy danh sách gốc
            let allTutors = storage.getAllTutors();

            allTutors = allTutors.map((tutor) => {
                const sessions = storage.getSessionsForTutor(tutor.id);
                const completed = sessions.filter(
                    (s) => s.status === 'completed',
                );
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
                    totalSessions: completed.length,
                    totalReviews: rated.length,
                    rating: rating,
                };
            });

            if (user) {
                setRequests(storage.getRequestsByStudent(user.id));

                // 2. Nếu đang bật AI, tính toán matchPercentage và sort
                if (showAI) {
                    const reg = storage.getRegistrationByStudentId(user.id);
                    if (reg) {
                        // Tính điểm lại cho toàn bộ list (vì getRecommendedTutors chỉ trả về top 3)
                        const topPicks = storage.getRecommendedTutors(user.id);

                        allTutors = allTutors
                            .map((t) => {
                                const foundTop = topPicks.find(
                                    (top) => top.id === t.id,
                                );
                                if (foundTop) return foundTop;
                                return {
                                    ...t,
                                    matchPercentage: Math.floor(
                                        Math.random() * 50,
                                    ),
                                }; // Random thấp cho người không thuộc top
                            })
                            .sort(
                                (a, b) =>
                                    (b.matchPercentage || 0) -
                                    (a.matchPercentage || 0),
                            );
                    }
                }
            }
            setTutors(allTutors);
        }, 0);
        return () => clearTimeout(timer);
    }, [user, showAI]);

    // Logic xử lý yêu cầu ghép cặp
    const handleRequestPairing = (tutor: TutorProfile) => {
        if (!user) return;

        // Check đã request chưa
        const exists = requests.find(
            (r) => r.tutorId === tutor.id && r.status === 'pending',
        );
        if (exists) {
            showErrorNotification('Bạn đã gửi yêu cầu cho Tutor này rồi.');
            return;
        }

        const newReq: TutorRequest = {
            id: `TR-${Date.now()}`,
            studentId: user.id,
            studentName: user.name,
            tutorId: tutor.id,
            tutorName: tutor.name,
            status: 'pending',
            requestContent: 'Mong muốn được Tutor hỗ trợ môn học.',
            createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        if (storage.createTutorRequest(newReq)) {
            setRequests((prev) => [...prev, newReq]);
            showSuccessNotification(
                `Đã gửi yêu cầu ghép cặp đến ${tutor.name}`,
            );
            setSelectedTutor(null); // Đóng modal
        } else {
            showErrorNotification('Lỗi khi gửi yêu cầu.');
        }
    };

    // Helper check status
    const getRequestStatus = (tutorId: string) => {
        const req = requests.find((r) => r.tutorId === tutorId);
        return req ? req.status : null; // 'pending' | 'accepted' | 'rejected' | null
    };

    // Filter Tutors
    const filteredTutors = tutors.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subjects.some((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
    );

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 font-bevietnam sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>
                                Lựa chọn Tutor
                            </h1>
                            <p className='text-gray-600'>
                                Tìm kiếm người hướng dẫn phù hợp nhất với mục
                                tiêu của bạn.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAI(!showAI)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold transition-all ${showAI ? 'border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Star
                                size={18}
                                className={
                                    showAI
                                        ? 'fill-yellow-300 text-yellow-300'
                                        : ''
                                }
                            />
                            {showAI ? 'Gợi ý AI Đang Bật' : 'Bật Gợi ý AI'}
                        </button>
                    </div>

                    {/* Search */}
                    <div className='mb-6 rounded-xl bg-white p-4 shadow-sm'>
                        <div className='relative'>
                            <Search
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='text'
                                className='w-full rounded-lg border border-gray-200 py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Tìm kiếm theo tên Tutor, môn học, kỹ năng...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tutor List */}
                    <div className='space-y-4'>
                        {filteredTutors.map((tutor) => {
                            const status = getRequestStatus(tutor.id);
                            return (
                                <div
                                    key={tutor.id}
                                    className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
                                >
                                    <div className='flex flex-col items-start gap-6 md:flex-row'>
                                        {/* Avatar */}
                                        <div
                                            className={`flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl text-2xl font-bold text-white ${!tutor.avatar ? tutor.avatarBg || 'bg-gray-400' : ''}`}
                                        >
                                            {tutor.avatar ? (
                                                <img
                                                    src={tutor.avatar}
                                                    alt={tutor.name}
                                                    className='h-full w-full object-cover'
                                                />
                                            ) : (
                                                getUserInitials(tutor.name)
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className='w-full flex-1'>
                                            <div className='mb-2 flex items-start justify-between'>
                                                <div>
                                                    <h3 className='text-xl font-bold text-gray-800'>
                                                        {tutor.name}
                                                    </h3>
                                                    <p className='text-sm font-medium text-[#0795DF]'>
                                                        {tutor.major}
                                                    </p>
                                                </div>
                                                {/* Hiển thị Badge AI nếu showAI bật và có điểm cao */}
                                                {showAI &&
                                                    tutor.matchPercentage &&
                                                    tutor.matchPercentage >
                                                        60 && (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                                tutor.matchPercentage >
                                                                85
                                                                    ? 'bg-purple-100 text-purple-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                            }`}
                                                        >
                                                            {
                                                                tutor.matchPercentage
                                                            }
                                                            % Phù hợp
                                                        </span>
                                                    )}
                                            </div>

                                            <div className='mb-4 flex flex-wrap gap-4 text-sm text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <Star
                                                        size={14}
                                                        className='fill-yellow-400 text-yellow-400'
                                                    />{' '}
                                                    {tutor.rating} (
                                                    {tutor.totalReviews} đánh
                                                    giá)
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Users size={14} />{' '}
                                                    {tutor.totalSessions} buổi
                                                    dạy
                                                </span>
                                            </div>

                                            <div className='mb-4 flex flex-wrap gap-2'>
                                                {tutor.subjects.map((sub) => (
                                                    <span
                                                        key={sub}
                                                        className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                                                    >
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className='flex justify-end gap-3'>
                                                {status === 'pending' ? (
                                                    <span className='flex cursor-default items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-600'>
                                                        <Clock size={16} /> Đã
                                                        gửi yêu cầu
                                                    </span>
                                                ) : status === 'accepted' ? (
                                                    <span className='flex cursor-default items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-600'>
                                                        <CheckCircle
                                                            size={16}
                                                        />{' '}
                                                        Đã ghép cặp
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            setSelectedTutor(
                                                                tutor,
                                                            )
                                                        }
                                                        className='flex items-center gap-1 text-sm font-bold text-[#0795DF] hover:underline'
                                                    >
                                                        Xem chi tiết{' '}
                                                        <ChevronRight
                                                            size={16}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tutor Detail Modal */}
            {selectedTutor && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white'>
                        <div className='relative h-32 bg-gradient-to-r from-[#0795DF] to-[#00C0EF]'>
                            <button
                                onClick={() => setSelectedTutor(null)}
                                className='absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30'
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className='px-8 pb-8'>
                            <div className='relative -mt-12 mb-4'>
                                <div
                                    className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white text-3xl font-bold text-white ${!selectedTutor.avatar ? selectedTutor.avatarBg || 'bg-gray-400' : ''}`}
                                >
                                    {selectedTutor.avatar ? (
                                        <img
                                            src={selectedTutor.avatar}
                                            alt={selectedTutor.name}
                                            className='h-full w-full object-cover'
                                        />
                                    ) : (
                                        getUserInitials(selectedTutor.name)
                                    )}
                                </div>
                            </div>

                            <h2 className='text-2xl font-bold text-gray-800'>
                                {selectedTutor.name}
                            </h2>
                            <p className='mb-6 text-gray-500'>
                                {selectedTutor.major}
                            </p>

                            <div className='space-y-6'>
                                <div>
                                    <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                        <Rocket
                                            size={18}
                                            className='text-blue-500'
                                        />{' '}
                                        Giới thiệu
                                    </h4>
                                    <p className='text-sm leading-relaxed text-gray-600'>
                                        {selectedTutor.bio}
                                    </p>
                                </div>

                                <div>
                                    <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                        <BookOpen
                                            size={18}
                                            className='text-blue-500'
                                        />{' '}
                                        Chuyên môn
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        {selectedTutor.specialization}
                                    </p>
                                </div>

                                <div>
                                    <h4 className='mb-2 flex items-center gap-2 font-bold text-gray-800'>
                                        <Award
                                            size={18}
                                            className='text-blue-500'
                                        />{' '}
                                        Thành tựu
                                    </h4>
                                    <ul className='list-inside list-disc text-sm text-gray-600'>
                                        {selectedTutor.achievements.map((a) => (
                                            <li key={a}>{a}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className='grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4'>
                                    <div>
                                        <span className='block text-xs font-bold uppercase text-gray-500'>
                                            Lịch dạy
                                        </span>
                                        <span className='text-sm font-semibold text-gray-800'>
                                            {selectedTutor.scheduleDescription}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='block text-xs font-bold uppercase text-gray-500'>
                                            Hình thức
                                        </span>
                                        <span className='text-sm font-semibold text-gray-800'>
                                            {selectedTutor.availableFormats.join(
                                                ', ',
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-8 flex gap-4'>
                                <button
                                    onClick={() => setSelectedTutor(null)}
                                    className='flex-1 rounded-xl border border-gray-300 py-3 font-bold text-gray-600 hover:bg-gray-50'
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() =>
                                        handleRequestPairing(selectedTutor)
                                    }
                                    className='flex-1 rounded-xl bg-[#0795DF] py-3 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-600'
                                >
                                    Gửi yêu cầu ghép cặp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChooseTutor;
