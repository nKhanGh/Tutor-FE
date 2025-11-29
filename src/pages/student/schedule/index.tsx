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
    Search,
    AlertCircle,
    Info,
    CalendarX,
    RefreshCw,
    CheckCircle,
    Link as LinkIcon,
    Book,
    Filter,
} from 'lucide-react';

import {
    type Session,
    type AvailabilitySlot,
    type TutorProfile,
    type PendingChange,
} from '@/interfaces';

import SessionDetailModal from '@/components/UI/tutor/SessionDetailModal';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface ChangeRequestData {
    reason: string;
    selectedSlot?: AvailabilitySlot;
}

// --- COMPONENT MODAL NHỎ: XỬ LÝ YÊU CẦU ĐỔI/HỦY ---
const RequestChangeModal = ({
    onClose,
    type,
    session,
    onSubmit,
    availableSlots,
}: {
    onClose: () => void;
    type: 'cancel' | 'reschedule';
    session: Session | null;
    onSubmit: (data: ChangeRequestData) => void;
    availableSlots: AvailabilitySlot[];
}) => {
    const [reason, setReason] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<
        AvailabilitySlot | undefined
    >(undefined);

    const [errors, setErrors] = useState<{ reason?: string; slot?: string }>(
        {},
    );

    if (!session) return null;

    const handleSubmit = () => {
        const newErrors: { reason?: string; slot?: string } = {};
        let hasError = false;

        if (!reason.trim()) {
            newErrors.reason = 'Vui lòng nhập lý do để Tutor nắm thông tin.';
            hasError = true;
        }

        if (type === 'reschedule' && !selectedSlot) {
            newErrors.slot = 'Vui lòng chọn lịch mới.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ reason, selectedSlot });
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-bevietnam backdrop-blur-sm'>
            <div
                className={`w-full ${type === 'reschedule' ? 'max-w-4xl' : 'max-w-lg'} animate-in fade-in zoom-in flex max-h-[90vh] flex-col rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200`}
            >
                <h3 className='mb-4 flex-shrink-0 border-b pb-2 text-lg font-bold text-gray-800'>
                    {type === 'cancel'
                        ? 'Yêu cầu Hủy lịch'
                        : 'Yêu cầu Đổi lịch'}
                </h3>

                <div className='custom-scrollbar flex-1 overflow-y-auto pr-1'>
                    {/* Thông tin lịch hiện tại (Luôn hiển thị ở trên cùng) */}
                    <div className='mb-5 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600'>
                        <span className='font-semibold text-gray-700'>
                            Lịch hiện tại:
                        </span>{' '}
                        {session.title}
                        <span className='mx-2 text-gray-300'>|</span>
                        <span className='inline-flex items-center gap-1 font-medium text-blue-600'>
                            <Clock size={14} /> {session.date} lúc{' '}
                            {session.time}
                        </span>
                    </div>

                    {/* LAYOUT CHÍNH */}
                    {type === 'reschedule' ? (
                        // --- GIAO DIỆN 2 CỘT CHO ĐỔI LỊCH ---
                        <div className='grid h-full grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* CỘT TRÁI: LÝ DO */}
                            <div className='flex h-full flex-col'>
                                <label className='mb-2 block text-sm font-bold text-gray-700'>
                                    1. Lý do đổi lịch{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    className={`min-h-[200px] w-full flex-1 resize-none rounded-xl border p-4 text-sm outline-none transition-all ${
                                        errors.reason
                                            ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                    }`}
                                    placeholder='VD: Em bị trùng lịch thi đột xuất vào giờ đó...'
                                    value={reason}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            reason: undefined,
                                        }));
                                    }}
                                />
                                {errors.reason && (
                                    <p className='mt-1 flex animate-pulse items-center gap-1 text-xs text-red-500'>
                                        <AlertCircle size={10} />{' '}
                                        {errors.reason}
                                    </p>
                                )}
                            </div>

                            {/* CỘT PHẢI: CHỌN LỊCH MỚI */}
                            <div className='flex h-full flex-col'>
                                <label className='mb-2 block text-sm font-bold text-gray-700'>
                                    2. Chọn lịch mới (Slot rảnh của Tutor){' '}
                                    <span className='text-red-500'>*</span>
                                </label>

                                <div
                                    className={`flex-1 overflow-y-auto rounded-xl border ${errors.slot ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} custom-scrollbar max-h-[300px] p-2`}
                                >
                                    {availableSlots.length === 0 ? (
                                        <div className='flex h-full flex-col items-center justify-center text-sm italic text-gray-400'>
                                            <CalendarX
                                                size={32}
                                                className='mb-2 opacity-50'
                                            />
                                            Tutor hiện không còn slot rảnh nào.
                                        </div>
                                    ) : (
                                        <div className='space-y-2'>
                                            {availableSlots.map((slot) => {
                                                const isSelected =
                                                    selectedSlot?.id ===
                                                    slot.id;
                                                return (
                                                    <div
                                                        key={slot.id}
                                                        onClick={() => {
                                                            setSelectedSlot(
                                                                slot,
                                                            );
                                                            setErrors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    slot: undefined,
                                                                }),
                                                            );
                                                        }}
                                                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                                                            isSelected
                                                                ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-500'
                                                                : 'border-transparent bg-white shadow-sm hover:border-blue-300'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div
                                                                className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}
                                                            >
                                                                {slot.date}
                                                            </div>
                                                            <div className='mt-0.5 text-xs text-gray-500'>
                                                                {slot.startTime}{' '}
                                                                - {slot.endTime}
                                                            </div>
                                                        </div>
                                                        {isSelected ? (
                                                            <CheckCircle
                                                                size={20}
                                                                className='fill-blue-50 text-blue-600'
                                                            />
                                                        ) : (
                                                            <div className='h-5 w-5 rounded-full border-2 border-gray-200'></div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {errors.slot && (
                                    <p className='mt-1 flex items-center gap-1 text-xs text-red-500'>
                                        <AlertCircle size={10} /> {errors.slot}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        // --- GIAO DIỆN 1 CỘT CHO HỦY LỊCH ---
                        <div>
                            <label className='mb-2 block text-sm font-bold text-gray-700'>
                                Lý do hủy{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <textarea
                                className={`h-32 w-full resize-none rounded-xl border p-4 text-sm outline-none transition-all ${
                                    errors.reason
                                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                }`}
                                placeholder='VD: Em bị ốm không thể tham gia...'
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        reason: undefined,
                                    }));
                                }}
                            />
                            {errors.reason && (
                                <p className='mt-1 flex animate-pulse items-center gap-1 text-xs text-red-500'>
                                    <AlertCircle size={10} /> {errors.reason}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className='mt-4 flex flex-shrink-0 justify-end gap-3 border-t pt-6'>
                    <button
                        onClick={onClose}
                        className='rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${type === 'cancel' ? 'bg-red-500 shadow-red-200 hover:bg-red-600' : 'bg-gradient-to-r from-[#0795DF] to-[#00C0EF] shadow-blue-200 hover:opacity-90'}`}
                    >
                        {type === 'cancel'
                            ? 'Xác nhận Hủy'
                            : 'Gửi yêu cầu Đổi lịch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT CHÍNH ---
const Schedule = () => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [pendingSlots, setPendingSlots] = useState<AvailabilitySlot[]>([]);

    const [activeTab, setActiveTab] = useState<'upcoming' | 'pending'>(
        'upcoming',
    );
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );

    // State cho Modal Đổi/Hủy
    const [changeModalOpen, setChangeModalOpen] = useState<boolean>(false);
    const [changeType, setChangeType] = useState<'cancel' | 'reschedule'>(
        'cancel',
    );
    const [selectedSessionForChange, setSelectedSessionForChange] =
        useState<Session | null>(null);
    const [rescheduleSlots, setRescheduleSlots] = useState<AvailabilitySlot[]>(
        [],
    );

    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>(
        [],
    );
    const [bookingReason, setBookingReason] = useState<string>('');
    const [bookingSubject, setBookingSubject] = useState<string>('');
    const [registeredSubjects, setRegisteredSubjects] = useState<string[]>([]);
    const [customSubject, setCustomSubject] = useState<string>('');

    // Load Data
    const fetchSessions = useCallback(() => {
        if (!user) return;
        setTimeout(() => {
            const mySessions = storage.getSessionsForStudent(user.id);
            const allSlots = storage.getSlots();
            const myPendingSlots = allSlots.filter(
                (s) =>
                    s.bookedByStudentId === user.id && s.status === 'pending',
            );

            mySessions.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            myPendingSlots.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            );

            setSessions(mySessions);
            setPendingSlots(myPendingSlots);
        }, 0);
    }, [user]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Load Tutors for Booking
    useEffect(() => {
        if (bookingModalOpen) {
            setTimeout(() => {
                setTutors(storage.getAllTutors());
            }, 0);
        }
    }, [bookingModalOpen]);

    // --- LOGIC REQUEST CHANGE ---
    const handleOpenChangeModal = (
        e: React.MouseEvent,
        session: Session,
        type: 'cancel' | 'reschedule',
    ) => {
        e.stopPropagation();

        if (type === 'reschedule') {
            const slots = storage
                .getSlotsByTutor(session.tutorId)
                .filter((s) => s.status === 'available')
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                );
            setRescheduleSlots(slots);
        } else {
            setRescheduleSlots([]);
        }

        setSelectedSessionForChange(session);
        setChangeType(type);
        setChangeModalOpen(true);
    };

    const handleSubmitChangeRequest = (data: ChangeRequestData) => {
        if (!selectedSessionForChange) return;

        let changeData: PendingChange;

        if (changeType === 'reschedule' && data.selectedSlot) {
            changeData = {
                type: 'reschedule',
                reason: data.reason,
                newDate: data.selectedSlot.date,
                newTime: `${data.selectedSlot.startTime} - ${data.selectedSlot.endTime}`,
                createdAt: new Date().toISOString(),
            };
        } else {
            changeData = {
                type: 'cancel',
                reason: data.reason,
                createdAt: new Date().toISOString(),
            };
        }

        const success = storage.requestSessionChange(
            selectedSessionForChange.id,
            changeData,
        );

        if (success) {
            showSuccessNotification(
                'Đã gửi yêu cầu! Vui lòng chờ Tutor phản hồi.',
            );
            fetchSessions();
        } else {
            showErrorNotification(
                'Không thể gửi yêu cầu. Có thể đã có yêu cầu đang chờ.',
            );
        }
    };

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsDetailModalOpen(true);
    };

    const handleTutorChange = (tutorId: string) => {
        setSelectedTutorId(tutorId);
        setAvailableSlots([]);
        setBookingSubject('');
        setRegisteredSubjects([]);
        setCustomSubject('');

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
                const periods = storage.getTeachingActivePeriodsForStudent(
                    user.id,
                );
                const subjectsWithThisTutor = periods
                    .filter((p) => p.tutorId === tutorId)
                    .map((p) => p.subject);
                setRegisteredSubjects(subjectsWithThisTutor);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleBookSlot = (slot: AvailabilitySlot) => {
        if (!user) return;
        let finalSubject = '';
        if (registeredSubjects.length > 0) {
            if (!bookingSubject) {
                showErrorNotification('Vui lòng chọn một môn học.');
                return;
            }
            finalSubject = bookingSubject;
        } else {
            if (!customSubject.trim()) {
                showErrorNotification('Vui lòng nhập môn học cần tư vấn.');
                return;
            }
            finalSubject = customSubject;
        }

        const activePeriods = storage.getTeachingActivePeriodsForStudent(
            user.id,
        );
        const relatedPeriod = activePeriods.find(
            (p) => p.tutorId === selectedTutorId && p.subject === finalSubject,
        );
        const periodIdToUse = relatedPeriod ? relatedPeriod.id : '';

        const success = storage.bookSlot(
            slot.id,
            user.id,
            user.name,
            finalSubject,
            bookingReason,
            periodIdToUse,
        );

        if (success) {
            showSuccessNotification(
                'Đã gửi yêu cầu! Vui lòng chờ Tutor duyệt.',
            );
            const updatedSlots = availableSlots.filter((s) => s.id !== slot.id);
            setAvailableSlots(updatedSlots);
            setBookingSubject('');
            setCustomSubject('');
            setBookingReason('');
            fetchSessions();
            setBookingModalOpen(false);
            setActiveTab('pending');
        } else {
            showErrorNotification(
                'Đặt lịch thất bại. Slot này vừa bị người khác đặt.',
            );
        }
    };

    const mappedPendingSessions: Session[] = pendingSlots.map((slot) => {
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
            attachedDocumentIds: slot.attachedDocumentIds,
        };
    });

    const allDisplayItems = [...sessions, ...mappedPendingSessions];

    const filteredSessions = allDisplayItems.filter((session) => {
        let matchTab = false;
        if (activeTab === 'upcoming') {
            matchTab = session.status === 'upcoming';
        } else {
            matchTab = session.status === 'pending';
        }
        const matchSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.tutorName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchTab && matchSearch;
    });

    const getStatusBadge = (
        status: Session['status'],
        pendingChange?: PendingChange,
    ) => {
        if (pendingChange) {
            return (
                <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${pendingChange.type === 'cancel' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}
                >
                    {pendingChange.type === 'cancel'
                        ? 'Chờ hủy'
                        : 'Chờ đổi lịch'}
                    <Clock size={12} />
                </span>
            );
        }

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
                <div className='mx-auto flex h-full flex-col'>
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
                                                <UserIcon size={14} />{' '}
                                                <span>{session.tutorName}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <Clock size={14} />{' '}
                                                <span>{session.time}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <MapPin size={14} />{' '}
                                                <span className='max-w-[150px] truncate'>
                                                    {session.locationOrLink}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PHẦN SỬA ĐỔI: Căn lề thẳng hàng */}
                                    <div className='flex flex-col items-start gap-2 sm:items-end'>
                                        <div className='flex-shrink-0'>
                                            {getStatusBadge(
                                                session.status,
                                                session.pendingChange,
                                            )}
                                        </div>

                                        {/* Nút hành động */}
                                        {session.status === 'upcoming' &&
                                            !session.pendingChange && (
                                                <div className='mt-1 flex items-center gap-2 sm:mt-0'>
                                                    <button
                                                        onClick={(e) =>
                                                            handleOpenChangeModal(
                                                                e,
                                                                session,
                                                                'reschedule',
                                                            )
                                                        }
                                                        className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600'
                                                        title='Xin đổi lịch'
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) =>
                                                            handleOpenChangeModal(
                                                                e,
                                                                session,
                                                                'cancel',
                                                            )
                                                        }
                                                        className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600'
                                                        title='Xin hủy lịch'
                                                    >
                                                        <CalendarX size={16} />
                                                    </button>
                                                    <button className='flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0795DF] transition-colors hover:bg-blue-100'>
                                                        <Info size={14} /> Chi
                                                        tiết
                                                    </button>
                                                </div>
                                            )}

                                        {!(
                                            session.status === 'upcoming' &&
                                            !session.pendingChange
                                        ) && (
                                            <button className='mt-2 flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0795DF] transition-colors hover:bg-blue-100 sm:mt-0'>
                                                <Info size={14} /> Chi tiết
                                            </button>
                                        )}
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

            {/* Modal Đổi/Hủy Lịch */}
            {changeModalOpen && (
                <RequestChangeModal
                    onClose={() => setChangeModalOpen(false)}
                    type={changeType}
                    session={selectedSessionForChange}
                    availableSlots={rescheduleSlots}
                    onSubmit={handleSubmitChangeRequest}
                />
            )}

            {/* Modal Booking (Giữ nguyên) */}
            {bookingModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm'>
                    <div className='animate-fade-in-up flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
                        {/* Header Modal */}
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

                        {/* Body Modal */}
                        <div className='flex-1 overflow-y-auto p-6'>
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
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
                                                className={`mt-2 flex items-center gap-2 text-xs ${registeredSubjects.length > 0 ? 'text-green-600' : 'text-orange-500'}`}
                                            >
                                                {registeredSubjects.length >
                                                0 ? (
                                                    <>
                                                        <LinkIcon size={12} />
                                                        <span>
                                                            Đang theo học:{' '}
                                                            {
                                                                registeredSubjects.length
                                                            }{' '}
                                                            môn
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle
                                                            size={12}
                                                        />
                                                        <span>
                                                            Chưa ghép cặp chính
                                                            thức (Vãng lai)
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
                                                    2. Môn học / Chủ đề (Chọn 1)
                                                </label>
                                                {registeredSubjects.length >
                                                0 ? (
                                                    <div className='flex max-h-[200px] flex-col gap-2 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-2'>
                                                        {registeredSubjects.map(
                                                            (subject) => {
                                                                const isSelected =
                                                                    bookingSubject ===
                                                                    subject;
                                                                return (
                                                                    <label
                                                                        key={
                                                                            subject
                                                                        }
                                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-white ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-transparent hover:border-gray-200'}`}
                                                                    >
                                                                        <div
                                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400 bg-white'}`}
                                                                        >
                                                                            {isSelected && (
                                                                                <CheckCircle
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <input
                                                                            type='radio'
                                                                            name='bookingSubject'
                                                                            className='hidden'
                                                                            value={
                                                                                subject
                                                                            }
                                                                            checked={
                                                                                isSelected
                                                                            }
                                                                            onChange={() =>
                                                                                setBookingSubject(
                                                                                    subject,
                                                                                )
                                                                            }
                                                                        />
                                                                        <span
                                                                            className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}
                                                                        >
                                                                            {
                                                                                subject
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className='relative'>
                                                        <Book
                                                            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                                            size={18}
                                                        />
                                                        <input
                                                            type='text'
                                                            className='w-full rounded-xl border border-gray-300 p-3 pl-10 outline-none transition-all focus:ring-2 focus:ring-blue-500'
                                                            placeholder='VD: Giải tích 1...'
                                                            value={
                                                                customSubject
                                                            }
                                                            onChange={(e) =>
                                                                setCustomSubject(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
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
                                                            !bookingSubject &&
                                                            !customSubject
                                                        }
                                                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${bookingSubject || customSubject ? 'cursor-pointer bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
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
