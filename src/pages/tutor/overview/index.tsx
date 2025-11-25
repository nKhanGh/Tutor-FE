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
    BookOpen,
    Mail,
    MoreHorizontal,
    Info,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';
import { getUserInitials } from '@/utils/helpers'; // Import helper xử lý tên
import type {
    AvailabilitySlot,
    Session,
    TutorStat,
    TeachingPeriod,
} from '@/interfaces';

// Interface cho State thống kê
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

    // Modal States
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );

    // Data States
    const [pendingSlots, setPendingSlots] = useState<AvailabilitySlot[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [activeStudents, setActiveStudents] = useState<TeachingPeriod[]>([]);

    const [showAllPending, setShowAllPending] = useState(false);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);

    const [stats, setStats] = useState<OverviewStats>({
        activeStudentCount: 0,
        sessionCount: 0,
        avgRating: 0,
        upcomingCount: 0,
        pendingCount: 0,
    });

    const fetchData = useCallback(() => {
        if (!user) return;

        // FIX LỖI 1: Sử dụng setTimeout để tránh "Calling setState synchronously within an effect"
        // Đẩy việc update state sang event loop tiếp theo
        setTimeout(() => {
            // 1. Lấy dữ liệu từ storage
            const allSlots = storage.getSlotsByTutor(user.id);
            const allSessions = storage.getSessionsForTutor(user.id);
            const activePeriods = storage.getActiveTeachingPeriods(user.id);

            // 2. Filter Pending Slots
            const pending = allSlots.filter((s) => s.status === 'pending');

            // 3. Filter Upcoming Sessions
            const upcoming = allSessions
                .filter(
                    (s) => s.status === 'upcoming' || s.status === 'pending',
                )
                .sort((a, b) => {
                    // 1. So sánh ngày trước
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    if (dateA !== dateB) {
                        return dateA - dateB;
                    }

                    // 2. Nếu cùng ngày, so sánh giờ bắt đầu (format "HH:MM - HH:MM")
                    // Chuỗi time luôn được format chuẩn HH:MM nên so sánh chuỗi là chính xác
                    const startTimeA = a.time.split(' - ')[0] || '';
                    const startTimeB = b.time.split(' - ')[0] || '';

                    return startTimeA.localeCompare(startTimeB);
                });

            // 4. Tính Rating
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

            // 5. Update State
            setPendingSlots(pending);
            setUpcomingSessions(upcoming);
            setActiveStudents(activePeriods);

            setStats({
                activeStudentCount: new Set(
                    activePeriods.map((p) => p.studentId),
                ).size,
                sessionCount: allSessions.length,
                avgRating: avgRating,
                upcomingCount: upcoming.length,
                pendingCount: pending.length,
            });
        }, 0);
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers
    const handleApprove = (slot: AvailabilitySlot) => {
        if (storage.approveSlot(slot.id)) {
            showSuccessNotification(
                `Đã chấp nhận lịch hẹn môn ${slot.subject}`,
            );
            fetchData();
        }
    };

    const handleReject = (slotId: string) => {
        if (window.confirm('Bạn có chắc muốn từ chối yêu cầu này?')) {
            if (storage.rejectSlot(slotId)) {
                showSuccessNotification('Đã từ chối yêu cầu.');
                fetchData();
            }
        }
    };

    const handleViewDetail = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    // Stat Cards Configuration
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
            label: 'Yêu cầu đang chờ',
            value: stats.pendingCount,
            icon: Bell,
            color: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    const displayedPendingSlots = showAllPending
        ? pendingSlots
        : pendingSlots.slice(0, 3);

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
                        <Plus size={20} />
                        Mở buổi tư vấn mới
                    </button>
                </div>

                {/* Stats Grid */}
                <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            // Nếu là card Sinh viên (index 0), thêm sự kiện click để mở modal danh sách
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
                                    {stat.label}
                                    {index === 0 && <ChevronDown size={14} />}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                    {/* Left Column: Upcoming Sessions */}
                    <div className='h-fit rounded-xl bg-white p-6 shadow-sm lg:col-span-2'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-gray-800'>
                                Lịch hẹn sắp tới
                            </h3>
                            {/* Đã xóa nút "Xem lịch sử" ở đây theo yêu cầu */}
                        </div>

                        <div className='space-y-4'>
                            {upcomingSessions.length === 0 ? (
                                <div className='rounded-lg border border-dashed bg-gray-50 py-8 text-center text-gray-400'>
                                    Chưa có lịch hẹn nào sắp tới.
                                </div>
                            ) : (
                                <>
                                    {/* Logic hiển thị: Nếu showAllUpcoming = true thì hiện hết, ngược lại chỉ hiện 3 */}
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
                                                    <Info size={14} />
                                                    Chi tiết
                                                </button>
                                            </div>
                                        ))}

                                    {/* Nút Xem thêm / Thu gọn */}
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

                    {/* Right Column: Pending Requests */}
                    <div className='h-fit rounded-xl bg-white p-6 shadow-sm'>
                        <div className='mb-6 flex items-center gap-2'>
                            <h3 className='text-lg font-bold text-gray-800'>
                                Yêu cầu đặt lịch
                            </h3>
                            {pendingSlots.length > 0 && (
                                <span className='animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-xs text-white'>
                                    {pendingSlots.length}
                                </span>
                            )}
                        </div>

                        <div className='space-y-5'>
                            {pendingSlots.length === 0 ? (
                                <div className='rounded-lg border border-dashed bg-gray-50 py-8 text-center text-gray-400'>
                                    Không có yêu cầu mới.
                                </div>
                            ) : (
                                <>
                                    {displayedPendingSlots.map((slot) => {
                                        // FIX LOGIC AVATAR: Lấy thông tin student từ ID để check avatar/bg
                                        const studentInfo = storage.getUserById(
                                            slot.bookedByStudentId || '',
                                        );
                                        const hasAvatar = !!studentInfo?.avatar;

                                        return (
                                            <div
                                                key={slot.id}
                                                className='animate-fade-in-up flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0'
                                            >
                                                <div className='flex items-center gap-3'>
                                                    {/* AVATAR LOGIC */}
                                                    <div
                                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 text-sm font-bold text-white ${!hasAvatar ? studentInfo?.avatarBg || 'bg-gray-400' : ''}`}
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
                                                                slot.bookedByStudentName ||
                                                                    '',
                                                            )
                                                        )}
                                                    </div>

                                                    <div className='flex-1 overflow-hidden'>
                                                        <p
                                                            className='truncate text-sm font-bold text-gray-800'
                                                            title={
                                                                slot.bookedByStudentName
                                                            }
                                                        >
                                                            {slot.bookedByStudentName ||
                                                                'Sinh viên'}
                                                        </p>
                                                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                                                            <Clock size={12} />{' '}
                                                            {slot.date} |{' '}
                                                            {slot.startTime}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 text-xs text-gray-700'>
                                                    <span className='font-semibold'>
                                                        Môn:
                                                    </span>{' '}
                                                    {slot.subject} <br />
                                                    <span className='italic'>
                                                        "
                                                        {slot.requestNote ||
                                                            'Mong thầy duyệt giúp em'}
                                                        "
                                                    </span>
                                                </div>

                                                <div className='mt-1 flex justify-end gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(slot)
                                                        }
                                                        className='flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 transition-colors hover:bg-green-100'
                                                    >
                                                        <Check size={14} />{' '}
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                slot.id,
                                                            )
                                                        }
                                                        className='flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100'
                                                    >
                                                        <X size={14} /> Từ chối
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {pendingSlots.length > 3 && (
                                        <button
                                            onClick={() =>
                                                setShowAllPending(
                                                    !showAllPending,
                                                )
                                            }
                                            className='flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0795DF]'
                                        >
                                            {showAllPending ? (
                                                <>
                                                    Thu gọn{' '}
                                                    <ChevronUp size={14} />
                                                </>
                                            ) : (
                                                <>
                                                    Xem thêm{' '}
                                                    {pendingSlots.length - 3}{' '}
                                                    yêu cầu{' '}
                                                    <ChevronDown size={14} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal 1: Mở buổi tư vấn mới */}
            <OpenSessionModal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                onSuccess={fetchData}
            />

            {/* Modal 2: Danh sách sinh viên đang hỗ trợ */}
            {isStudentListModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
                    <div className='animate-fade-in-up flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
                        {/* Header Modal */}
                        <div className='flex items-center justify-between border-b p-6'>
                            <div>
                                <h2 className='text-xl font-bold text-gray-800'>
                                    Sinh viên đang hỗ trợ
                                </h2>
                                <p className='text-sm text-gray-500'>
                                    Danh sách các sinh viên và môn tương ứng
                                    đang được hỗ trợ.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsStudentListModalOpen(false)}
                                className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100'
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body Modal - Scrollable */}
                        <div className='overflow-y-auto p-6'>
                            {activeStudents.length === 0 ? (
                                <div className='py-10 text-center'>
                                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400'>
                                        <Users size={32} />
                                    </div>
                                    <p className='text-gray-500'>
                                        Hiện tại bạn chưa hỗ trợ sinh viên nào.
                                    </p>
                                    <p className='mt-1 text-sm text-gray-400'>
                                        Kỳ dạy bắt đầu khi bạn chấp nhận yêu cầu
                                        ghép cặp.
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {activeStudents.map((period) => {
                                        // FIX LOGIC AVATAR: Tương tự như phần Pending
                                        const studentInfo = storage.getUserById(
                                            period.studentId,
                                        );
                                        const hasAvatar = !!studentInfo?.avatar;

                                        return (
                                            <div
                                                key={period.id}
                                                className='group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50'
                                            >
                                                {/* AVATAR */}
                                                <div
                                                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 text-lg font-bold text-white ${!hasAvatar ? studentInfo?.avatarBg || 'bg-gray-400' : ''}`}
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
                                                            period.studentName,
                                                        )
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className='flex-1'>
                                                    <h3 className='font-bold text-gray-800'>
                                                        {period.studentName}
                                                    </h3>
                                                    <div className='mt-1 flex items-center gap-4'>
                                                        <span className='flex items-center gap-1 text-xs text-gray-500'>
                                                            <BookOpen
                                                                size={12}
                                                            />{' '}
                                                            {period.subject}
                                                        </span>
                                                        <span className='flex items-center gap-1 text-xs text-gray-500'>
                                                            <CalendarCheck
                                                                size={12}
                                                            />{' '}
                                                            Bắt đầu:{' '}
                                                            {period.startDate}
                                                        </span>
                                                    </div>
                                                    {period.studentEmail && (
                                                        <p className='mt-1 flex items-center gap-1 text-xs text-gray-400'>
                                                            <Mail size={12} />{' '}
                                                            {
                                                                period.studentEmail
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <button className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-100 hover:text-[#0795DF]'>
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className='flex justify-end border-t bg-gray-50 p-4'>
                            <button
                                onClick={() => setIsStudentListModalOpen(false)}
                                className='rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100'
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
