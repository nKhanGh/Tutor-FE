import Sidebar from '@/components/layouts/Sidebar';
import CancellationReasonModal from '@/components/UI/CanellationReasonModal';
import FeedbackModal from '@/components/UI/FeedbackModal';
import SendingFeedbackModal from '@/components/UI/SendingFeedbackModal';
import type { Session } from '@/interfaces/Sesson';
import { Search } from 'lucide-react';
import { useState } from 'react';

const StudyHistory = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
    const [reasonModalOpen, setReasonModalOpen] = useState<boolean>(false);
    const [sendingFeedbackModalOpen, setSendingFeedbackModalOpen] =
        useState<boolean>(false);

    const [sessions, setSessions] = useState<Session[]>([
        {
            id: '1',
            date: '18/10/2025',
            time: '15:00 - 16:30',
            title: 'Hệ cơ sở dữ liệu - Đại số quan hệ',
            tutor: 'Cấn Hoàng Hà',
            status: 'completed',
            canFeedback: true,
            canViewReason: false,
        },
        {
            id: '2',
            date: '17/10/2025',
            time: '09:00 - 10:30',
            title: 'Vật lý 1 - Điện trường tĩnh',
            tutor: 'Đặng Phạm Gia Long',
            status: 'completed',
            canFeedback: false,
            canViewReason: false,
            review: {
                rating: 5,
                comment: 'Buổi học rất tuyệt vời!',
            },
        },
        {
            id: '3',
            date: '16/10/2025',
            time: '14:00 - 15:30',
            title: 'Giải tích 2 - Tích phân đường',
            tutor: 'Trương Thanh Nhân',
            status: 'cancelled-tutor',
            canFeedback: false,
            canViewReason: true,
            cancellationReason:
                'Tôi cảm thấy không khỏe nên cần đi bệnh viện gấp, xin lỗi sinh viên và nhà trường vì sự bất tiện này.',
        },
        {
            id: '4',
            date: '14/10/2025',
            time: '10:00 - 11:30',
            title: 'Công nghệ phần mềm - Activity Diagram',
            tutor: 'Cấn Hoàng Hà',
            status: 'cancelled-student',
            canFeedback: false,
            canViewReason: true,
            cancellationReason:
                'Gia đình có việc quan trọng nên tôi phải về quê gấp, chân thành xin lỗi nhà trường và giảng viên hướng dẫn, tôi sẽ tìm buổi khác phù hợp',
        },
        {
            id: '5',
            date: '13/10/2025',
            time: '15:00 - 16:30',
            title: 'Đại số tuyến tính - Định thức & Ma trận nghịch đảo',
            tutor: 'Nguyễn Hữu Khang',
            status: 'completed',
            canFeedback: false,
            canViewReason: false,
            review: {
                rating: 4,
                comment: 'Giảng viên nhiệt tình!',
            },
        },
    ]);

    const updateSessionFeedback = (
        id: string,
        review: { rating: number; comment: string },
    ) => {
        setSessions((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, review, canFeedback: false } : s,
            ),
        );
    };

    const getStatusBadge = (status: Session['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600 sm:px-3 sm:text-sm'>
                        Hoàn thành
                    </span>
                );
            case 'cancelled-tutor':
                return (
                    <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm'>
                        Đã hủy (Tutor)
                    </span>
                );
            case 'cancelled-student':
                return (
                    <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm'>
                        Đã hủy (SV)
                    </span>
                );
            default:
                return null;
        }
    };

    const handleOpenFeedback = (session: Session) => {
        setSelectedSession(session);
        setFeedbackModalOpen(true);
    };

    const handleOpenReason = (session: Session) => {
        setSelectedSession(session);
        setReasonModalOpen(true);
    };

    const handleOpenSendingFeedback = (session: Session) => {
        setSelectedSession(session);
        setSendingFeedbackModalOpen(true);
    };

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.tutor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-4 md:mb-6'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Lịch sử buổi học
                        </h1>
                        <p className='text-base text-gray-600'>
                            Xem lại tất cả các buổi tư vấn đã diễn ra.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className='mb-4 rounded-2xl bg-white p-3 shadow-sm sm:p-4 md:mb-6 md:p-6'>
                        <div className='flex flex-col gap-3 sm:gap-4 lg:flex-row'>
                            <div className='relative flex-1'>
                                <Search
                                    className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 sm:left-4'
                                    size={20}
                                />
                                <input
                                    type='text'
                                    placeholder='Tìm theo môn học, tutor...'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:py-3 sm:pl-12 sm:pr-4 sm:text-base'
                                />
                            </div>
                            <div className='flex items-center gap-2 sm:gap-4'>
                                <input
                                    type='date'
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 sm:py-3 sm:text-base'
                                />
                                <span className='text-gray-500'>-</span>
                                <input
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 sm:py-3 sm:text-base'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sessions - Desktop Table View */}
                    <div className='hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block'>
                        <table className='w-full'>
                            <thead className='border-b bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        NGÀY & GIỜ
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        CHỦ ĐỀ
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        TUTOR
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        TRẠNG THÁI
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        HÀNH ĐỘNG
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {filteredSessions.map((session) => (
                                    <tr
                                        key={session.id}
                                        className='transition-colors hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='font-semibold text-gray-800'>
                                                {session.date}
                                            </div>
                                            <div className='text-sm text-gray-600'>
                                                {session.time}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='font-medium text-gray-800'>
                                                {session.title}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-gray-800'>
                                                {session.tutor}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                {getStatusBadge(session.status)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex flex-col gap-2'>
                                                {session.canFeedback && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenSendingFeedback(
                                                                session,
                                                            )
                                                        }
                                                        className='rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700 transition-colors hover:bg-yellow-200'
                                                    >
                                                        Phản hồi buổi học
                                                    </button>
                                                )}
                                                {session.review && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenFeedback(
                                                                session,
                                                            )
                                                        }
                                                        className='rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-200'
                                                    >
                                                        Xem phản hồi
                                                    </button>
                                                )}
                                                {session.canViewReason && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenReason(
                                                                session,
                                                            )
                                                        }
                                                        className='rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-200'
                                                    >
                                                        Xem lý do
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Load More Button */}
                        <div className='border-t p-6 text-center'>
                            <button className='rounded-lg bg-blue-50 px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-100'>
                                Xem thêm các buổi cũ hơn
                            </button>
                        </div>
                    </div>

                    {/* Sessions - Mobile Card View */}
                    <div className='space-y-3 sm:space-y-4 lg:hidden'>
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className='rounded-xl bg-white p-4 shadow-sm sm:p-5'
                            >
                                {/* Header */}
                                <div className='mb-3 flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='mb-1 text-sm font-semibold text-gray-800 sm:text-base'>
                                            {session.date}
                                        </div>
                                        <div className='text-xs text-gray-600 sm:text-sm'>
                                            {session.time}
                                        </div>
                                    </div>
                                    {getStatusBadge(session.status)}
                                </div>

                                {/* Content */}
                                <div className='mb-3 border-b border-gray-100 pb-3'>
                                    <div className='mb-2 text-sm font-medium text-gray-800 sm:text-base'>
                                        {session.title}
                                    </div>
                                    <div className='text-xs text-gray-600 sm:text-sm'>
                                        Tutor: {session.tutor}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='flex flex-wrap gap-2'>
                                    {session.canFeedback && (
                                        <button
                                            onClick={() =>
                                                handleOpenSendingFeedback(
                                                    session,
                                                )
                                            }
                                            className='min-w-[140px] flex-1 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-700 transition-colors hover:bg-yellow-200 sm:text-sm'
                                        >
                                            Phản hồi buổi học
                                        </button>
                                    )}
                                    {session.review && (
                                        <button
                                            onClick={() =>
                                                handleOpenFeedback(session)
                                            }
                                            className='min-w-[140px] flex-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-200 sm:text-sm'
                                        >
                                            Xem phản hồi
                                        </button>
                                    )}
                                    {session.canViewReason && (
                                        <button
                                            onClick={() =>
                                                handleOpenReason(session)
                                            }
                                            className='min-w-[140px] flex-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-200 sm:text-sm'
                                        >
                                            Xem lý do
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        <div className='pt-2'>
                            <button className='w-full rounded-lg bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 sm:text-base'>
                                Xem thêm các buổi cũ hơn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modals */}
            </div>
            <FeedbackModal
                isOpen={feedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                session={selectedSession}
            />
            <CancellationReasonModal
                isOpen={reasonModalOpen}
                onClose={() => setReasonModalOpen(false)}
                session={selectedSession}
            />
            <SendingFeedbackModal
                isOpen={sendingFeedbackModalOpen}
                onClose={() => setSendingFeedbackModalOpen(false)}
                session={selectedSession}
                onSubmitFeedback={updateSessionFeedback}
            />
        </>
    );
};

export default StudyHistory;
