import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';

interface OpenSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback để refresh data cha
}

const OpenSessionModal = ({
    isOpen,
    onClose,
    onSuccess,
}: OpenSessionModalProps) => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxStudents, setMaxStudents] = useState<number>(10);
    const [location, setLocation] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!user) return;

        // Validate cơ bản
        if (!title || !date || !startTime || !endTime || !location) {
            showErrorNotification('Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }

        if (startTime >= endTime) {
            showErrorNotification(
                'Thời gian kết thúc phải sau thời gian bắt đầu.',
            );
            return;
        }

        // Kiểm tra trùng lịch
        const isConflict = storage.checkTimeOverlap(
            user.id,
            date,
            startTime,
            endTime,
        );

        if (isConflict) {
            showErrorNotification(
                'Thời gian này bị trùng với lịch trình hiện có của bạn.',
            );
            return; // Dừng lại, không tạo session
        }

        setIsSubmitting(true);

        // Giả lập delay mạng nhẹ để UX mượt hơn
        setTimeout(() => {
            const success = storage.createOpenSession({
                tutorId: user.id,
                title,
                description,
                date,
                startTime,
                endTime,
                maxStudents,
                location,
            });

            if (success) {
                showSuccessNotification('Đã tạo buổi học thành công!');
                // Reset form
                setTitle('');
                setDescription('');
                setDate('');
                setStartTime('');
                setEndTime('');
                setLocation('');
                setMaxStudents(10);

                if (onSuccess) onSuccess(); // Reload data ở trang Overview
                onClose();
            } else {
                showErrorNotification('Có lỗi xảy ra khi tạo buổi học.');
            }
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
            <div className='animate-fade-in-up flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-xl'>
                {/* Header */}
                <div className='flex items-center justify-between border-b p-5'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Mở buổi tư vấn mới
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 transition-colors hover:text-gray-600'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <form
                        className='space-y-4'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Tiêu đề / Chủ đề{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Ví dụ: Ôn tập về Quá trình Gram-Schmidt'
                                className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                        </div>

                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Mô tả chi tiết
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Nội dung chính, các kiến thức cần chuẩn bị trước...'
                                className='w-full resize-none rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Ngày <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Số lượng tối đa
                                </label>
                                <input
                                    type='number'
                                    value={maxStudents}
                                    onChange={(e) =>
                                        setMaxStudents(Number(e.target.value))
                                    }
                                    min={1}
                                    className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Bắt đầu{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='time'
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Kết thúc{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='time'
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Địa điểm hoặc Link online{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder='Phòng H1-201 hoặc Google Meet'
                                className='w-full rounded-lg border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 rounded-b-xl border-t bg-gray-50 p-5'>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='flex items-center gap-2 rounded-lg bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 disabled:opacity-70'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className='animate-spin' size={20} />
                        ) : (
                            'Tạo buổi học'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpenSessionModal;
