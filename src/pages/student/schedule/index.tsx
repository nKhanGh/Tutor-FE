import Sidebar from '@/components/layouts/Sidebar';
import { useState } from 'react';
import { useNotification } from '@/hooks/useNotification';
import {
    Plus,
    MapPin,
    Video,
    Calendar,
    Clock,
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

// === BƯỚC 1: IMPORT DATA VÀ TYPES TỪ FILE MỚI ===
import {
    type Session,
    type Program,
    type Slot,
    mockSessions,
    mockPrograms,
    mockCalendarSlots,
    dayNameMap,
} from '@/interfaces/Schedule'; // (Sửa đường dẫn nếu cần)

// === BƯỚC 2: IMPORT MODAL ĐÃ TÁCH RA ===
import BookingModal from '@/components/UI/BookingModal';
// (Bạn sẽ import 5 modal còn lại ở đây khi bạn tách chúng ra)

// (Component Schedule vẫn giữ nguyên state và các hàm handler)
const Schedule = () => {
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);
    const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [isConfirmRescheduleModalOpen, setConfirmRescheduleModalOpen] =
        useState(false);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(
        null,
    );
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { showSuccessNotification } = useNotification();

    // ... (Tất cả các hàm handler: handleOpenBooking, handleSelectProgram, ...v.v... giữ nguyên) ...
    const handleOpenBooking = () => setBookingModalOpen(true);
    const handleSelectProgram = (program: Program) => {
        setSelectedProgram(program);
        setBookingModalOpen(false);
        setCalendarModalOpen(true);
    };
    const handleSelectSlot = (day: string, time: string, status: string) => {
        if (status !== 'available') return;
        setSelectedSlot({ day, time, status });
        setCalendarModalOpen(false);
        setConfirmModalOpen(true);
    };
    const handleConfirmBooking = () => {
        showSuccessNotification?.('Đặt lịch thành công!');
        handleCloseAllModals();
    };
    const handleOpenReschedule = (session: Session) => {
        setSelectedSession(session);
        setOpenMenuId(null);
        setRescheduleModalOpen(true);
    };
    const handleSelectRescheduleSlot = (
        day: string,
        time: string,
        status: string,
    ) => {
        if (status !== 'available') return;
        setSelectedSlot({ day, time, status });
        setRescheduleModalOpen(false);
        setConfirmRescheduleModalOpen(true);
    };
    const handleConfirmReschedule = () => {
        showSuccessNotification?.('Đổi lịch thành công!');
        handleCloseAllModals();
    };
    const handleOpenCancel = (session: Session) => {
        setSelectedSession(session);
        setOpenMenuId(null);
        setCancelModalOpen(true);
    };
    const handleConfirmCancel = () => {
        showSuccessNotification?.('Hủy lịch thành công!');
        handleCloseAllModals();
    };
    const handleCloseAllModals = () => {
        setBookingModalOpen(false);
        setCalendarModalOpen(false);
        setConfirmModalOpen(false);
        setRescheduleModalOpen(false);
        setConfirmRescheduleModalOpen(false);
        setCancelModalOpen(false);
        setSelectedProgram(null);
        setSelectedSession(null);
        setSelectedSlot(null);
        setOpenMenuId(null);
    };
    const toggleMenu = (sessionId: number) => {
        setOpenMenuId(openMenuId === sessionId ? null : sessionId);
    };

    return (
        <>
            <Sidebar />

            {/* ... (Toàn bộ JSX của trang chính (header, list, pagination) giữ nguyên) ... */}
            <div className='ml-[80px] h-screen overflow-hidden bg-blue-50 md:ml-[260px]'>
                <div className='mx-auto flex h-full max-w-7xl flex-col p-3 pt-4 sm:p-4 md:p-6'>
                    <div className='mb-6 flex-shrink-0 items-center justify-between sm:flex'>
                        <div className='mb-4 flex items-center gap-3 sm:mb-0'>
                            <CalendarDays size={32} className='text-gray-700' />
                            <div>
                                <h1 className='text-3xl font-bold text-gray-800'>
                                    Các buổi tư vấn của bạn
                                </h1>
                                <p className='text-gray-600'>
                                    Những buổi tư vấn trong tuần này của bạn
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleOpenBooking}
                            className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700'
                        >
                            <Plus size={18} />
                            <span className='font-medium'>Đặt lịch mới</span>
                        </button>
                    </div>

                    <h2 className='mb-4 flex-shrink-0 text-xl font-semibold text-gray-700'>
                        Tuần 43 (Tuần này)
                    </h2>

                    <div className='flex-1 space-y-4 overflow-y-auto pr-2 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#0795DF] [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar]:w-1.5'>
                        {mockSessions.map((session) => (
                            <div
                                key={session.id}
                                className='flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm'
                            >
                                <div className='mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
                                    {session.type === 'location' ? (
                                        <MapPin size={24} />
                                    ) : (
                                        <Video size={24} />
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-gray-800'>
                                        {session.title}
                                    </h3>
                                    <p className='text-sm text-gray-500'>
                                        với {session.tutor}
                                    </p>
                                    <div className='mt-1 flex flex-wrap gap-4 text-sm text-gray-600'>
                                        <span className='flex items-center gap-1.5'>
                                            <Calendar size={14} />
                                            {new Date(
                                                session.date,
                                            ).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className='flex items-center gap-1.5'>
                                            <Clock size={14} />
                                            {session.time}
                                        </span>
                                    </div>
                                </div>

                                <div className='relative ml-2'>
                                    <button
                                        onClick={() => toggleMenu(session.id)}
                                        className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#00C0EF] to-[#0795DF] text-black transition hover:brightness-110'
                                    >
                                        <ChevronDown size={20} />
                                    </button>

                                    {openMenuId === session.id && (
                                        <div className='absolute right-0 top-12 z-10 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-[#0795DF]'>
                                            <ul className='space-y-0'>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            handleOpenReschedule(
                                                                session,
                                                            )
                                                        }
                                                        className='block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gradient-to-br hover:from-[#00C0EF] hover:to-[#0795DF] hover:text-white'
                                                    >
                                                        Đổi lịch tư vấn
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            handleOpenCancel(
                                                                session,
                                                            )
                                                        }
                                                        className='block w-full border-t border-[#0795DF] px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gradient-to-br hover:from-[#00C0EF] hover:to-[#0795DF] hover:text-white'
                                                    >
                                                        Hủy lịch tư vấn
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mt-auto flex flex-shrink-0 justify-center space-x-1 pb-2 pt-4'>
                        {[43, 44, 45, 46, 47].map((week) => (
                            <button
                                key={week}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition ${
                                    week === 43
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {week}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* === BƯỚC 3: SỬ DỤNG COMPONENT MỚI === */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={handleCloseAllModals}
                onSelectProgram={handleSelectProgram}
                programs={mockPrograms}
            />

            {/* === (Bạn sẽ làm tương tự để tách 5 modal còn lại) === */}
            {/* modal 2 đặt lịch */}
            {isCalendarModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='relative w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => {
                                        setCalendarModalOpen(false);
                                        setBookingModalOpen(true);
                                    }}
                                    className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700'
                                >
                                    <ArrowLeft size={18} />
                                    Quay lại
                                </button>
                                <h2 className='text-xl font-bold'>
                                    Đặt lịch tư vấn
                                </h2>
                            </div>
                            <div className='w-48 rounded-lg border border-gray-300 bg-white'>
                                <h3 className='border-b border-gray-300 py-1.5 text-center text-sm font-bold text-gray-700'>
                                    Chú thích
                                </h3>
                                <div className='space-y-2 p-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-6 w-10 rounded border border-green-400 bg-green-50'></div>
                                        <span className='text-sm text-gray-700'>
                                            Lịch khả dụng
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-6 w-10 rounded border border-red-400 bg-red-50'></div>
                                        <span className='text-sm text-gray-700'>
                                            Lịch đã đầy
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className='mt-4 font-semibold'>
                            {selectedProgram?.title}
                        </p>
                        <p className='text-sm text-gray-500'>
                            với {selectedProgram?.tutor}
                        </p>
                        <div className='my-3 flex items-center justify-center gap-4'>
                            <button className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100'>
                                <ChevronLeft size={20} />
                            </button>
                            <p className='font-medium'>
                                20/10/2025 - 26/10/2025
                            </p>
                            <button className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100'>
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className='grid grid-cols-7 gap-2'>
                            {Object.entries(mockCalendarSlots).map(
                                ([day, slots]) => (
                                    <div
                                        key={day}
                                        className='rounded-lg border bg-gray-50 p-2'
                                    >
                                        <p className='text-center font-semibold'>
                                            {dayNameMap[day]}
                                        </p>
                                        <p className='mb-2 text-center text-sm text-gray-400'>
                                            {day}
                                        </p>
                                        <div className='space-y-1.5'>
                                            {slots.map((slot) => {
                                                const isAvailable =
                                                    slot.status === 'available';
                                                const isFull =
                                                    slot.status === 'full';
                                                const isCurrent =
                                                    slot.status === 'current';
                                                if (isCurrent) return null;

                                                return (
                                                    <button
                                                        key={slot.time}
                                                        onClick={() =>
                                                            handleSelectSlot(
                                                                day,
                                                                slot.time,
                                                                slot.status,
                                                            )
                                                        }
                                                        disabled={!isAvailable}
                                                        className={`w-full rounded-md border p-1.5 text-xs font-medium ${isAvailable ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200' : ''} ${isFull ? 'border-red-300 bg-red-100 text-red-700 opacity-60' : ''} `}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 3: Xác nhận Đặt lịch === */}
            {isConfirmModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='w-full max-w-md rounded-lg bg-white p-0 shadow-xl'>
                        <div className='rounded-t-lg bg-blue-500 p-6'>
                            <h2 className='text-center text-2xl font-bold text-white'>
                                Xác nhận đặt lịch
                            </h2>
                        </div>
                        <div className='space-y-2 p-6 text-center'>
                            <h3 className='text-xl font-semibold text-gray-800'>
                                {selectedProgram?.title}
                            </h3>
                            <p className='text-gray-600'>
                                với {selectedProgram?.tutor}
                            </p>
                            <div className='flex items-center justify-center gap-6 pt-4 text-lg'>
                                <span className='flex items-center gap-2'>
                                    <Calendar className='text-blue-500' />
                                    {selectedSlot?.day}/10/2025
                                </span>
                                <span className='flex items-center gap-2'>
                                    <Clock className='text-blue-500' />
                                    {selectedSlot?.time}
                                </span>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 p-6'>
                            <button
                                onClick={handleConfirmBooking}
                                className='rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-green-700'
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={handleCloseAllModals}
                                className='rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700'
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 4: ĐỔi lịch */}

            {isRescheduleModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='relative w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={handleCloseAllModals}
                                    className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700'
                                >
                                    <ArrowLeft size={18} />
                                    Quay lại
                                </button>
                                <h2 className='text-xl font-bold'>
                                    Đổi lịch tư vấn
                                </h2>
                            </div>
                            <div className='w-48 rounded-lg border border-gray-300 bg-white'>
                                <h3 className='border-b border-gray-300 py-1.5 text-center text-sm font-bold text-gray-700'>
                                    Chú thích
                                </h3>
                                <div className='space-y-2 p-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-6 w-10 rounded border border-green-400 bg-green-50'></div>
                                        <span className='text-sm text-gray-700'>
                                            Lịch khả dụng
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-6 w-10 rounded border border-red-400 bg-red-50'></div>
                                        <span className='text-sm text-gray-700'>
                                            Lịch đã đầy
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-6 w-10 rounded border border-blue-400 bg-blue-50'></div>
                                        <span className='text-sm text-gray-700'>
                                            Lịch hiện tại
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className='mt-4 font-semibold'>
                            {selectedSession?.title}
                        </p>
                        <p className='text-sm text-gray-500'>
                            với {selectedSession?.tutor}
                        </p>
                        <div className='my-3 flex items-center justify-center gap-4'>
                            <button className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100'>
                                <ChevronLeft size={20} />
                            </button>
                            <p className='font-medium'>
                                20/10/2025 - 26/10/2025
                            </p>
                            <button className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100'>
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className='grid grid-cols-7 gap-2'>
                            {Object.entries(mockCalendarSlots).map(
                                ([day, slots]) => (
                                    <div
                                        key={day}
                                        className='rounded-lg border bg-gray-50 p-2'
                                    >
                                        <p className='text-center font-semibold'>
                                            {dayNameMap[day]}
                                        </p>
                                        <p className='mb-2 text-center text-sm text-gray-400'>
                                            {day}
                                        </p>
                                        <div className='space-y-1.5'>
                                            {slots.map((slot) => {
                                                const isAvailable =
                                                    slot.status === 'available';
                                                const isFull =
                                                    slot.status === 'full';
                                                const isCurrent =
                                                    slot.status === 'current';
                                                return (
                                                    <button
                                                        key={slot.time}
                                                        onClick={() =>
                                                            handleSelectRescheduleSlot(
                                                                day,
                                                                slot.time,
                                                                slot.status,
                                                            )
                                                        }
                                                        disabled={!isAvailable}
                                                        className={`w-full rounded-md border p-1.5 text-xs font-medium ${isAvailable ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200' : ''} ${isFull ? 'border-red-300 bg-red-100 text-red-700 opacity-60' : ''} ${isCurrent ? 'border-blue-300 bg-blue-100 text-blue-700 opacity-60' : ''} `}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 5: Xác nhận Đổi lịch === */}
            {isConfirmRescheduleModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='w-full max-w-lg rounded-lg bg-white p-0 shadow-xl'>
                        <div className='rounded-t-lg bg-blue-500 p-6'>
                            <h2 className='text-center text-2xl font-bold text-white'>
                                Xác nhận đổi lịch
                            </h2>
                        </div>
                        <div className='p-6'>
                            <h3 className='mb-4 text-center text-lg font-semibold'>
                                {selectedSession?.title}
                            </h3>
                            <div className='grid grid-cols-2 gap-6'>
                                <div className='text-center'>
                                    <h4 className='mb-2 text-lg font-bold text-gray-700'>
                                        Lịch cũ
                                    </h4>
                                    <div className='rounded-lg bg-blue-50 p-4'>
                                        <div className='mb-3 flex items-center justify-center gap-2 text-lg'>
                                            <Calendar className='text-blue-500' />
                                            {selectedSession &&
                                                new Date(
                                                    selectedSession.date,
                                                ).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className='flex items-center justify-center gap-2 text-lg'>
                                            <Clock className='text-blue-500' />
                                            {selectedSession?.time}
                                        </div>
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <h4 className='mb-2 text-lg font-bold text-gray-700'>
                                        Lịch mới
                                    </h4>
                                    <div className='rounded-lg bg-green-50 p-4'>
                                        <div className='mb-3 flex items-center justify-center gap-2 text-lg'>
                                            <Calendar className='text-green-600' />
                                            {selectedSlot?.day}/10/2025
                                        </div>
                                        <div className='flex items-center justify-center gap-2 text-lg'>
                                            <Clock className='text-green-600' />
                                            {selectedSlot?.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-6'>
                                <label className='mb-1 block text-sm font-medium text-gray-700'>
                                    Nhập lí do đổi lịch
                                </label>
                                <textarea
                                    className='w-full rounded-lg border border-gray-300 p-2'
                                    placeholder='Lí do...'
                                ></textarea>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 p-6 pt-0'>
                            <button
                                onClick={handleConfirmReschedule}
                                className='rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-green-700'
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={handleCloseAllModals}
                                className='rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700'
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 6: Xác nhận Hủy lịch === */}
            {isCancelModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='w-full max-w-md rounded-lg bg-white p-0 shadow-xl'>
                        <div className='rounded-t-lg bg-blue-500 p-6'>
                            <h2 className='font-B_old text-center text-2xl text-white'>
                                Xác nhận hủy buổi tư vấn
                            </h2>
                        </div>
                        <div className='space-y-2 p-6 text-center'>
                            <h3 className='text-xl font-semibold text-gray-800'>
                                {selectedSession?.title}
                            </h3>
                            <p className='text-gray-600'>
                                với {selectedSession?.tutor}
                            </p>
                            <div className='flex items-center justify-center gap-6 pt-4 text-lg'>
                                <span className='flex items-center gap-2'>
                                    <Calendar className='text-blue-500' />
                                    {selectedSession &&
                                        new Date(
                                            selectedSession.date,
                                        ).toLocaleDateString('vi-VN')}
                                </span>
                                <span className='flex items-center gap-2'>
                                    <Clock className='text-blue-500' />
                                    {selectedSession?.time}
                                </span>
                            </div>
                        </div>
                        <div className='p-6 pt-0'>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>
                                Nhập lí do hủy lịch
                            </label>
                            <textarea
                                className='w-full rounded-lg border border-gray-300 p-2'
                                placeholder='Lí do...'
                            ></textarea>
                        </div>
                        <div className='grid grid-cols-2 gap-4 p-6 pt-0'>
                            <button
                                onClick={handleConfirmCancel}
                                className='rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-green-700'
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={handleCloseAllModals}
                                className='rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700'
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Schedule;
