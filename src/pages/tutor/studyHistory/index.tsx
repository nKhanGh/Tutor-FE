import Sidebar from '@/components/layouts/Sidebar';
import CancellationReasonModal from '@/components/UI/CanellationReasonModal';
import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal';
import AddProgressModal from '@/components/UI/tutor/AddProgressModal';
import {
    Search,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Filter,
    FileText,
    Plus,
    Eye,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { getUserInitials } from '@/utils/helpers';
import type { Session } from '@/interfaces';

const TutorStudyHistory = () => {
    const { user } = useAuth();

    // --- State quản lý dữ liệu ---
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
    const [isAddProgressModalOpen, setIsAddProgressModalOpen] =
        useState<boolean>(false);

    // --- Fetch Data Function (Tách ra để tái sử dụng) ---
    const fetchData = useCallback(() => {
        // Sử dụng setTimeout để tránh lỗi "setState synchronously within an effect"
        setTimeout(() => {
            if (user) {
                // Lấy tất cả session của Tutor
                const all = storage.getSessionsForTutor(user.id);

                // Lọc ra những buổi đã kết thúc hoặc bị hủy (History)
                const history = all.filter((s) =>
                    [
                        'completed',
                        'cancelled-tutor',
                        'cancelled-student',
                    ].includes(s.status),
                );

                // Sort mới nhất trước
                history.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );
                setSessions(history);
            }
        }, 0);
    }, [user]);

    // --- Initial Fetch ---
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Filter Logic (Chạy khi sessions hoặc filter thay đổi) ---
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
                        s.studentName.toLowerCase().includes(lowerQuery),
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

    // Mở modal chi tiết
    const handleViewDetail = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    // Mở modal xem lý do hủy
    const handleViewReason = (e: React.MouseEvent, session: Session) => {
        e.stopPropagation();
        setSelectedSession(session);
        setIsReasonModalOpen(true);
    };

    // Mở modal thêm biên bản/tiến độ
    const handleAddProgress = (e: React.MouseEvent, session: Session) => {
        e.stopPropagation();
        setSelectedSession(session); // Set session hiện tại để truyền vào modal
        setIsAddProgressModalOpen(true);
    };

    // Helper render badge trạng thái
    const getStatusBadge = (status: string) => {
        if (status === 'completed')
            return (
                <span className='flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'>
                    <CheckCircle size={12} /> Hoàn thành
                </span>
            );
        if (status.includes('cancelled'))
            return (
                <span className='flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700'>
                    <XCircle size={12} /> Đã hủy
                </span>
            );
        return null;
    };

    const displayedSessions = filteredSessions.slice(0, visibleCount);

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-3 pt-4 font-bevietnam sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-6'>
                        <h1 className='mb-2 text-2xl font-bold text-gray-800'>
                            Lịch sử giảng dạy
                        </h1>
                        <p className='text-gray-600'>
                            Xem lại các buổi học đã diễn ra và quản lý biên bản
                            học tập.
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className='mb-6 flex flex-col gap-4 md:flex-row'>
                        <div className='relative flex-1'>
                            <Search
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='text'
                                placeholder='Tìm kiếm theo môn học, tên sinh viên...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='relative'>
                            <Filter
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                size={18}
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className='cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                            >
                                <option value='all'>Tất cả trạng thái</option>
                                <option value='completed'>Đã hoàn thành</option>
                                <option value='cancelled'>Đã hủy</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='border-b border-gray-100 bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Sinh viên
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Thời gian
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            Chủ đề / Môn học
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
                                                className='py-8 text-center italic text-gray-400'
                                            >
                                                Không tìm thấy buổi học nào phù
                                                hợp.
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedSessions.map((session) => {
                                            // Lấy thông tin sinh viên để hiển thị Avatar
                                            const studentInfo =
                                                storage.getUserById(
                                                    session.studentId,
                                                );
                                            const hasAvatar =
                                                !!studentInfo?.avatar;

                                            return (
                                                <tr
                                                    key={session.id}
                                                    onClick={() =>
                                                        handleViewDetail(
                                                            session,
                                                        )
                                                    }
                                                    className='cursor-pointer transition-colors hover:bg-blue-50'
                                                >
                                                    {/* Cột Sinh viên (Avatar + Tên) */}
                                                    <td className='whitespace-nowrap px-6 py-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <div
                                                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 text-xs font-bold text-white shadow-sm ${!hasAvatar ? studentInfo?.avatarBg || 'bg-gray-400' : ''}`}
                                                            >
                                                                {hasAvatar ? (
                                                                    <img
                                                                        src={
                                                                            studentInfo?.avatar
                                                                        }
                                                                        alt='Student Avatar'
                                                                        className='h-full w-full object-cover'
                                                                    />
                                                                ) : (
                                                                    getUserInitials(
                                                                        session.studentName,
                                                                    )
                                                                )}
                                                            </div>
                                                            <div className='flex flex-col'>
                                                                <span className='text-sm font-semibold text-gray-800'>
                                                                    {
                                                                        session.studentName
                                                                    }
                                                                </span>
                                                                {studentInfo?.username && (
                                                                    <span className='text-xs text-gray-500'>
                                                                        {
                                                                            studentInfo.username
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Cột Thời gian */}
                                                    <td className='whitespace-nowrap px-6 py-4'>
                                                        <div className='flex items-center gap-2 text-sm font-bold text-gray-800'>
                                                            <Calendar
                                                                size={14}
                                                                className='text-blue-500'
                                                            />
                                                            {session.date}
                                                        </div>
                                                        <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                                            <Clock size={12} />{' '}
                                                            {session.time}
                                                        </div>
                                                    </td>

                                                    {/* Cột Môn học */}
                                                    <td className='px-6 py-4'>
                                                        <div
                                                            className='line-clamp-1 text-sm font-semibold text-gray-800'
                                                            title={
                                                                session.title
                                                            }
                                                        >
                                                            {session.title}
                                                        </div>
                                                        <div className='text-xs text-gray-500'>
                                                            {session.type ===
                                                            'online'
                                                                ? 'Trực tuyến'
                                                                : session.locationOrLink}
                                                        </div>
                                                    </td>

                                                    {/* Cột Trạng thái */}
                                                    <td className='px-6 py-4'>
                                                        {getStatusBadge(
                                                            session.status,
                                                        )}
                                                    </td>

                                                    {/* Cột Hành động */}
                                                    <td className='px-6 py-4 text-right'>
                                                        <div className='flex justify-end gap-2'>
                                                            {session.status ===
                                                            'completed' ? (
                                                                session.progressNote ? (
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleViewDetail(
                                                                                session,
                                                                            );
                                                                        }}
                                                                        className='flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100'
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                14
                                                                            }
                                                                        />{' '}
                                                                        Chi tiết
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleAddProgress(
                                                                                e,
                                                                                session,
                                                                            )
                                                                        }
                                                                        className='flex items-center gap-1 rounded-lg bg-[#0795DF] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-600'
                                                                    >
                                                                        <Plus
                                                                            size={
                                                                                14
                                                                            }
                                                                        />{' '}
                                                                        Thêm
                                                                        biên bản
                                                                    </button>
                                                                )
                                                            ) : null}

                                                            {session.status.includes(
                                                                'cancelled',
                                                            ) && (
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        handleViewReason(
                                                                            e,
                                                                            session,
                                                                        )
                                                                    }
                                                                    className='flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100'
                                                                >
                                                                    <FileText
                                                                        size={
                                                                            14
                                                                        }
                                                                    />{' '}
                                                                    Xem lý do
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Load More */}
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

            {/* 1. Modal Chi tiết Session */}
            <SessionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                session={selectedSession}
            />

            {/* 2. Modal Xem lý do hủy */}
            <CancellationReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalOpen(false)}
                session={selectedSession}
            />

            {/* 3. Modal Thêm biên bản/Tiến độ */}
            <AddProgressModal
                isOpen={isAddProgressModalOpen}
                onClose={() => {
                    setIsAddProgressModalOpen(false);
                    setSelectedSession(null); // Reset session khi đóng
                }}
                preSelectedSessionId={selectedSession?.id} // <--- KEY FIX: Truyền ID vào đây
                onSuccess={fetchData} // <--- KEY FIX: Gọi hàm reload lại dữ liệu sau khi save
            />
        </>
    );
};

export default TutorStudyHistory;
