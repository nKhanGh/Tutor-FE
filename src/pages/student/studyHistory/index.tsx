import Sidebar from '@/components/layouts/Sidebar';
import CancellationReasonModal from '@/components/UI/CanellationReasonModal';
import FeedbackModal from '@/components/UI/FeedbackModal';
import SendingFeedbackModal from '@/components/UI/SendingFeedbackModal';
import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal'; // Dùng chung modal chi tiết
import {
    Search,
    Calendar,
    Clock,
    Filter,
    Eye,
    Star,
    FileText,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import type { Session } from '@/interfaces';
import { useNotification } from '@/hooks/useNotification';

const StudyHistory = () => {
    const { user } = useAuth();
    const { showSuccessNotification } = useNotification();

    // --- State ---
    const [sessions, setSessions] = useState<Session[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [visibleCount, setVisibleCount] = useState<number>(10);

    // Modal states
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState<boolean>(false);
    const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] =
        useState<boolean>(false);
    const [isSendingFeedbackModalOpen, setIsSendingFeedbackModalOpen] =
        useState<boolean>(false);

    // --- Fetch Data ---
    useEffect(() => {
        // Sử dụng setTimeout để đẩy việc cập nhật state sang event loop tiếp theo
        // Tránh lỗi: Calling setState synchronously within an effect
        const timer = setTimeout(() => {
            if (user) {
                const allSessions = storage.getSessionsForStudent(user.id);

                // Chỉ lấy các trạng thái lịch sử: completed, cancelled-*
                const history = allSessions.filter((s) =>
                    [
                        'completed',
                        'cancelled-tutor',
                        'cancelled-student',
                    ].includes(s.status),
                );

                // Sắp xếp: Mới nhất lên đầu
                history.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );

                setSessions(history);
                setFilteredSessions(history);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [user]);

    // --- Filter Logic ---
    useEffect(() => {
        const timer = setTimeout(() => {
            let result = sessions;

            // 1. Filter by Status
            if (filterStatus !== 'all') {
                if (filterStatus === 'completed') {
                    result = result.filter((s) => s.status === 'completed');
                } else if (filterStatus === 'cancelled') {
                    result = result.filter((s) =>
                        s.status.includes('cancelled'),
                    );
                }
            }

            // 2. Filter by Search (Subject or Tutor Name)
            if (searchQuery.trim()) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter(
                    (s) =>
                        s.title.toLowerCase().includes(lowerQuery) ||
                        s.tutorName.toLowerCase().includes(lowerQuery),
                );
            }

            setFilteredSessions(result);
            setVisibleCount(10); // Reset pagination khi filter đổi
        }, 0);

        return () => clearTimeout(timer);
    }, [sessions, filterStatus, searchQuery]);

    // --- Handlers ---

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    const handleViewDetail = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    const handleViewReason = (e: React.MouseEvent, session: Session) => {
        e.stopPropagation();
        setSelectedSession(session);
        setIsReasonModalOpen(true);
    };

    const handleOpenSendingFeedback = (
        e: React.MouseEvent,
        session: Session,
    ) => {
        e.stopPropagation();
        setSelectedSession(session);
        setIsSendingFeedbackModalOpen(true);
    };

    const handleViewFeedback = (e: React.MouseEvent, session: Session) => {
        e.stopPropagation();
        setSelectedSession(session);
        setIsViewFeedbackModalOpen(true);
    };

    const handleSubmitFeedback = (
        id: string,
        review: { rating: number; comment: string },
    ) => {
        // Cập nhật state cục bộ để UI phản hồi ngay
        setSessions((prev) =>
            prev.map((s) => {
                if (s.id === id) {
                    return {
                        ...s,
                        review: review,
                        canFeedback: false, // Disable nút feedback sau khi đã gửi
                    };
                }
                return s;
            }),
        );

        // Lưu vào storage (giả lập update)
        // Lưu ý: Trong thực tế cần gọi API update session
        const allSessions = storage.getSessions();
        const idx = allSessions.findIndex((s) => s.id === id);
        if (idx !== -1) {
            allSessions[idx].review = review;
            allSessions[idx].canFeedback = false;
            localStorage.setItem(
                'tutor_app_sessions',
                JSON.stringify(allSessions),
            );
        }

        showSuccessNotification('Cảm ơn bạn đã gửi đánh giá!');
    };

    // --- Render Helpers ---
    const getStatusBadge = (status: Session['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700'>
                        <CheckCircle size={12} /> Hoàn thành
                    </span>
                );
            case 'cancelled-tutor':
            case 'cancelled-student':
                return (
                    <span className='inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700'>
                        <XCircle size={12} /> Đã hủy
                    </span>
                );
            default:
                return null;
        }
    };

    const displayedSessions = filteredSessions.slice(0, visibleCount);

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-3 pt-4 font-bevietnam sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-6'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Lịch sử học tập
                        </h1>
                        <p className='text-base text-gray-600'>
                            Theo dõi quá trình học tập và xem lại các buổi học
                            đã qua.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className='mb-6 flex flex-col gap-4 md:flex-row'>
                        <div className='relative flex-1'>
                            <Search
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='text'
                                placeholder='Tìm kiếm theo môn học, tên Tutor...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            />
                        </div>
                        <div className='relative min-w-[200px]'>
                            <Filter
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                size={18}
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className='w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-8 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            >
                                <option value='all'>Tất cả trạng thái</option>
                                <option value='completed'>Đã hoàn thành</option>
                                <option value='cancelled'>Đã hủy</option>
                            </select>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='border-b border-gray-100 bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Thời gian
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Môn học / Chủ đề
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Tutor hướng dẫn
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Trạng thái
                                        </th>
                                        <th className='px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {displayedSessions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className='py-12 text-center italic text-gray-400'
                                            >
                                                Không tìm thấy buổi học nào
                                                trong lịch sử.
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedSessions.map((session) => (
                                            <tr
                                                key={session.id}
                                                onClick={() =>
                                                    handleViewDetail(session)
                                                }
                                                className='cursor-pointer transition-colors hover:bg-blue-50'
                                            >
                                                <td className='whitespace-nowrap px-6 py-4'>
                                                    <div className='flex items-center gap-2 font-bold text-gray-800'>
                                                        <Calendar
                                                            size={14}
                                                            className='text-[#0795DF]'
                                                        />
                                                        {session.date}
                                                    </div>
                                                    <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                                        <Clock size={12} />{' '}
                                                        {session.time}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div
                                                        className='line-clamp-1 font-semibold text-gray-800'
                                                        title={session.title}
                                                    >
                                                        {session.title}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 text-sm text-gray-600'>
                                                    {session.tutorName}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    {getStatusBadge(
                                                        session.status,
                                                    )}
                                                </td>
                                                <td className='px-6 py-4 text-right'>
                                                    <div className='flex justify-end gap-2'>
                                                        {/* Logic nút bấm dựa trên trạng thái */}
                                                        {session.status ===
                                                        'completed' ? (
                                                            session.review ? (
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        handleViewFeedback(
                                                                            e,
                                                                            session,
                                                                        )
                                                                    }
                                                                    className='inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50'
                                                                >
                                                                    <Star
                                                                        size={
                                                                            12
                                                                        }
                                                                        className='fill-yellow-500 text-yellow-500'
                                                                    />{' '}
                                                                    Xem đánh giá
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        handleOpenSendingFeedback(
                                                                            e,
                                                                            session,
                                                                        )
                                                                    }
                                                                    className='inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 transition-colors hover:bg-yellow-200'
                                                                >
                                                                    <Star
                                                                        size={
                                                                            12
                                                                        }
                                                                    />{' '}
                                                                    Đánh giá
                                                                    ngay
                                                                </button>
                                                            )
                                                        ) : null}

                                                        {(session.status ===
                                                            'cancelled-tutor' ||
                                                            session.status ===
                                                                'cancelled-student') && (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleViewReason(
                                                                        e,
                                                                        session,
                                                                    )
                                                                }
                                                                className='inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100'
                                                            >
                                                                <FileText
                                                                    size={12}
                                                                />{' '}
                                                                Xem lý do
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewDetail(
                                                                    session,
                                                                );
                                                            }}
                                                            className='inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0795DF] transition-colors hover:bg-blue-100'
                                                        >
                                                            <Eye size={12} />{' '}
                                                            Chi tiết
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination / Load More */}
                        {filteredSessions.length > visibleCount && (
                            <div className='border-t border-gray-100 p-4 text-center'>
                                <button
                                    onClick={handleLoadMore}
                                    className='text-sm font-semibold text-[#0795DF] hover:underline'
                                >
                                    Xem thêm các buổi cũ hơn
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 1. Modal xem chi tiết buổi học */}
            <SessionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                session={selectedSession}
            />

            {/* 2. Modal xem lý do hủy */}
            <CancellationReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalOpen(false)}
                session={selectedSession}
            />

            {/* 3. Modal GỬI Feedback (Write) */}
            <SendingFeedbackModal
                isOpen={isSendingFeedbackModalOpen}
                onClose={() => setIsSendingFeedbackModalOpen(false)}
                session={selectedSession}
                onSubmitFeedback={handleSubmitFeedback}
            />

            {/* 4. Modal XEM Feedback (Read-only) */}
            <FeedbackModal
                isOpen={isViewFeedbackModalOpen}
                onClose={() => setIsViewFeedbackModalOpen(false)}
                session={selectedSession}
            />
        </>
    );
};

export default StudyHistory;
