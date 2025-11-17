import { X, MapPin } from 'lucide-react';
import type { Program } from '@/interfaces/Schedule'; // Import "luật"

// 1. Định nghĩa "props" (dữ liệu) mà component này cần nhận
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProgram: (program: Program) => void;
    programs: Program[];
}

// 2. Tạo component
const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    onSelectProgram,
    programs,
}) => {
    // 3. Nếu không "mở" (isOpen=false) thì không render gì cả
    if (!isOpen) return null;

    // 4. Đây là code JSX của Modal 1
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl'>
                <button
                    onClick={onClose} // Dùng props
                    className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600'
                >
                    <X size={20} />
                </button>
                <h2 className='mb-2 text-xl font-bold'>
                    Các buổi tư vấn của các tutor đã chọn
                </h2>
                <p className='mb-4 text-gray-600'>
                    Chọn một buổi tư vấn để đặt lịch
                </p>
                <div className='max-h-64 space-y-2 overflow-y-auto pr-2'>
                    {programs.map((program) => (
                        <button
                            key={program.id}
                            onClick={() => onSelectProgram(program)} // Dùng props
                            className='flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-gray-50'
                        >
                            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className='font-semibold'>{program.title}</p>
                                <p className='text-sm text-gray-500'>
                                    {program.tutor}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
