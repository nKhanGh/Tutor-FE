import React, { useState, useEffect, useCallback } from 'react';
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
    Mail,
    Phone,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import type { TutorProfile, TutorRequest } from '@/interfaces';
import { getUserInitials } from '@/utils/helpers';
import Loading from '@/components/UI/Loading';

const ChooseTutor: React.FC = () => {
    const { user } = useAuth();
    const {
        showSuccessNotification,
        showErrorNotification,
        showInfoNotification,
    } = useNotification();

    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [requests, setRequests] = useState<TutorRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [showAI, setShowAI] = useState(false);

    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [registeredSubjects, setRegisteredSubjects] = useState<string[]>([]);

    const handleConfirmSubject = () => {
        if (selectedSubjects.length === 0) {
            showErrorNotification('Vui lòng chọn ít nhất một môn học!');
            return;
        }

        if (!user || !selectedTutor) return;

        try {
            // Tạo teaching period cho từng môn học được chọn
            selectedSubjects.forEach((subject) => {
                storage.startTeachingPeriod(selectedTutor.id, user.id, subject);
            });

            showSuccessNotification(
                `Đã chọn Tutor ${selectedTutor.name} cho ${selectedSubjects.length} môn học!`,
            );
            setShowSubjectModal(false);
            setSelectedTutor(null);
            setSelectedSubjects([]);
            fetchRegisteredSubjects();
        } catch (error) {
            showErrorNotification('Có lỗi xảy ra khi tạo lịch học!');
            console.error(error);
        }
    };

    const getRegisteredSubjectsWithTutor = (tutorId: string) => {
        if (!user) return [];
        const periods = storage.getTeachingActivePeriodsForStudent(user.id);
        return periods
            .filter((p) => p.tutorId === tutorId)
            .map((p) => p.subject);
    };

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject],
        );
    };

    // Load Data
    const fetchRegisteredSubjects = useCallback(() => {
        if (user) {
            const subjects = storage
                .getTeachingActivePeriodsForStudent(user.id)
                .map((p) => p.subject);
            setRegisteredSubjects(subjects);
        }
    }, [user]);

    // Load Data - Sửa để tránh setState trực tiếp
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setTutors([]);

            // Delay để tránh cascading render
            await new Promise((resolve) => setTimeout(resolve, 0));

            let allTutors = storage.getAllTutors();
            console.log('Fetched Tutors:', allTutors);

            if (user) {
                setRequests(storage.getRequestsByStudent(user.id));

                if (showAI) {
                    const reg = storage.getRegistrationByStudentId(user.id);
                    if (reg) {
                        const topPicks = storage.getRecommendedTutors(user.id);
                        console.log('Top Picks from AI:', topPicks);
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
                                };
                            })
                            .sort(
                                (a, b) =>
                                    (b.matchPercentage || 0) -
                                    (a.matchPercentage || 0),
                            );
                    } else {
                        showInfoNotification(
                            'Vui lòng hoàn thành đăng ký học tập để sử dụng tính năng gợi ý AI.',
                        );
                        setShowAI(false);
                        setLoading(false);
                        return;
                    }
                }
            }

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

            setTutors(allTutors);
            setLoading(false);
        };

        loadData();
    }, [user, showAI, showInfoNotification]);

    // Load registered subjects
    useEffect(() => {
        fetchRegisteredSubjects();
    }, [fetchRegisteredSubjects]);

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
                            onClick={() => {
                                setShowAI(!showAI);
                                setLoading(true);
                            }}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold transition-all ${showAI ? 'border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {loading ? (
                                <Loading size='sm' className='text-white' />
                            ) : (
                                <>
                                    <Star
                                        size={18}
                                        className={
                                            showAI
                                                ? 'fill-yellow-300 text-yellow-300'
                                                : ''
                                        }
                                    />
                                    {showAI
                                        ? 'Gợi ý AI Đang Bật'
                                        : 'Bật Gợi ý AI'}
                                </>
                            )}
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
                    {loading ? (
                        <div className='pt-12'>
                            <Loading size='xl' />
                        </div>
                    ) : null}
                    <div className='space-y-4'>
                        {filteredTutors.map((tutor) => {
                            const status = getRequestStatus(tutor.id);
                            const registeredWithThisTutor =
                                getRegisteredSubjectsWithTutor(tutor.id);
                            const hasRegistered =
                                registeredWithThisTutor.length > 0;

                            return (
                                <div
                                    key={tutor.id}
                                    className='group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
                                >
                                    {/* Thẻ thông báo đã đăng ký - hiện khi hover */}

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
                                                    tutor.matchPercentage && (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                                tutor.matchPercentage >
                                                                80
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
                                    {hasRegistered && (
                                        <div className='z-10 hidden max-w-3xl rounded-lg border-[2px] border-green-500 px-2 py-1 text-sm font-semibold text-green-500 shadow-lg group-hover:inline-block'>
                                            <div className='flex items-center gap-2'>
                                                <CheckCircle size={16} />
                                                <span>
                                                    Bạn đã đăng ký{' '}
                                                    {
                                                        registeredWithThisTutor.length
                                                    }{' '}
                                                    môn với tutor này:{' '}
                                                    {registeredWithThisTutor.join(
                                                        ', ',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tutor Detail Modal */}
            {selectedTutor && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white'>
                        <div className='relative bg-gradient-to-r from-blue-500 to-cyan-400 p-8'>
                            <button
                                onClick={() => setSelectedTutor(null)}
                                className='absolute right-4 top-4 rounded-lg p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20'
                            >
                                <X size={24} />
                            </button>
                            <div className='flex items-center gap-4 text-white'>
                                <div
                                    className={`h-20 w-20 ${selectedTutor.avatarBg} flex items-center justify-center rounded-2xl text-3xl font-bold`}
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
                                <div>
                                    <h2 className='mb-1 text-2xl font-bold'>
                                        {selectedTutor.name}
                                    </h2>
                                    <p className='text-blue-100'>
                                        {selectedTutor.role === 'tutor'
                                            ? 'Giảng viên'
                                            : 'Sinh viên'}{' '}
                                        - {selectedTutor.major}
                                    </p>
                                    <div className='mt-2 flex items-center gap-4'>
                                        <span className='flex items-center gap-1'>
                                            <Star size={16} fill='white' />
                                            {selectedTutor.rating}/5.0
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <Users size={16} />
                                            {selectedTutor.totalSessions} buổi
                                            học
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='p-8'>
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <Rocket
                                        className='text-blue-500'
                                        size={20}
                                    />
                                    <h3 className='font-bold text-gray-800'>
                                        Trình độ chuyên môn
                                    </h3>
                                </div>
                                {selectedTutor?.professional?.length !== 0 &&
                                    selectedTutor?.professional?.map((prof) => (
                                        <p
                                            key={prof}
                                            className='ml-7 text-gray-700'
                                        >
                                            {prof}
                                        </p>
                                    ))}
                            </div>

                            {/* Specialization */}
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <Users
                                        className='text-blue-500'
                                        size={20}
                                    />
                                    <h3 className='font-bold text-gray-800'>
                                        Lĩnh vực chuyên môn
                                    </h3>
                                </div>
                                <p className='ml-7 text-gray-700'>
                                    {selectedTutor.specialization}
                                </p>
                            </div>

                            {/* Subjects */}
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <BookOpen
                                        className='text-blue-500'
                                        size={20}
                                    />
                                    <h3 className='font-bold text-gray-800'>
                                        Môn học hỗ trợ
                                    </h3>
                                </div>
                                <div className='ml-7 flex flex-wrap gap-2'>
                                    {selectedTutor.subjects.map((subject) => (
                                        <span
                                            key={subject}
                                            className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600'
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Teaching Style */}
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <Star className='text-blue-500' size={20} />
                                    <h3 className='font-bold text-gray-800'>
                                        Phong cách giảng dạy
                                    </h3>
                                </div>
                                <p className='ml-7 text-gray-700'>
                                    {selectedTutor.teachingStyle}
                                </p>
                            </div>

                            {/* Achievements */}
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <Award
                                        className='text-blue-500'
                                        size={20}
                                    />
                                    <h3 className='font-bold text-gray-800'>
                                        Thành tựu đạt được
                                    </h3>
                                </div>
                                <div className='ml-7 space-y-2'>
                                    {selectedTutor.achievements.map(
                                        (achievement) => (
                                            <div
                                                key={achievement}
                                                className='flex items-center gap-2 text-gray-700'
                                            >
                                                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                                {achievement}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className='mb-6'>
                                <div className='mb-3 flex items-center gap-2'>
                                    <Clock
                                        className='text-blue-500'
                                        size={20}
                                    />
                                    <h3 className='font-bold text-gray-800'>
                                        Lịch rảnh tuần này
                                    </h3>
                                </div>
                                <p className='ml-7 text-gray-700'>
                                    {selectedTutor.scheduleDescription}
                                </p>
                                <div className='ml-7 mt-2 space-y-1'>
                                    {selectedTutor.availableFormats.map(
                                        (format) => (
                                            <div
                                                key={format}
                                                className='flex items-center gap-2 text-gray-700'
                                            >
                                                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                                {format === 'Offline'
                                                    ? 'Trực tiếp tại trường'
                                                    : 'Trực tuyến qua Zoom hoặc Google Meet'}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className='mb-6'>
                                <h3 className='mb-3 font-bold text-gray-800'>
                                    Liên hệ
                                </h3>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <Mail
                                            className='text-blue-600'
                                            size={20}
                                        />
                                        <span className='text-gray-800'>
                                            {selectedTutor.contactInfo[0]}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Phone
                                            className='text-blue-600'
                                            size={20}
                                        />
                                        <span className='text-gray-800'>
                                            {selectedTutor.contactInfo[1]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='mt-8 flex gap-4'>
                                <button
                                    onClick={() => setShowSubjectModal(true)}
                                    className='flex-1 rounded-lg bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600'
                                >
                                    Chọn Tutor này
                                </button>
                                <button
                                    onClick={() => setSelectedTutor(null)}
                                    className='rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSubjectModal && selectedTutor && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-xl font-bold text-gray-800'>
                                Chọn môn học
                            </h3>
                            <button
                                onClick={() => {
                                    setShowSubjectModal(false);
                                    setSelectedSubjects([]);
                                }}
                                className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100'
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className='mb-4 text-sm text-gray-600'>
                            Chọn môn học bạn muốn học với{' '}
                            <span className='font-semibold'>
                                {selectedTutor.name}
                            </span>
                        </p>

                        <div className='mb-6 space-y-2'>
                            {selectedTutor.subjects.map((subject) => (
                                <label
                                    key={subject}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                        selectedSubjects.includes(subject)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type='checkbox'
                                        name='subject'
                                        value={subject}
                                        checked={
                                            selectedSubjects.includes(
                                                subject,
                                            ) ||
                                            registeredSubjects.includes(subject)
                                        }
                                        disabled={registeredSubjects.includes(
                                            subject,
                                        )}
                                        onChange={() => toggleSubject(subject)}
                                        className='h-4 w-4 text-blue-600'
                                    />
                                    <span className='font-medium text-gray-800'>
                                        {subject}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={handleConfirmSubject}
                                disabled={selectedSubjects.length === 0}
                                className={`flex-1 rounded-lg py-3 font-semibold text-white transition-colors ${
                                    selectedSubjects.length > 0
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'cursor-not-allowed bg-gray-300'
                                }`}
                            >
                                Xác nhận ({selectedSubjects.length} môn)
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubjectModal(false);
                                    setSelectedSubjects([]);
                                }}
                                className='rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChooseTutor;
