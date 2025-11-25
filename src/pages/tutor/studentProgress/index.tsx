import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import AddProgressModal from '@/components/UI/tutor/AddProgressModal';
import {
    Search,
    Plus,
    ArrowLeft,
    BookOpen,
    Users,
    GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { getUserInitials } from '@/utils/helpers';
import type { Session, TeachingPeriod } from '@/interfaces';

// Interface UI hiển thị cho 1 thẻ (Card)
interface TeachingPeriodUI {
    id: string; // Unique ID của kỳ dạy
    studentId: string; // ID sinh viên
    name: string;
    mssv: string;
    email: string;
    major: string;
    totalSessions: number;
    latestEvaluation: string;
    avatar?: string; // Thêm trường avatar (URL)
    avatarBg: string; // Màu nền avatar (fallback)
    subject: string;
    periodStatus: 'active' | 'finished' | 'cancelled';
    startDate: string;
    endDate?: string;
}

interface StudentListProps {
    periods: TeachingPeriodUI[];
    onSelectPeriod: (id: string) => void;
    filterStatus: 'all' | 'active' | 'finished';
    setFilterStatus: (status: 'all' | 'active' | 'finished') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({
    periods,
    onSelectPeriod,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
}) => {
    // Logic lọc
    const displayedPeriods = periods.filter((p) => {
        const matchStatus =
            filterStatus === 'all' ? true : p.periodStatus === filterStatus;
        const matchSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.mssv.includes(searchQuery);
        return matchStatus && matchSearch;
    });

    return (
        <>
            <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Tiến độ sinh viên
                    </h1>
                    <p className='text-gray-600'>
                        Theo dõi các kỳ dạy và tiến độ học tập.
                    </p>
                </div>

                <div className='flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm'>
                    <button
                        onClick={() => setFilterStatus('active')}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterStatus === 'active' ? 'bg-blue-50 text-[#0795DF]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Đang dạy
                    </button>
                    <button
                        onClick={() => setFilterStatus('finished')}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterStatus === 'finished' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Đã kết thúc
                    </button>
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterStatus === 'all' ? 'bg-blue-50 text-[#0795DF]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Tất cả
                    </button>
                </div>
            </div>

            <div className='relative mb-8'>
                <Search
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                    size={20}
                />
                <input
                    type='text'
                    placeholder='Tìm kiếm sinh viên theo tên hoặc MSSV...'
                    className='w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 shadow-sm transition-all focus:border-blue-500 focus:outline-none'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {displayedPeriods.length === 0 ? (
                <div className='rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50'>
                        <Users className='text-gray-400' size={32} />
                    </div>
                    <p className='font-medium text-gray-500'>
                        Không tìm thấy kỳ dạy nào phù hợp.
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {displayedPeriods.map((period) => (
                        <div
                            key={period.id}
                            className='relative overflow-hidden rounded-xl border border-transparent bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200'
                        >
                            <div
                                className={`absolute right-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${period.periodStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {period.periodStatus === 'active'
                                    ? 'Active'
                                    : 'Done'}
                            </div>

                            <div
                                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-100 text-2xl font-bold text-white shadow-sm ${period.avatar ? '' : period.avatarBg}`}
                            >
                                {period.avatar ? (
                                    <img
                                        src={period.avatar}
                                        alt={period.name}
                                        className='h-full w-full object-cover'
                                    />
                                ) : (
                                    getUserInitials(period.name)
                                )}
                            </div>

                            <h3
                                className='mb-1 truncate text-lg font-bold text-gray-800'
                                title={period.name}
                            >
                                {period.name}
                            </h3>
                            <p className='mb-4 text-sm text-gray-500'>
                                {period.mssv}
                            </p>

                            <div className='mb-4 rounded-lg border border-blue-100 bg-blue-50 p-2'>
                                <p className='mb-1 text-xs text-gray-500'>
                                    Môn học
                                </p>
                                <p
                                    className='truncate text-sm font-bold text-[#0795DF]'
                                    title={period.subject}
                                >
                                    {period.subject}
                                </p>
                            </div>

                            <div className='mb-5 flex justify-center gap-4 border-t border-gray-100 pt-4'>
                                <div>
                                    <span className='block text-lg font-bold text-gray-800'>
                                        {period.totalSessions}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        Buổi học
                                    </span>
                                </div>
                                <div>
                                    <span
                                        className={`block max-w-[100px] truncate text-lg font-bold text-gray-800`}
                                    >
                                        {period.latestEvaluation ===
                                        'Chưa đánh giá'
                                            ? '-'
                                            : period.latestEvaluation}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        Đánh giá
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectPeriod(period.id)}
                                className='w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#0795DF]'
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

interface StudentDetailProps {
    period: TeachingPeriodUI | undefined;
    sessions: Session[];
    onBack: () => void;
    onOpenModal: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({
    period,
    sessions,
    onBack,
    onOpenModal,
}) => (
    <>
        <div className='mb-8 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <button
                    onClick={onBack}
                    className='rounded-full p-2 shadow-sm transition-colors hover:bg-white'
                >
                    <ArrowLeft size={24} className='text-gray-600' />
                </button>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Chi tiết kỳ dạy
                    </h1>
                    <div className='flex items-center gap-2'>
                        <p className='text-gray-600'>
                            Sinh viên: <strong>{period?.name}</strong>
                        </p>
                        <span className='text-gray-400'>|</span>
                        <p className='font-bold text-[#0795DF]'>
                            {period?.subject}
                        </p>
                    </div>
                </div>
            </div>
            {period?.periodStatus === 'active' && (
                <button
                    onClick={onOpenModal}
                    className='flex items-center gap-2 rounded-lg bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600'
                >
                    <Plus size={20} />
                    Thêm ghi nhận mới
                </button>
            )}
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Left: Info Card */}
            <div className='h-fit rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                <div
                    className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white text-4xl font-bold text-white shadow-sm ${period?.avatar ? '' : period?.avatarBg || 'bg-gray-300'}`}
                >
                    {period?.avatar ? (
                        <img
                            src={period.avatar}
                            alt={period.name}
                            className='h-full w-full object-cover'
                        />
                    ) : (
                        getUserInitials(period?.name || '')
                    )}
                </div>

                <h3 className='mb-1 text-center text-xl font-bold text-gray-800'>
                    {period?.name}
                </h3>
                <p className='mb-6 text-center text-gray-500'>{period?.mssv}</p>

                <div className='space-y-4'>
                    <div className='flex items-center justify-between border-b border-gray-100 pb-3 text-sm'>
                        <span className='flex items-center gap-2 text-gray-500'>
                            <BookOpen size={16} /> Môn học
                        </span>
                        <span className='text-right font-bold text-[#0795DF]'>
                            {period?.subject}
                        </span>
                    </div>
                    <div className='flex items-center justify-between border-b border-gray-100 pb-3 text-sm'>
                        <span className='flex items-center gap-2 text-gray-500'>
                            <Users size={16} /> Khoa
                        </span>
                        <span className='text-right font-semibold text-gray-800'>
                            {period?.major}
                        </span>
                    </div>
                    <div className='flex items-center justify-between pb-1 text-sm'>
                        <span className='flex items-center gap-2 text-gray-500'>
                            Trạng thái:
                        </span>
                        <span
                            className={`font-semibold ${period?.periodStatus === 'active' ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {period?.periodStatus === 'active'
                                ? 'Đang giảng dạy'
                                : 'Đã kết thúc'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Timeline */}
            <div className='rounded-xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2'>
                <h3 className='mb-6 flex items-center gap-2 text-lg font-bold text-gray-800'>
                    <GraduationCap className='text-[#0795DF]' /> Lịch sử học tập
                    môn {period?.subject}
                </h3>

                {sessions.length === 0 ? (
                    <div className='rounded-xl border-2 border-dashed border-gray-100 py-10 text-center'>
                        <p className='text-gray-400'>
                            Chưa có buổi học nào được ghi nhận trong kỳ này.
                        </p>
                    </div>
                ) : (
                    <div className='relative space-y-8 border-l-2 border-blue-100 pl-4'>
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className='group relative pl-8'
                            >
                                <div className='absolute -left-[25px] top-1 z-10 h-4 w-4 rounded-full border-2 border-white bg-[#0795DF] shadow-sm'></div>
                                <span className='mb-2 block text-sm font-bold text-[#0795DF]'>
                                    {session.date}
                                </span>
                                <div className='rounded-xl border border-gray-100 bg-[#f8fafc] p-5 transition-all hover:bg-white hover:shadow-md'>
                                    <h4 className='mb-2 text-base font-bold text-gray-800'>
                                        {session.title}
                                    </h4>
                                    <p className='mb-3 text-sm text-gray-600'>
                                        <span className='font-semibold text-gray-700'>
                                            Nội dung/Tiến độ:
                                        </span>{' '}
                                        <br />
                                        {session.progressNote?.content ||
                                            'Chưa ghi nhận'}
                                    </p>
                                    {session.progressNote?.evaluation && (
                                        <div className='inline-block rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm'>
                                            Đánh giá:{' '}
                                            <span className='text-[#0795DF]'>
                                                {
                                                    session.progressNote
                                                        .evaluation
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </>
);

// --- 3. Main Component ---
const StudentProgressPage = () => {
    const { user } = useAuth();

    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<
        'all' | 'active' | 'finished'
    >('active');
    const [searchQuery, setSearchQuery] = useState('');

    const [periods, setPeriods] = useState<TeachingPeriodUI[]>([]);
    const [periodSessions, setPeriodSessions] = useState<Session[]>([]);

    // 1. Load danh sách Kỳ dạy (Periods)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) return;

            const allPeriodsStr = localStorage.getItem(
                'tutor_app_teaching_periods',
            );
            const allPeriods: TeachingPeriod[] = allPeriodsStr
                ? JSON.parse(allPeriodsStr)
                : [];

            // Lấy kỳ dạy của Tutor này
            const myPeriods = allPeriods.filter((p) => p.tutorId === user.id);
            const allSessions = storage.getSessionsForTutor(user.id);

            // Map sang UI
            const uiData: TeachingPeriodUI[] = myPeriods.map((period) => {
                // Lấy thông tin User mới nhất (để lấy avatar)
                const studentInfo = storage.getUserById(period.studentId);

                // Logic: Lọc session cho đúng kỳ dạy này
                const mySessions = allSessions.filter(
                    (s) =>
                        s.status === 'completed' &&
                        s.teachingPeriodId === period.id,
                );

                mySessions.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );
                const latestSession = mySessions[0];

                return {
                    id: period.id,
                    studentId: period.studentId,
                    name: period.studentName,
                    mssv: studentInfo?.username || 'N/A',
                    email: period.studentEmail || 'N/A',
                    major: studentInfo?.major || 'N/A',
                    totalSessions: mySessions.length,
                    latestEvaluation:
                        latestSession?.progressNote?.evaluation ||
                        'Chưa đánh giá',
                    avatar: studentInfo?.avatar, // Lấy avatar từ profile
                    avatarBg: studentInfo?.avatarBg || 'bg-gray-400',
                    subject: period.subject,
                    periodStatus: period.status,
                    startDate: period.startDate,
                    endDate: period.endDate,
                };
            });

            // Sort: Active lên đầu
            uiData.sort((a) => (a.periodStatus === 'active' ? -1 : 1));
            setPeriods(uiData);
        }, 0);
        return () => clearTimeout(timer);
    }, [user]);

    // 2. Load chi tiết Sessions khi chọn một Period
    useEffect(() => {
        if (selectedPeriodId && user) {
            const timer = setTimeout(() => {
                const selectedPeriod = periods.find(
                    (p) => p.id === selectedPeriodId,
                );
                if (selectedPeriod) {
                    const all = storage.getSessionsForTutor(user.id);
                    const history = all.filter((s) => {
                        // Điều kiện: Phải có teachingPeriodId trùng khớp
                        const isMatchingPeriod =
                            s.teachingPeriodId === selectedPeriod.id;

                        // Chỉ lấy các session đã hoàn thành để hiện trong timeline tiến độ
                        return isMatchingPeriod && s.status === 'completed';
                    });

                    history.sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                    );
                    setPeriodSessions(history);
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [selectedPeriodId, user, periods]);

    const handleSelectPeriod = (id: string) => {
        setSelectedPeriodId(id);
        setViewMode('detail');
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setSelectedPeriodId(null);
        setViewMode('list');
    };

    const selectedPeriodUI = periods.find((p) => p.id === selectedPeriodId);

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam transition-all duration-300 md:ml-[260px]'>
                {viewMode === 'list' ? (
                    <StudentList
                        periods={periods}
                        onSelectPeriod={handleSelectPeriod}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                ) : (
                    <StudentDetail
                        period={selectedPeriodUI}
                        sessions={periodSessions}
                        onBack={handleBack}
                        onOpenModal={() => setIsModalOpen(true)}
                    />
                )}
            </div>
            <AddProgressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teachingPeriodId={selectedPeriodId || undefined}
            />
        </>
    );
};

export default StudentProgressPage;
