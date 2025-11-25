import Sidebar from '@/components/layouts/Sidebar';
import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import {
    Plus,
    MapPin,
    Video,
    Clock,
    CalendarDays,
    User as UserIcon,
    Book,
    Filter,
    Search,
    AlertCircle,
    Link as LinkIcon,
    Info,
} from 'lucide-react';

import {
    type Session,
    type AvailabilitySlot,
    type TutorProfile,
    type TeachingPeriod,
} from '@/interfaces';

import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal';

const Schedule = () => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    // --- STATE DỮ LIỆU ---
    const [sessions, setSessions] = useState<Session[]>([]);
    // Thêm state để lưu các slot đang chờ duyệt
    const [pendingSlots, setPendingSlots] = useState<AvailabilitySlot[]>([]);

    const [activeTab, setActiveTab] = useState<'upcoming' | 'pending'>(
        'upcoming',
    );
    const [searchQuery, setSearchQuery] = useState('');

    // --- STATE MODAL ---
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );

    // --- STATE CHO BOOKING FORM ---
    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>(
        [],
    );
    const [bookingReason, setBookingReason] = useState<string>('');
    const [bookingSubject, setBookingSubject] = useState<string>('');
    const [currentTeachingPeriod, setCurrentTeachingPeriod] =
        useState<TeachingPeriod | null>(null);

    // 1. Load Sessions & Pending Slots của Student
    const fetchSessions = useCallback(() => {
        if (!user) return;

        setTimeout(() => {
            // A. Lấy các buổi học chính thức (Upcoming / Completed)
            const mySessions = storage.getSessionsForStudent(user.id);

            // B. Lấy các Slot đang chờ duyệt (Pending Slots) từ bảng SLOTS
            const allSlots = storage.getSlots();
            const myPendingSlots = allSlots.filter(
                (s) =>
                    s.bookedByStudentId === user.id && s.status === 'pending',
            );

            // --- SẮP XẾP TĂNG DẦN (Cũ nhất/Sắp tới gần nhất lên đầu) ---

            // 1. Sắp xếp Session
            mySessions.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                // So sánh ngày trước
                if (dateA !== dateB) {
                    return dateA - dateB; // Tăng dần: a - b
                }

                // Nếu cùng ngày, so sánh giờ bắt đầu (Format HH:MM - HH:MM)
                const startTimeA = a.time.split(' - ')[0];
                const startTimeB = b.time.split(' - ')[0];
                return startTimeA.localeCompare(startTimeB);
            });

            // 2. Sắp xếp Pending Slots
            myPendingSlots.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                // So sánh ngày trước
                if (dateA !== dateB) {
                    return dateA - dateB; // Tăng dần: a - b
                }

                // Nếu cùng ngày, so sánh giờ bắt đầu (Format HH:MM)
                return a.startTime.localeCompare(b.startTime);
            });

            setSessions(mySessions);
            setPendingSlots(myPendingSlots);
        }, 0);
    }, [user]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // 2. Load danh sách Tutor khi mở modal booking
    useEffect(() => {
        if (bookingModalOpen) {
            setTimeout(() => {
                const allTutors = storage.getAllTutors();
                setTutors(allTutors);
            }, 0);
        }
    }, [bookingModalOpen]);

    // --- HANDLERS ---
    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    const handleTutorChange = (tutorId: string) => {
        setSelectedTutorId(tutorId);
        setAvailableSlots([]);
        setCurrentTeachingPeriod(null);
        setBookingSubject('');

        if (tutorId && user) {
            const allSlots = storage.getSlotsByTutor(tutorId);
            const slots = allSlots
                .filter((s) => s.status === 'available')
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                );

            setAvailableSlots(slots);

            try {
                const allPeriodsStr = localStorage.getItem(
                    'tutor_app_teaching_periods',
                );
                if (allPeriodsStr) {
                    const allPeriods: TeachingPeriod[] =
                        JSON.parse(allPeriodsStr);
                    const foundPeriod = allPeriods.find(
                        (p) =>
                            p.studentId === user.id &&
                            p.tutorId === tutorId &&
                            p.status === 'active',
                    );

                    if (foundPeriod) {
                        setCurrentTeachingPeriod(foundPeriod);
                        setBookingSubject(foundPeriod.subject);
                    }
                }
            } catch (error) {
                console.error('Error finding teaching period', error);
            }
        }
    };

    const handleBookSlot = (slot: AvailabilitySlot) => {
        if (!user) return;

        if (!bookingSubject.trim()) {
            showErrorNotification('Vui lòng nhập môn học cần tư vấn.');
            return;
        }

        const periodIdToUse = currentTeachingPeriod
            ? currentTeachingPeriod.id
            : '';

        const success = storage.bookSlot(
            slot.id,
            user.id,
            user.name,
            bookingSubject,
            bookingReason,
            periodIdToUse,
        );

        if (success) {
            showSuccessNotification(
                'Đã gửi yêu cầu đặt lịch! Chờ Tutor duyệt.',
            );

            // Cập nhật UI ngay lập tức
            const updatedSlots = availableSlots.filter((s) => s.id !== slot.id);
            setAvailableSlots(updatedSlots);
            setBookingSubject('');
            setBookingReason('');
            setSelectedTutorId('');

            fetchSessions(); // Reload lại list pending
            setBookingModalOpen(false);
        } else {
            showErrorNotification(
                'Đặt lịch thất bại. Có thể slot đã bị người khác đặt.',
            );
        }
    };

    // Chuyển đổi Pending Slot thành định dạng Session để hiển thị chung
    const mappedPendingSessions: Session[] = pendingSlots.map((slot) => {
        // Cần tìm tên Tutor dựa vào ID
        const tutorInfo = storage.getUserById(slot.tutorId);

        return {
            id: slot.id,
            tutorId: slot.tutorId,
            tutorName: tutorInfo?.name || 'Unknown Tutor',
            studentId: user?.id || '',
            studentName: user?.name || '',
            teachingPeriodId: slot.teachingPeriodId || '',
            title: slot.subject || 'Đang chờ duyệt...',
            date: slot.date,
            time: `${slot.startTime} - ${slot.endTime}`,
            status: 'pending',
            type: 'online',
            locationOrLink: 'Chờ cập nhật',
            canFeedback: false,
            canViewReason: false,
            // --- BỔ SUNG DÒNG NÀY ---
            attachedDocumentIds: slot.attachedDocumentIds,
        };
    });

    // Gộp 2 danh sách lại
    const allDisplayItems = [...sessions, ...mappedPendingSessions];

    const filteredSessions = allDisplayItems.filter((session) => {
        let matchTab = false;
        if (activeTab === 'upcoming') {
            // Tab Sắp tới: Hiện upcoming
            matchTab = session.status === 'upcoming';
        } else {
            // Tab Chờ duyệt: Hiện pending
            matchTab = session.status === 'pending';
        }

        const matchSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.tutorName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchTab && matchSearch;
    });

    const getStatusBadge = (status: Session['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'>
                        Hoàn thành
                    </span>
                );
            case 'upcoming':
                return (
                    <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700'>
                        Sắp tới
                    </span>
                );
            case 'pending':
                return (
                    <span className='rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700'>
                        Chờ duyệt
                    </span>
                );
            case 'cancelled-tutor':
            case 'cancelled-student':
                return (
                    <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700'>
                        Đã hủy
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 font-bevietnam sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto flex h-full max-w-5xl flex-col'>
                    {/* HEADER */}
                    <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200'>
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-800'>
                                    Lịch trình của tôi
                                </h1>
                                <p className='text-sm text-gray-500'>
                                    Quản lý các buổi học và lịch hẹn
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setBookingModalOpen(true)}
                            className='flex items-center gap-2 rounded-xl bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-600 active:scale-95'
                        >
                            <Plus size={20} />
                            <span>Đặt lịch mới</span>
                        </button>
                    </div>

                    {/* FILTERS & TABS */}
                    <div className='mb-6 rounded-xl border border-gray-100 bg-white p-2 shadow-sm'>
                        <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                            {/* Tabs */}
                            <div className='flex self-start rounded-lg bg-gray-100 p-1'>
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Sắp tới
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Chờ duyệt ({pendingSlots.length})
                                </button>
                            </div>

                            {/* Search */}
                            <div className='relative'>
                                <Search
                                    className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                    size={18}
                                />
                                <input
                                    type='text'
                                    placeholder='Tìm môn học, tutor...'
                                    className='w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* SESSION LIST */}
                    <div className='flex-1 space-y-4'>
                        {filteredSessions.length === 0 ? (
                            <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-gray-400'>
                                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50'>
                                    <Filter size={32} className='opacity-50' />
                                </div>
                                <p className='font-medium'>
                                    Không tìm thấy buổi học nào.
                                </p>
                                <p className='mt-1 text-sm'>
                                    Thử thay đổi bộ lọc hoặc đặt lịch mới.
                                </p>
                            </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => handleSessionClick(session)}
                                    className='group flex cursor-pointer flex-col items-start gap-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center'
                                >
                                    {/* Date Box */}
                                    <div
                                        className={`flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl border ${session.status === 'upcoming' ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                                    >
                                        <span className='text-xl font-bold'>
                                            {session.date.split(/[-/]/)[2] ||
                                                'DD'}
                                        </span>
                                        <span className='text-xs font-medium uppercase'>
                                            Thg{' '}
                                            {session.date.split(/[-/]/)[1] ||
                                                'MM'}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className='min-w-0 flex-1'>
                                        <div className='mb-1 flex items-center gap-2'>
                                            <h3 className='truncate text-lg font-bold text-gray-800 transition-colors group-hover:text-[#0795DF]'>
                                                {session.title}
                                            </h3>
                                            {session.type === 'online' && (
                                                <Video
                                                    size={14}
                                                    className='text-purple-500'
                                                />
                                            )}
                                        </div>

                                        <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                                            <div className='flex items-center gap-1.5'>
                                                <UserIcon size={14} />
                                                <span>{session.tutorName}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <Clock size={14} />
                                                <span>{session.time}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <MapPin size={14} />
                                                <span className='max-w-[150px] truncate'>
                                                    {session.locationOrLink}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className='flex-shrink-0 self-start sm:self-center'>
                                        {getStatusBadge(session.status)}
                                    </div>

                                    {/* Button detail */}
                                    <div className='ml-0 mt-3 md:ml-4 md:mt-0'>
                                        <button className='flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0795DF] transition-colors hover:bg-blue-100'>
                                            <Info size={14} /> Chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <SessionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                session={selectedSession}
            />

            {bookingModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm'>
                    <div className='animate-fade-in-up flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b bg-gray-50 p-6'>
                            <h2 className='flex items-center gap-2 text-xl font-bold text-gray-800'>
                                <Plus className='text-[#0795DF]' /> Đặt lịch tư
                                vấn mới
                            </h2>
                            <button
                                onClick={() => setBookingModalOpen(false)}
                                className='rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600'
                            >
                                <Plus size={24} className='rotate-45' />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6'>
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                                {/* Left Col: Form */}
                                <div className='space-y-5'>
                                    <div>
                                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                                            1. Chọn Tutor
                                        </label>
                                        <select
                                            className='w-full rounded-xl border border-gray-300 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500'
                                            onChange={(e) =>
                                                handleTutorChange(
                                                    e.target.value,
                                                )
                                            }
                                            value={selectedTutorId}
                                        >
                                            <option value=''>
                                                -- Chọn Tutor --
                                            </option>
                                            {tutors.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} - {t.major}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedTutorId && (
                                            <div
                                                className={`mt-2 flex items-center gap-2 text-xs ${currentTeachingPeriod ? 'text-green-600' : 'text-orange-500'}`}
                                            >
                                                {currentTeachingPeriod ? (
                                                    <>
                                                        <LinkIcon size={12} />
                                                        <span>
                                                            Đã ghép cặp:{' '}
                                                            {
                                                                currentTeachingPeriod.subject
                                                            }
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle
                                                            size={12}
                                                        />
                                                        <span>
                                                            Chưa ghép cặp chính
                                                            thức (Đặt lịch vãng
                                                            lai)
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {selectedTutorId && (
                                        <div className='animate-in slide-in-from-left space-y-5 duration-300'>
                                            <div>
                                                <label className='mb-2 block text-sm font-bold text-gray-700'>
                                                    2. Môn học / Chủ đề
                                                </label>
                                                <div className='relative'>
                                                    <Book
                                                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                                        size={18}
                                                    />
                                                    <input
                                                        type='text'
                                                        className='w-full rounded-xl border border-gray-300 p-3 pl-10 outline-none transition-all focus:ring-2 focus:ring-blue-500'
                                                        placeholder='VD: Giải tích 1, Kỹ năng mềm...'
                                                        value={bookingSubject}
                                                        onChange={(e) =>
                                                            setBookingSubject(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className='mb-2 block text-sm font-bold text-gray-700'>
                                                    3. Ghi chú (Tùy chọn)
                                                </label>
                                                <textarea
                                                    className='h-24 w-full resize-none rounded-xl border border-gray-300 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500'
                                                    placeholder='Nội dung chi tiết bạn cần hỗ trợ...'
                                                    value={bookingReason}
                                                    onChange={(e) =>
                                                        setBookingReason(
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Col: Slots */}
                                <div className='rounded-xl border border-gray-100 bg-gray-50 p-5'>
                                    <h3 className='mb-4 flex items-center gap-2 font-bold text-gray-700'>
                                        <Clock
                                            size={18}
                                            className='text-[#0795DF]'
                                        />{' '}
                                        4. Chọn lịch rảnh
                                    </h3>

                                    {!selectedTutorId ? (
                                        <div className='flex h-40 items-center justify-center text-sm italic text-gray-400'>
                                            Vui lòng chọn Tutor ở bước 1.
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className='flex h-40 flex-col items-center justify-center gap-2 text-sm italic text-gray-400'>
                                            <AlertCircle size={24} />
                                            <p>Tutor này chưa có lịch rảnh.</p>
                                        </div>
                                    ) : (
                                        <div className='custom-scrollbar grid max-h-[350px] grid-cols-1 gap-3 overflow-y-auto pr-2'>
                                            {availableSlots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className='group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400'
                                                >
                                                    <div>
                                                        <div className='font-bold text-gray-800'>
                                                            {slot.date}
                                                        </div>
                                                        <div className='text-xs text-gray-500'>
                                                            {slot.startTime} -{' '}
                                                            {slot.endTime}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleBookSlot(slot)
                                                        }
                                                        disabled={
                                                            !bookingSubject
                                                        }
                                                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${bookingSubject ? 'cursor-pointer bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                                                    >
                                                        Đặt lịch
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end border-t bg-gray-50 p-6'>
                            <button
                                onClick={() => setBookingModalOpen(false)}
                                className='rounded-xl border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100'
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Schedule;
