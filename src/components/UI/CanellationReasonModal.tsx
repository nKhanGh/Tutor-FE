import type { Session } from '@/interfaces/booking';
import { Calendar, Clock, X } from 'lucide-react';

interface CancellationReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
}

const CancellationReasonModal: React.FC<CancellationReasonModalProps> = ({
    isOpen,
    onClose,
    session,
}) => {
    if (!isOpen || !session) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='w-full max-w-lg rounded-2xl bg-white'>
                <div className='relative rounded-t-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 p-6'>
                    <button
                        onClick={onClose}
                        className='absolute right-4 top-4 rounded-lg p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20'
                    >
                        <X size={24} />
                    </button>
                    <h2 className='text-2xl font-bold text-white'>
                        Lí do hủy lịch
                    </h2>
                </div>

                {/* Content */}
                <div className='p-6'>
                    <h3 className='mb-2 text-xl font-bold text-gray-800'>
                        {session.title}
                    </h3>
                    <p className='mb-4 text-gray-600'>
                        với {session.tutorName}
                    </p>

                    <div className='mb-6 flex items-center gap-4 text-gray-600'>
                        <span className='flex items-center gap-1'>
                            <Calendar size={18} className='text-gray-500' />
                            {session.date}
                        </span>
                        <span className='flex items-center gap-1'>
                            <Clock size={18} className='text-gray-500' />
                            {session.time}
                        </span>
                    </div>

                    {/* Reason */}
                    <div className='mb-6'>
                        <div className='mb-3 block font-bold text-gray-800'>
                            Lí do hủy:
                        </div>
                        <div className='rounded-lg border-[2px] border-red-200 bg-red-50 p-4'>
                            <p className='text-gray-700'>
                                {session.cancellationReason}
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className='w-full text-center'>
                        <button
                            onClick={onClose}
                            className='rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationReasonModal;
