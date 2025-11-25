import Sidebar from '@/components/layouts/Sidebar';
import {
    Calendar,
    Users,
    Bell,
    Clock,
    MapPin,
    Video,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import type { Session, TutorProfile, TeachingPeriod } from '@/interfaces';
import { Link } from 'react-router-dom';
import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal';
import { getUserInitials } from '@/utils/helpers';

const StudentOverview = () => {
    const { user } = useAuth();
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [stats, setStats] = useState({
        completed: 0,
        tutors: 0,
        monthSessions: 0,
        upcoming: 0,
    });
    const [recommendedTutors, setRecommendedTutors] = useState<TutorProfile[]>(
        [],
    );

    const [showAllUpcoming, setShowAllUpcoming] = useState(false); // State toggle xem thêm
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    ); // Session đang chọn
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Trạng thái modal

    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) {
                // Lấy dữ liệu Sessions
                const allSessions = storage.getSessionsForStudent(user.id);

                const allPeriodsStr = localStorage.getItem(
                    'tutor_app_teaching_periods',
                );
                const allPeriods: TeachingPeriod[] = allPeriodsStr
                    ? JSON.parse(allPeriodsStr)
                    : [];
                const completedCoursesCount = allPeriods.filter(
                    (p) => p.studentId === user.id && p.status === 'finished',
                ).length;

                // Đếm số tutor duy nhất
                const uniqueTutors = new Set(allSessions.map((s) => s.tutorId))
                    .size;
                // Đếm session trong tháng hiện tại
                const currentMonth = new Date().getMonth() + 1;
                const monthSessions = allSessions.filter((s) => {
                    const m = s.date.split(/[-/]/).map(Number)[1];
                    return m === currentMonth;
                }).length;

                // Lọc Upcoming Sessions
                const upcoming = allSessions
                    .filter(
                        (s) =>
                            s.status === 'upcoming' || s.status === 'pending',
                    ) // Lấy cả pending để hiện nếu muốn
                    .sort(
                        (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime(),
                    );

                const recommendations = storage.getRecommendedTutors(user.id);

                setUpcomingSessions(upcoming);
                setStats({
                    completed: completedCoursesCount,
                    tutors: uniqueTutors,
                    monthSessions,
                    upcoming: upcoming.length,
                });
                setRecommendedTutors(recommendations);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [user]);

    const handleViewDetail = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    // Logic cắt danh sách hiển thị
    const displayedSessions = showAllUpcoming
        ? upcomingSessions
        : upcomingSessions.slice(0, 3);

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam transition-all duration-300 md:ml-[260px]'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Chào mừng trở lại, {user?.name}!
                        </h1>
                        <p className='text-gray-600'>
                            Bạn có{' '}
                            <strong className='text-[#0795DF]'>
                                {stats.upcoming}
                            </strong>{' '}
                            buổi học sắp tới. Hãy chuẩn bị thật tốt nhé!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        {/* Card 1 */}
                        <div className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600'>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-gray-800'>
                                        {stats.completed}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        Khóa học hoàn thành
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600'>
                                    <Users size={24} />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-gray-800'>
                                        {stats.tutors}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        Tutor hỗ trợ
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600'>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-gray-800'>
                                        {stats.monthSessions}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        Buổi học trong tháng
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600'>
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-gray-800'>
                                        {stats.upcoming}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        Buổi tư vấn sắp tới
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-3'>
                        {/* Left: Upcoming Sessions */}
                        <div className='rounded-2xl bg-white p-6 shadow-sm lg:col-span-2'>
                            <div className='mb-6 flex items-center justify-between'>
                                <h2 className='text-xl font-bold text-gray-800'>
                                    Buổi học sắp tới
                                </h2>
                                <Link
                                    to='/student/schedule'
                                    className='flex items-center text-sm font-semibold text-[#0795DF] hover:underline'
                                >
                                    Xem lịch trình <ChevronRight size={16} />
                                </Link>
                            </div>

                            <div className='space-y-4'>
                                {upcomingSessions.length === 0 ? (
                                    <div className='rounded-xl border border-dashed bg-gray-50 py-8 text-center text-gray-400'>
                                        Bạn chưa có lịch học nào sắp tới.
                                    </div>
                                ) : (
                                    <>
                                        {displayedSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className='group flex flex-col items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md sm:flex-row'
                                            >
                                                {/* Date Box */}
                                                <div
                                                    className={`flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl ${session.type === 'location' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}
                                                >
                                                    {session.type ===
                                                    'location' ? (
                                                        <MapPin size={24} />
                                                    ) : (
                                                        <Video size={24} />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className='flex-1'>
                                                    <div className='flex items-start justify-between'>
                                                        <h3 className='font-bold text-gray-800 transition-colors group-hover:text-[#0795DF]'>
                                                            {session.title}
                                                        </h3>
                                                    </div>
                                                    <p className='mt-1 text-sm text-gray-500'>
                                                        với {session.tutorName}
                                                    </p>
                                                    <div className='mt-2 flex items-center gap-4 text-xs font-medium text-gray-500'>
                                                        <span className='flex items-center gap-1.5 rounded bg-gray-100 px-2 py-1'>
                                                            <Calendar
                                                                size={12}
                                                            />{' '}
                                                            {session.date}
                                                        </span>
                                                        <span className='flex items-center gap-1.5 rounded bg-gray-100 px-2 py-1'>
                                                            <Clock size={12} />{' '}
                                                            {session.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='ml-0 mt-3 md:ml-4 md:mt-0'>
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
                                                className='flex w-full items-center justify-center gap-1 rounded-lg border-t border-gray-100 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0795DF]'
                                            >
                                                {showAllUpcoming ? (
                                                    <>
                                                        Thu gọn{' '}
                                                        <ChevronUp size={16} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Xem thêm{' '}
                                                        {upcomingSessions.length -
                                                            3}{' '}
                                                        buổi khác{' '}
                                                        <ChevronDown
                                                            size={16}
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className='rounded-2xl bg-gradient-to-br from-[#0795DF] to-[#00C0EF] p-6 text-white shadow-lg'>
                            <h2 className='mb-2 text-xl font-bold'>
                                Gợi ý Tutor AI
                            </h2>
                            <p className='mb-6 text-sm text-blue-100'>
                                {recommendedTutors.length > 0
                                    ? 'Hệ thống đã tìm thấy các tutor phù hợp nhất với hồ sơ của bạn.'
                                    : 'Hãy cập nhật hồ sơ đăng ký để nhận gợi ý chính xác hơn.'}
                            </p>

                            <div className='mb-6 space-y-3'>
                                {recommendedTutors.map((tutor) => (
                                    <div
                                        key={tutor.id}
                                        className='flex cursor-pointer items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-transform hover:scale-105'
                                    >
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white font-bold text-[#0795DF] shadow-sm`}
                                        >
                                            {tutor.avatar ? (
                                                <img
                                                    src={tutor.avatar}
                                                    alt={tutor.name}
                                                    className='h-full w-full object-cover'
                                                />
                                            ) : (
                                                <span className='text-xs'>
                                                    {getUserInitials(
                                                        tutor.name,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <p className='truncate text-sm font-bold'>
                                                {tutor.name}
                                            </p>
                                            <div className='flex items-center justify-between'>
                                                <p className='max-w-[120px] truncate text-xs text-blue-100'>
                                                    {tutor.major}
                                                </p>
                                                <span className='rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#0795DF]'>
                                                    {tutor.matchPercentage}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to='/student/choose-tutor'
                                className='block w-full rounded-xl bg-white py-3 text-center font-bold text-[#0795DF] shadow-md transition-transform hover:scale-[1.02]'
                            >
                                Xem chi tiết ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <SessionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                session={selectedSession}
            />
        </>
    );
};

export default StudentOverview;
