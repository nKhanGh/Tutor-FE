import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import AddSlotModal, {
    type RecurrenceConfig,
} from '@/components/UI/tutor/AddSlotModal';
import CancelSlotModal from '@/components/UI/tutor/CancelSlotModal';
import SlotDetailModal from '@/components/UI/tutor/SlotDetailModal'; // IMPORT MỚI
import { Plus, ChevronLeft, ChevronRight, Paperclip } from 'lucide-react'; // Import icon Paperclip
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { type AvailabilitySlot } from '@/interfaces';

const AvailabilityManagement = () => {
    const { user } = useAuth();
    const { showSuccessNotification, showInfoNotification } = useNotification();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    // State cho Modal chi tiết
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
        null,
    );

    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [slotToDelete, setSlotToDelete] = useState<AvailabilitySlot | null>(
        null,
    );

    const formatDateLocal = (date: Date): string => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const fetchSlots = useCallback(() => {
        if (!user?.id) return;
        setTimeout(() => {
            const tutorSlots = storage.getSlotsByTutor(user.id);
            setSlots(tutorSlots);
        }, 0);
    }, [user]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const getWeekDays = (startDate: Date) => {
        const days = [];
        const dayOfWeek = startDate.getDay();
        const diff =
            startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(startDate);
        monday.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push({
                dateObj: d,
                dateString: formatDateLocal(d),
                dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
                dayNum: d.getDate(),
            });
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // Xử lý click vào slot
    const handleSlotClick = (slot: AvailabilitySlot) => {
        // Nếu slot đã booked -> Logic cũ (Hủy) hoặc mở detail để xem ai book
        // Nếu slot available -> Mở detail để xem hoặc xóa
        // Để thống nhất, ta mở Modal Detail cho mọi trường hợp
        setSelectedSlot(slot);
        setIsDetailModalOpen(true);
    };

    const handleDeleteFromDetail = (slot: AvailabilitySlot) => {
        // Đóng detail modal trước
        setIsDetailModalOpen(false);
        // Gọi logic xóa cũ
        initiateDelete(slot);
    };

    const handleConfirmCancelBooked = (reason: string) => {
        if (slotToDelete) {
            storage.deleteSlot(slotToDelete.id);
            fetchSlots();
            showInfoNotification(`Đã hủy lịch: "${reason}"`);
            setIsCancelModalOpen(false);
            setSlotToDelete(null);
        }
    };

    const handleSaveSlot = (newSlotData: {
        date: string;
        startTime: string;
        endTime: string;
        recurrence: RecurrenceConfig;
        attachedDocumentIds: number[]; // Nhận documents
    }) => {
        if (!user) return;

        const slotsToAdd: AvailabilitySlot[] = [];
        const { isRecurring, frequency, unit, count } = newSlotData.recurrence;
        const [y, m, d] = newSlotData.date.split('-').map(Number);
        const inputDate = new Date(y, m - 1, d);

        const loopCount = isRecurring ? count : 1;
        let conflictFound = false;
        let conflictDate = '';

        for (let i = 0; i < loopCount; i++) {
            const nextDate = new Date(inputDate);
            if (i > 0) {
                if (unit === 'day')
                    nextDate.setDate(inputDate.getDate() + i * frequency);
                else if (unit === 'week')
                    nextDate.setDate(inputDate.getDate() + i * 7 * frequency);
                else if (unit === 'month')
                    nextDate.setMonth(inputDate.getMonth() + i * frequency);
            }

            const dateString = formatDateLocal(nextDate);

            if (
                storage.checkTimeOverlap(
                    user.id,
                    dateString,
                    newSlotData.startTime,
                    newSlotData.endTime,
                )
            ) {
                conflictFound = true;
                conflictDate = dateString;
                break;
            }

            const newSlot: AvailabilitySlot = {
                id: `slot-${Date.now()}-${i}`,
                tutorId: user.id,
                date: dateString,
                startTime: newSlotData.startTime,
                endTime: newSlotData.endTime,
                status: 'available',
                type: 'one-on-one',
                attachedDocumentIds: newSlotData.attachedDocumentIds, // Lưu documents
            };
            slotsToAdd.push(newSlot);
        }

        if (conflictFound) {
            showInfoNotification(
                `Không thể lưu: Bị trùng lịch vào ngày ${conflictDate}.`,
            );
            return;
        }

        slotsToAdd.forEach((slot) => storage.addSlot(slot));
        fetchSlots();
        showSuccessNotification(
            isRecurring
                ? `Đã tạo ${loopCount} khung giờ.`
                : 'Đã thêm khung giờ mới.',
        );
        setIsAddModalOpen(false);
    };

    const initiateDelete = (slot: AvailabilitySlot) => {
        setSlotToDelete(slot);
        // Logic xóa giữ nguyên như cũ...
        if (slot.type === 'group') {
            if (
                window.confirm(
                    `Bạn có chắc muốn hủy buổi tư vấn "${slot.title}"?`,
                )
            ) {
                storage.deleteSlot(slot.id);
                fetchSlots();
                showInfoNotification(`Đã hủy buổi tư vấn: ${slot.title}`);
                setSlotToDelete(null);
            }
            return;
        }
        if (slot.status === 'booked') {
            setIsCancelModalOpen(true);
            return;
        }
        if (slot.status === 'pending') {
            if (
                window.confirm(
                    `Xóa slot này sẽ hủy yêu cầu của sinh viên ${slot.bookedByStudentName}. Tiếp tục?`,
                )
            ) {
                storage.deleteSlot(slot.id);
                fetchSlots();
                showInfoNotification(`Đã xóa slot và hủy yêu cầu.`);
                setSlotToDelete(null);
            }
            return;
        }
        if (window.confirm('Bạn có chắc muốn xóa khung giờ rảnh này?')) {
            storage.deleteSlot(slot.id);
            fetchSlots();
            showSuccessNotification('Đã xóa khung giờ thành công');
            setSlotToDelete(null);
        }
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam transition-all duration-300 md:ml-[260px]'>
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Quản lý lịch rảnh
                        </h1>
                        <p className='text-gray-500'>
                            Thiết lập các khung giờ bạn sẵn sàng để tư vấn.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className='flex items-center gap-2 rounded-lg bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600'
                    >
                        <Plus size={20} /> Thêm khung giờ mới
                    </button>
                </div>

                <div className='rounded-xl bg-white p-6 shadow-sm'>
                    <div className='mb-6 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={handlePrevWeek}
                                className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50 hover:text-[#0795DF]'
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className='font-bold text-gray-700'>
                                Tuần: {weekDays[0].dayNum}/
                                {weekDays[0].dateObj.getMonth() + 1} -{' '}
                                {weekDays[6].dayNum}/
                                {weekDays[6].dateObj.getMonth() + 1}
                            </span>
                            <button
                                onClick={handleNextWeek}
                                className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50 hover:text-[#0795DF]'
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <h2 className='text-lg font-bold text-gray-800'>
                            Tháng {currentDate.getMonth() + 1},{' '}
                            {currentDate.getFullYear()}
                        </h2>
                    </div>

                    <div className='grid grid-cols-7 border-t border-gray-100'>
                        {weekDays.map((day, index) => {
                            const daySlots = slots
                                .filter((s) => s.date === day.dateString)
                                .sort((a, b) =>
                                    a.startTime.localeCompare(b.startTime),
                                );
                            return (
                                <div
                                    key={day.dateString}
                                    className={`min-h-[300px] border-l border-gray-100 pb-6 pt-4 ${index === 0 ? 'border-l-0' : ''}`}
                                >
                                    <div className='mb-4 text-center'>
                                        <span className='block text-sm font-medium capitalize text-gray-500'>
                                            {day.dayName}
                                        </span>
                                        <span
                                            className={`block text-xl font-bold ${day.dateString === formatDateLocal(new Date()) ? 'text-[#0795DF]' : 'text-gray-800'}`}
                                        >
                                            {day.dayNum}
                                        </span>
                                    </div>
                                    <div className='space-y-2 px-2'>
                                        {daySlots.map((slot) => {
                                            const isGroup =
                                                slot.type === 'group';
                                            let slotClass =
                                                'border-yellow-200 bg-yellow-50 text-yellow-600';
                                            if (isGroup)
                                                slotClass =
                                                    'border-purple-200 bg-purple-50 text-purple-700 hover:shadow-md';
                                            else if (
                                                slot.status === 'available'
                                            )
                                                slotClass =
                                                    'border-green-200 bg-green-50 text-green-600 hover:shadow-md';
                                            else if (slot.status === 'booked')
                                                slotClass =
                                                    'border-red-200 bg-red-50 text-red-500';

                                            return (
                                                <div
                                                    key={slot.id}
                                                    // Thay đổi logic click: Mở modal chi tiết thay vì xóa ngay
                                                    onClick={() =>
                                                        handleSlotClick(slot)
                                                    }
                                                    className={`group relative cursor-pointer rounded-md border p-2 text-center text-xs transition-all ${slotClass}`}
                                                >
                                                    <div className='font-semibold'>
                                                        {slot.startTime} -{' '}
                                                        {slot.endTime}
                                                    </div>

                                                    {/* Icon Paperclip nếu có tài liệu */}
                                                    {slot.attachedDocumentIds &&
                                                        slot.attachedDocumentIds
                                                            .length > 0 && (
                                                            <div className='absolute right-1 top-1 text-current opacity-70'>
                                                                <Paperclip
                                                                    size={10}
                                                                />
                                                            </div>
                                                        )}

                                                    {isGroup ? (
                                                        <div className='mt-1 border-t border-purple-200 pt-1 text-left'>
                                                            <div
                                                                className='mb-0.5 line-clamp-1 font-bold'
                                                                title={
                                                                    slot.title
                                                                }
                                                            >
                                                                {slot.title}
                                                            </div>
                                                            <div className='flex items-center gap-1 text-[10px] opacity-80'>
                                                                <span>
                                                                    Tối đa:{' '}
                                                                    {
                                                                        slot.maxStudents
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {slot.status ===
                                                                'booked' && (
                                                                <div className='mt-1 truncate text-[10px] font-normal'>
                                                                    SV:{' '}
                                                                    {
                                                                        slot.bookedByStudentName
                                                                    }
                                                                </div>
                                                            )}
                                                            {slot.status ===
                                                                'pending' && (
                                                                <div className='mt-1 truncate text-[10px] font-normal'>
                                                                    Chờ duyệt...
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AddSlotModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveSlot}
            />

            <CancelSlotModal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    setIsCancelModalOpen(false);
                    setSlotToDelete(null);
                }}
                onConfirm={handleConfirmCancelBooked}
            />

            {/* MODAL CHI TIẾT SLOT MỚI */}
            <SlotDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                slot={selectedSlot}
                onDelete={handleDeleteFromDetail}
            />
        </>
    );
};

export default AvailabilityManagement;
