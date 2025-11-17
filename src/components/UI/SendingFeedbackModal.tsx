import type { Session } from '@/interfaces/Sesson';
import { Calendar, Check, Clock, Star, X } from 'lucide-react';
import { useState } from 'react';

interface SendingFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
    onSubmitFeedback: (
        id: string,
        review: { rating: number; comment: string },
    ) => void;
}

const SendingFeedbackModal: React.FC<SendingFeedbackModalProps> = ({
    isOpen,
    onClose,
    session,
    onSubmitFeedback,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    if (!isOpen || !session) return null;

    const handleSubmit = () => {
        onSubmitFeedback(session.id, { rating, comment });
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='w-full max-w-lg rounded-2xl bg-white'>
                {/* Header */}
                <div className='relative rounded-t-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 p-6'>
                    <button
                        onClick={onClose}
                        className='absolute right-4 top-4 rounded-lg p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20'
                    >
                        <X size={24} />
                    </button>
                    <div className='flex items-center gap-2 text-white'>
                        <span className='text-2xl'>📝</span>
                        <h2 className='text-2xl font-bold'>
                            Phản hồi buổi học
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                    <h3 className='mb-2 text-xl font-bold text-gray-800'>
                        {session.title}
                    </h3>
                    <p className='mb-4 text-gray-600'>với {session.tutor}</p>

                    <div className='mb-6 flex items-center gap-4 text-gray-600'>
                        <span className='flex items-center gap-1'>
                            <Calendar size={18} className='text-blue-500' />
                            {session.date}
                        </span>
                        <span className='flex items-center gap-1'>
                            <Clock size={18} className='text-blue-500' />
                            {session.time}
                        </span>
                    </div>

                    {/* Rating */}
                    <div className='mb-6'>
                        <label
                            htmlFor='feedback-rating'
                            className='mb-3 block font-bold text-gray-800'
                        >
                            Mức độ hài lòng:
                        </label>
                        <div id='feedback-rating' className='flex gap-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className='transition-transform hover:scale-110'
                                >
                                    <Star
                                        size={40}
                                        className={
                                            rating >= star
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }
                                        fill={
                                            rating >= star
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className='mb-6'>
                        <label
                            htmlFor='feedback-comment'
                            className='mb-3 block font-bold text-gray-800'
                        >
                            Phản hồi buổi học:
                        </label>
                        <textarea
                            id='feedback-comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Viết phản hồi của bạn ở đây...'
                            className='h-32 w-full resize-none rounded-lg border-2 border-blue-200 bg-blue-50 p-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        />
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-4'>
                        <button
                            onClick={handleSubmit}
                            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-semibold text-white transition-colors hover:bg-green-600'
                        >
                            <Check size={20} />
                            Gửi phản hồi
                        </button>
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

export default SendingFeedbackModal;
