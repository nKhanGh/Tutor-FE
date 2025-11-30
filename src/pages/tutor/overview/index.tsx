import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import OpenSessionModal from '@/components/UI/tutor/OpenSessionModal';
import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal';
import {
    Users,
    CalendarCheck,
    Star,
    Bell,
    Plus,
    Check,
    X,
    Clock,
    ChevronDown,
    ChevronUp,
    Info,
    CalendarClock,
    CalendarX,
    ArrowRight,
    MessageSquare,
    BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';
import { getUserInitials } from '@/utils/helpers';
import type {
    AvailabilitySlot,
    Session,
    TutorStat,
    TeachingPeriod,
} from '@/interfaces';

// --- TYPE DEFINITIONS (LOCAL) ---
// Định nghĩa lại cấu trúc PendingChange để dùng trong file này
interface PendingChange {
    type: 'cancel' | 'reschedule';
    newDate?: string;
    newTime?: string;
    reason: string;
    createdAt: string;
}

// Mở rộng Session interface để bao gồm pendingChange
interface ExtendedSession extends Session {
    pendingChange?: PendingChange;
}

// Mở rộng Storage interface để TypeScript nhận diện các hàm mới
interface ExtendedStorage {
    approveSessionChange: (id: string) => boolean;
    rejectSessionChange: (id: string) => boolean;
}

interface OverviewStats {
    activeStudentCount: number;
    sessionCount: number;
    avgRating: number;
    upcomingCount: number;
    pendingCount: number;
}

const Overview = () => {
    const { user } = useAuth();
    const { showSuccessNotification } = useNotification();

    // --- STATES ---
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );

    const [pendingSlots, setPendingSlots] = useState<AvailabilitySlot[]>([]);

    // Sử dụng ExtendedSession cho state
    const [rescheduleRequests, setRescheduleRequests] = useState<
        ExtendedSession[]
    >([]);
    const [cancelRequests, setCancelRequests] = useState<ExtendedSession[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<ExtendedSession[]>(
        [],
    );

    const [activeStudents, setActiveStudents] = useState<TeachingPeriod[]>([]);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);
    const [activeRequestTab, setActiveRequestTab] = useState<
        'booking' | 'reschedule' | 'cancel'
    >('booking');

    const [stats, setStats] = useState<OverviewStats>({
        activeStudentCount: 0,
        sessionCount: 0,
        avgRating: 0,
        upcomingCount: 0,
        pendingCount: 0,
    });

    // --- FETCH DATA ---
    const fetchData = useCallback(() => {
        if (!user) return;

        setTimeout(() => {
            const allSlots = storage.getSlotsByTutor(user.id);
            // Ép kiểu Session[] thành ExtendedSession[] ngay từ đầu
            const allSessions = storage.getSessionsForTutor(
                user.id,
            ) as ExtendedSession[];
            const activePeriods = storage.getActiveTeachingPeriods(user.id);

            // 1. Pending Booking
            const pendingBooking = allSlots.filter(
                (s) => s.status === 'pending',
            );

            // 2. Pending Changes (Type safe filtering)
            const sessionsWithChanges = allSessions.filter(
                (s) => s.pendingChange !== undefined,
            );
            const pendingReschedule = sessionsWithChanges.filter(
                (s) => s.pendingChange?.type === 'reschedule',
            );
            const pendingCancel = sessionsWithChanges.filter(
                (s) => s.pendingChange?.type === 'cancel',
            );

            // 3. Upcoming
            const upcoming = allSessions
                .filter(
                    (s) =>
                        (s.status === 'upcoming' || s.status === 'pending') &&
                        !s.pendingChange,
                )
                .sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    if (dateA !== dateB) return dateA - dateB;
                    return a.time.localeCompare(b.time);
                });

            // 4. Stats
            const ratedSessions = allSessions.filter((s) => s.review);
            const totalRating = ratedSessions.reduce(
                (sum, s) => sum + (s.review?.rating || 0),
                0,
            );
            const avgRating =
                ratedSessions.length > 0
                    ? parseFloat(
                          (totalRating / ratedSessions.length).toFixed(1),
                      )
                    : 0;
            const totalPending =
                pendingBooking.length +
                pendingReschedule.length +
                pendingCancel.length;

            setPendingSlots(pendingBooking);
            setRescheduleRequests(pendingReschedule);
            setCancelRequests(pendingCancel);
            setUpcomingSessions(upcoming);
            setActiveStudents(activePeriods);

            setStats({
                activeStudentCount: new Set(
                    activePeriods.map((p) => p.studentId),
                ).size,
                sessionCount: allSessions.length,
                avgRating: avgRating,
                upcomingCount: upcoming.length,
                pendingCount: totalPending,
            });
        }, 0);
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- HANDLERS ---
    const handleApproveBooking = (slot: AvailabilitySlot) => {
        if (storage.approveSlot(slot.id)) {
            showSuccessNotification(
                `Đã chấp nhận lịch hẹn môn ${slot.subject}`,
            );
            fetchData();
        }
    };

    const handleRejectBooking = (slotId: string) => {
        if (window.confirm('Bạn có chắc muốn từ chối yêu cầu này?')) {
            if (storage.rejectSlot(slotId)) {
                showSuccessNotification('Đã từ chối yêu cầu.');
                fetchData();
            }
        }
    };

    const handleProcessChange = (
        sessionId: string,
        action: 'approve' | 'reject',
    ) => {
        let success = false;
        // Cast storage để TypeScript biết các method này tồn tại
        const extendedStorage = storage as unknown as ExtendedStorage;

        if (action === 'approve') {
            if (typeof extendedStorage.approveSessionChange === 'function') {
                success = extendedStorage.approveSessionChange(sessionId);
                if (success)
                    showSuccessNotification('Đã duyệt yêu cầu thay đổi.');
            }
        } else {
            if (!window.confirm('Bạn muốn từ chối yêu cầu này?')) return;
            if (typeof extendedStorage.rejectSessionChange === 'function') {
                success = extendedStorage.rejectSessionChange(sessionId);
                if (success) showSuccessNotification('Đã từ chối thay đổi.');
            }
        }
        if (success) fetchData();
    };

    const handleViewDetail = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    const renderAvatar = (name: string, url?: string, bg?: string) => (
        <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 text-sm font-bold text-white ${!url ? bg || 'bg-gray-400' : ''}`}
        >
            {url ? (
                <img
                    src={url}
                    alt='Avatar'
                    className='h-full w-full object-cover'
                />
            ) : (
                getUserInitials(name)
            )}
        </div>
    );

    // --- RENDER CONTENT FUNCTIONS ---

    const renderBookingTab = () => {
        if (pendingSlots.length === 0) {
            return (
                <div className='rounded-lg border border-dashed py-8 text-center text-sm text-gray-400'>
                    Không có yêu cầu đặt lịch mới.
                </div>
            );
        }
        return pendingSlots.map((slot) => {
            const studentInfo = storage.getUserById(
                slot.bookedByStudentId || '',
            );
            return (
                <div
                    key={slot.id}
                    className='animate-fade-in-up flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0'
                >
                    <div className='flex items-center gap-3'>
                        {renderAvatar(
                            slot.bookedByStudentName || '',
                            studentInfo?.avatar,
                            studentInfo?.avatarBg,
                        )}
                        <div className='flex-1 overflow-hidden'>
                            <p className='truncate text-sm font-bold text-gray-800'>
                                {slot.bookedByStudentName}
                            </p>
                            <div className='flex items-center gap-1 text-xs text-gray-500'>
                                <Clock size={12} /> {slot.date} |{' '}
                                {slot.startTime}
                            </div>
                        </div>
                    </div>
                    <div className='rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 text-xs text-gray-700'>
                        <span className='font-semibold'>Môn:</span>{' '}
                        {slot.subject} <br />
                        <span className='italic'>
                            "{slot.requestNote || 'Mong thầy duyệt'}"
                        </span>
                    </div>
                    <div className='mt-1 flex justify-end gap-2'>
                        <button
                            onClick={() => handleApproveBooking(slot)}
                            className='flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-100'
                        >
                            <Check size={14} /> Duyệt
                        </button>
                        <button
                            onClick={() => handleRejectBooking(slot.id)}
                            className='flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100'
                        >
                            <X size={14} /> Từ chối
                        </button>
                    </div>
                </div>
            );
        });
    };

    const renderRescheduleTab = () => {
        if (rescheduleRequests.length === 0) {
            return (
                <div className='rounded-lg border border-dashed py-8 text-center text-sm text-gray-400'>
                    Không có yêu cầu đổi lịch.
                </div>
            );
        }
        return rescheduleRequests.map((session) => {
            const change = session.pendingChange; // Safe access
            const studentInfo = storage.getUserById(session.studentId);
            return (
                <div
                    key={session.id}
                    className='animate-fade-in-up flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0'
                >
                    <div className='flex items-center gap-3'>
                        {renderAvatar(
                            session.studentName,
                            studentInfo?.avatar,
                            studentInfo?.avatarBg,
                        )}
                        <div className='flex-1'>
                            <p className='text-sm font-bold text-gray-800'>
                                {session.studentName}
                            </p>
                            <p className='text-xs text-gray-500'>
                                {session.title}
                            </p>
                        </div>
                        <div className='rounded-full bg-orange-100 p-1.5 text-orange-600'>
                            <CalendarClock size={16} />
                        </div>
                    </div>

                    <div className='rounded-lg border border-orange-100 bg-orange-50 p-3 text-xs'>
                        <div className='mb-2 flex items-center justify-between gap-1 text-gray-500'>
                            <div className='line-through decoration-red-400 opacity-70'>
                                {session.date}
                                <br />
                                {session.time}
                            </div>
                            <ArrowRight size={12} className='text-orange-400' />
                            <div className='font-bold text-green-700'>
                                {change?.newDate || session.date}
                                <br />
                                {change?.newTime || session.time}
                            </div>
                        </div>
                        <div className='flex gap-1 border-t border-orange-200 pt-2 italic text-gray-700'>
                            <MessageSquare
                                size={12}
                                className='mt-0.5 flex-shrink-0'
                            />
                            <span>"{change?.reason}"</span>
                        </div>
                    </div>

                    <div className='mt-1 flex justify-end gap-2'>
                        <button
                            onClick={() =>
                                handleProcessChange(session.id, 'approve')
                            }
                            className='flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-100'
                        >
                            <Check size={14} /> Đồng ý
                        </button>
                        <button
                            onClick={() =>
                                handleProcessChange(session.id, 'reject')
                            }
                            className='flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200'
                        >
                            Giữ lịch cũ
                        </button>
                    </div>
                </div>
            );
        });
    };

    const renderCancelTab = () => {
        if (cancelRequests.length === 0) {
            return (
                <div className='rounded-lg border border-dashed py-8 text-center text-sm text-gray-400'>
                    Không có yêu cầu hủy.
                </div>
            );
        }
        return cancelRequests.map((session) => {
            const change = session.pendingChange; // Safe access
            const studentInfo = storage.getUserById(session.studentId);
            return (
                <div
                    key={session.id}
                    className='animate-fade-in-up flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0'
                >
                    <div className='flex items-center gap-3'>
                        {renderAvatar(
                            session.studentName,
                            studentInfo?.avatar,
                            studentInfo?.avatarBg,
                        )}
                        <div className='flex-1'>
                            <p className='text-sm font-bold text-gray-800'>
                                {session.studentName}
                            </p>
                            <div className='flex items-center gap-1 text-xs text-gray-500'>
                                <Clock size={12} /> {session.date} |{' '}
                                {session.time}
                            </div>
                        </div>
                        <div className='rounded-full bg-red-100 p-1.5 text-red-600'>
                            <CalendarX size={16} />
                        </div>
                    </div>

                    <div className='rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-800'>
                        <p className='mb-1 flex items-center gap-1 font-bold'>
                            <MessageSquare size={12} /> Lý do hủy:
                        </p>
                        <p className='italic'>"{change?.reason}"</p>
                    </div>

                    <div className='mt-1 flex justify-end gap-2'>
                        <button
                            onClick={() =>
                                handleProcessChange(session.id, 'approve')
                            }
                            className='flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-red-100 hover:bg-red-700'
                        >
                            Chấp nhận
                        </button>
                        <button
                            onClick={() =>
                                handleProcessChange(session.id, 'reject')
                            }
                            className='flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200'
                        >
                            Từ chối
                        </button>
                    </div>
                </div>
            );
        });
    };

    // --- MAIN RENDER ---
    const statCards: TutorStat[] = [
        {
            label: 'Sinh viên đang hỗ trợ',
            value: stats.activeStudentCount,
            icon: Users,
            color: 'bg-blue-50',
            textColor: 'text-[#0795DF]',
        },
        {
            label: 'Buổi dạy sắp tới',
            value: stats.upcomingCount,
            icon: CalendarCheck,
            color: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            label: 'Đánh giá trung bình',
            value: stats.avgRating > 0 ? stats.avgRating : 'N/A',
            icon: Star,
            color: 'bg-yellow-50',
            textColor: 'text-yellow-600',
        },
        {
            label: 'Yêu cầu cần xử lý',
            value: stats.pendingCount,
            icon: Bell,
            color: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam transition-all duration-300 md:ml-[260px]'>
                {/* Header */}
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Chào mừng trở lại, {user?.name}!
                        </h1>
                        <p className='text-gray-500'>
                            Quản lý các kỳ dạy và lịch trình của bạn.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSessionModalOpen(true)}
                        className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0795DF] to-[#00C0EF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5'
                    >
                        <Plus size={20} /> Mở buổi tư vấn mới
                    </button>
                </div>

                {/* Stats */}
                <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            onClick={
                                index === 0
                                    ? () => setIsStudentListModalOpen(true)
                                    : undefined
                            }
                            className={`flex items-center gap-5 rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all ${index === 0 ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''}`}
                        >
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color} ${stat.textColor}`}
                            >
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>
                                    {stat.value}
                                </h3>
                                <p className='flex items-center gap-1 text-sm text-gray-500'>
                                    {stat.label}{' '}
                                    {index === 0 && <ChevronDown size={14} />}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                    {/* LEFT: Upcoming Sessions */}
                    <div className='h-fit rounded-xl bg-white p-6 shadow-sm lg:col-span-2'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-gray-800'>
                                Lịch hẹn sắp tới
                            </h3>
                        </div>
                        <div className='space-y-4'>
                            {upcomingSessions.length === 0 ? (
                                <div className='rounded-lg border border-dashed bg-gray-50 py-8 text-center text-gray-400'>
                                    Chưa có lịch hẹn nào sắp tới.
                                </div>
                            ) : (
                                <>
                                    {upcomingSessions
                                        .slice(
                                            0,
                                            showAllUpcoming ? undefined : 3,
                                        )
                                        .map((session) => (
                                            <div
                                                key={session.id}
                                                className='flex items-center gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-gray-100 hover:bg-gray-50'
                                            >
                                                <div className='flex h-[60px] min-w-[60px] flex-col items-center justify-center rounded-xl border border-blue-100 bg-[#f4f7fc]'>
                                                    <span className='text-xl font-bold text-[#0795DF]'>
                                                        {session.date.split(
                                                            /[-/]/,
                                                        )[2] || 'DD'}
                                                    </span>
                                                    <span className='text-xs font-semibold text-gray-500'>
                                                        /{' '}
                                                        {session.date.split(
                                                            /[-/]/,
                                                        )[1] || 'MM'}
                                                    </span>
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='font-bold text-gray-800'>
                                                        {session.title}
                                                    </p>
                                                    <p className='flex items-center gap-1 text-sm text-gray-500'>
                                                        <Users size={12} />{' '}
                                                        {session.studentName} •{' '}
                                                        <Clock size={12} />{' '}
                                                        {session.time}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleViewDetail(
                                                            session,
                                                        )
                                                    }
                                                    className='flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0795DF] transition-colors hover:bg-blue-100'
                                                >
                                                    <Info size={14} /> Chi tiết
                                                </button>
                                            </div>
                                        ))}
                                    {upcomingSessions.length > 3 && (
                                        <button
                                            onClick={() =>
                                                setShowAllUpcoming(
                                                    !showAllUpcoming,
                                                )
                                            }
                                            className='mt-2 flex w-full items-center justify-center gap-1 rounded-lg border-t border-gray-100 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0795DF]'
                                        >
                                            {showAllUpcoming ? (
                                                <>
                                                    Thu gọn{' '}
                                                    <ChevronUp size={14} />
                                                </>
                                            ) : (
                                                <>
                                                    Xem thêm{' '}
                                                    {upcomingSessions.length -
                                                        3}{' '}
                                                    buổi khác{' '}
                                                    <ChevronDown size={14} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Requests Management */}
                    <div className='h-fit rounded-xl bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-gray-800'>
                                Yêu cầu xử lý ({stats.pendingCount})
                            </h3>
                        </div>

                        {/* Tabs */}
                        <div className='mb-5 flex rounded-lg bg-gray-100 p-1'>
                            <button
                                onClick={() => setActiveRequestTab('booking')}
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${activeRequestTab === 'booking' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Đặt lịch{' '}
                                {pendingSlots.length > 0 &&
                                    `(${pendingSlots.length})`}
                            </button>
                            <button
                                onClick={() =>
                                    setActiveRequestTab('reschedule')
                                }
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${activeRequestTab === 'reschedule' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Đổi lịch{' '}
                                {rescheduleRequests.length > 0 &&
                                    `(${rescheduleRequests.length})`}
                            </button>
                            <button
                                onClick={() => setActiveRequestTab('cancel')}
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${activeRequestTab === 'cancel' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Hủy{' '}
                                {cancelRequests.length > 0 &&
                                    `(${cancelRequests.length})`}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className='space-y-4'>
                            {activeRequestTab === 'booking' &&
                                renderBookingTab()}
                            {activeRequestTab === 'reschedule' &&
                                renderRescheduleTab()}
                            {activeRequestTab === 'cancel' && renderCancelTab()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <OpenSessionModal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                onSuccess={fetchData}
            />

            {/* Modal Student List */}
            {isStudentListModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
                    <div className='animate-fade-in-up w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl'>
                        <div className='mb-4 flex items-center justify-between border-b pb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>
                                Sinh viên đang hỗ trợ
                            </h2>
                            <button
                                onClick={() => setIsStudentListModalOpen(false)}
                                className='rounded-full p-2 hover:bg-gray-100'
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className='custom-scrollbar max-h-[300px] space-y-3 overflow-y-auto'>
                            {activeStudents.length === 0 ? (
                                <p className='py-4 text-center text-gray-400'>
                                    Chưa có sinh viên nào.
                                </p>
                            ) : (
                                activeStudents.map((s) => (
                                    <div
                                        key={s.id}
                                        className='flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3'
                                    >
                                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600'>
                                            {getUserInitials(s.studentName)}
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold text-gray-800'>
                                                {s.studentName}
                                            </p>
                                            <p className='flex items-center gap-1 text-xs text-gray-500'>
                                                <BookOpen size={10} />{' '}
                                                {s.subject}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='mt-4 flex justify-end border-t pt-4'>
                            <button
                                onClick={() => setIsStudentListModalOpen(false)}
                                className='rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200'
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SessionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                session={selectedSession}
            />
        </>
    );
};

export default Overview;
