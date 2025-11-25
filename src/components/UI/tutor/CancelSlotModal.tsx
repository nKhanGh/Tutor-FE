import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelSlotModal = ({
    isOpen,
    onClose,
    onConfirm,
}: CancelSlotModalProps) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!reason.trim()) {
            alert('Vui lòng nhập lý do hủy.');
            return;
        }
        onConfirm(reason);
        setReason(''); // Reset
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='animate-fade-in-up w-full max-w-md rounded-xl bg-white shadow-xl'>
                <div className='flex items-center justify-between border-b p-5'>
                    <h2 className='flex items-center gap-2 text-xl font-bold text-gray-800'>
                        <AlertTriangle className='text-red-500' size={24} />
                        Hủy lịch hẹn
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 transition-colors hover:text-gray-600'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='space-y-4 p-6'>
                    <p className='text-sm text-gray-600'>
                        Khung giờ này đã được sinh viên đặt. Bạn cần nhập lý do
                        hủy để thông báo cho sinh viên.
                    </p>
                    <div>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            Lý do hủy <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                            className='w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-red-400'
                            rows={4}
                            placeholder='Ví dụ: Bận việc đột xuất, sức khỏe không đảm bảo...'
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-3 rounded-b-xl border-t bg-gray-50 p-5'>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleConfirm}
                        className='rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600'
                    >
                        Xác nhận hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelSlotModal;
